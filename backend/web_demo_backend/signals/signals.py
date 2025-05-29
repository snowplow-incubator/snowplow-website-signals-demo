import os
from snowplow_signals import Signals

sp_signals = Signals(
    api_url=os.environ["SNOWPLOW_API_URL"],
    api_key=os.environ["SNOWPLOW_API_KEY"],
    api_key_id=os.environ["SNOWPLOW_API_KEY_ID"],
    org_id=os.environ["SNOWPLOW_ORG_ID"],
)
