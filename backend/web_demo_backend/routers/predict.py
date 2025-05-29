from fastapi import APIRouter
from pydantic import BaseModel
import datetime
from ..signals.signals import sp_signals

router = APIRouter()

view = sp_signals.get_view(name="snowplow_website_demo", version=3)

df_columns = [
    "latest_app_id",
    "latest_device_class",
    "first_mkt_medium_l30d",
    "first_refr_medium_l30d",
    "num_sessions_l7d",
    "num_page_views_l7d",
    "num_page_pings_l7d",
    "num_pricing_views_l7d",
    "num_conversions_l7d",
    "num_form_engagements_l7d",
    "num_use_cases_views_l7d",
]


class InputData(BaseModel):
    domain_userid: str
    # ... add more input columns if needed


def get_duid_values(duid: str):
    response = sp_signals.get_online_attributes(view, duid)
    df = response.to_dataframe()

    # Add your own custom columns and filters
    get_len = lambda x: len(x) if hasattr(x, "__len__") else 0
    df["day_of_week"] = datetime.date.today().isoweekday()
    df[df.filter(like="num_").columns] = df.filter(like="num_").fillna(0)

    # Switch counter columns to booleans
    df["had_conversions_l7d"] = (df["num_conversions_l7d"] > 0).astype(int)
    df = df.drop(columns=["num_conversions_l7d"])

    # Switch unique arrays to amounts
    df["num_sessions_l7d"] = df["num_sessions_l7d"].apply(get_len)

    # Reorder columns to follow the training order
    df = df.reindex(columns=df_columns, fill_value=0)

    return df


def get_progress(signals_response):
    if signals_response["num_use_cases_views_l7d"][0] == 0:
        return "solutions"

    if signals_response["num_pricing_views_l7d"][0] == 0:
        print(signals_response["num_pricing_views_l7d"][0])
        return "pricing"

    if signals_response["num_form_engagements_l7d"][0] == 0:
        return "form"

    if signals_response["num_conversions_l7d"][0] == 0:
        return "submit"


def get_predictions(signals_response):
    prediction = 0
    prediction_metrics = [
        "num_pricing_views_l7d",
        "num_form_engagements_l7d",
        "num_conversions_l7d",
        "num_use_cases_views_l7d",
    ]

    for metric in prediction_metrics:
        if signals_response[metric][0] > 0:
            prediction += 0.25
    return prediction


@router.post("/")
def predict(data: InputData):
    signals_response = get_duid_values(data.domain_userid)
    prediction = get_predictions(signals_response)
    progress = get_progress(signals_response)

    return {
        "signals": signals_response.to_dict(orient="records")[0],
        "score": prediction,
        "progress": progress,
    }
