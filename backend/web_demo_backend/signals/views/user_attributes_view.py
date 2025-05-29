from snowplow_signals import View, domain_userid
from ..attributes.user_attributes import (
    latest_app_id,
    latest_device_class,
    num_sessions_l7d,
    first_refr_medium_l30d,
    first_mkt_medium_l30d,
    num_page_views_l7d,
    num_page_pings_l7d,
    num_pricing_views_l7d,
    num_conversions_l7d,
    num_form_engagements_l7d,
    num_use_cases_views_l7d,
)

# View Name
DEMO_VIEW_NAME = "snowplow_website_demo"
view_version = 2


# Wrap attributes into a view
user_attributes_view = View(
    name=DEMO_VIEW_NAME,
    version=view_version,
    entity=domain_userid,
    attributes=[
        latest_app_id,
        latest_device_class,
        num_sessions_l7d,
        num_page_views_l7d,
        num_page_pings_l7d,
        num_pricing_views_l7d,
        num_conversions_l7d,
        num_form_engagements_l7d,
        first_refr_medium_l30d,
        first_mkt_medium_l30d,
        num_use_cases_views_l7d,
    ],
    owner="jack.keene@snowplow.io",
)
