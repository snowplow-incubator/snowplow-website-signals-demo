from datetime import timedelta
from snowplow_signals import (
    Attribute,
    Criteria,
    Criterion,
    Event,
)

# Define Standard Events
sp_page_view = Event(
    vendor="com.snowplowanalytics.snowplow", name="page_view", version="1-0-0"
)
sp_page_ping = Event(
    vendor="com.snowplowanalytics.snowplow", name="page_ping", version="1-0-0"
)
sp_submit_form = Event(
    vendor="com.snowplowanalytics.snowplow", name="submit_form", version="1-0-0"
)
sp_focus_form = Event(
    vendor="com.snowplowanalytics.snowplow", name="focus_form", version="1-0-0"
)
sp_change_form = Event(
    vendor="com.snowplowanalytics.snowplow", name="change_form", version="1-0-0"
)

l7d = timedelta(days=7)
l30d = timedelta(days=30)

latest_app_id = Attribute(
    name="latest_app_id",
    type="string",
    events=[sp_page_view],
    aggregation="last",
    property="app_id",
)

latest_device_class = Attribute(
    name="latest_device_class",
    type="string",
    events=[sp_page_view],
    aggregation="last",
    property="contexts_nl_basjes_yauaa_context_1[0].deviceClass",
)

first_refr_medium_l30d = Attribute(
    name="first_refr_medium_l30d",
    type="string",
    events=[sp_page_view],
    period=l30d,
    aggregation="first",
    property="refr_medium",
)

first_mkt_medium_l30d = Attribute(
    name="first_mkt_medium_l30d",
    type="string",
    events=[sp_page_view],
    period=l30d,
    aggregation="first",
    property="mkt_medium",
)

num_sessions_l7d = Attribute(
    name="num_sessions_l7d",
    type="string_list",
    events=[sp_page_view],
    period=l7d,
    aggregation="unique_list",
    property="domain_sessionid",
    default_value=[],
)

num_page_views_l7d = Attribute(
    name="num_page_views_l7d",
    type="int32",
    events=[sp_page_view],
    period=l7d,
    aggregation="counter",
    default_value=0,
)

num_page_pings_l7d = Attribute(
    name="num_page_pings_l7d",
    type="int32",
    events=[sp_page_ping],
    period=l7d,
    aggregation="counter",
    default_value=0,
)

num_pricing_views_l7d = Attribute(
    name="num_pricing_views_l7d",
    type="int32",
    events=[sp_page_view],
    period=l7d,
    aggregation="counter",
    default_value=0,
    criteria=Criteria(
        all=[Criterion(property="page_url", operator="like", value="%pricing%")]
    ),
)

num_conversions_l7d = Attribute(
    name="num_conversions_l7d",
    type="int32",
    events=[sp_submit_form],
    period=l7d,
    aggregation="counter",
    default_value=0,
)

num_form_engagements_l7d = Attribute(
    name="num_form_engagements_l7d",
    type="int32",
    events=[sp_focus_form, sp_change_form],
    period=l7d,
    aggregation="counter",
    default_value=0,
)

num_use_cases_views_l7d = Attribute(
    name="num_use_cases_views_l7d",
    type="int32",
    events=[sp_page_view],
    period=l7d,
    aggregation="counter",
    default_value=0,
    criteria=Criteria(
        all=[Criterion(property="page_url", operator="like", value="%use-cases%")]
    ),
)
