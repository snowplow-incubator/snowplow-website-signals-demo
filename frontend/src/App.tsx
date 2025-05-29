import { useEffect, useState } from "react";
import { SignalsAdminButton } from "./components/signals-admin/SignalsAdminButton";
import { SplashScreen } from "./components/signals-admin/SplashScreen";
import { SignalsWidget } from "./components/signals-admin/SignalsWidget";
import { getSnowplowIds } from "./lib/utils";

function App() {
  const [isSignalsDemo, setIsSignalsDemo] = useState(false);
  const [openWidget, setOpenWidget] = useState(false);
  const [openSplashScreen, setOpenSplashScreen] = useState(false);
  const [browserAttributes, setBrowserAttributes] = useState<any[]>([]);
  const [clickAttributes, setClickAttributes] = useState<any[]>([]);
  const [conversionScore, setConversionScore] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    console.log(window.location.search)
    console.log("URL params:", params.toString());
    if (params.get("signals-demo") === "true") {
      // Do something, e.g., open the widget automatically
      setIsSignalsDemo(true);
    }
  }, []);
  const [progress, setProgress] = useState(null);

  function formatAttributes(data: Record<string, any>, includeAttributes: string[] = []) {
    return Object.entries(data)
      .filter(([name]) => includeAttributes.includes(name))
      .map(([name, valueObj]) => ({
        name,
        value: valueObj
      }));
  }

  useEffect(() => {
    if (openWidget) {
      document.body.style.marginRight = `450px`;
    } else {
      document.body.style.marginRight = "0";
    }
    // Optional: cleanup on unmount
    return () => {
      document.body.style.marginRight = "0";
    };
  }, [openWidget]);

  // Polling for the attribute showcase when we have an available API
  useEffect(() => {
    const fetchAttributes = async () => {
      const ids = getSnowplowIds();
      if (ids) {
        const predictionRes = await fetch(
          `http://localhost:8000/api/predict/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            domain_userid: ids.domain_userid,
          })
        }
        );

        const predictionResJson = await predictionRes.json();
        setBrowserAttributes(formatAttributes(predictionResJson.signals, [
          "latest_app_id",
          "latest_device_class",
          "first_mkt_medium_l30d",
          "first_refr_medium_l30d"
        ]
        ));
        setClickAttributes(formatAttributes(predictionResJson.signals, [
          "num_sessions_l7d",
          "num_page_views_l7d",
          "num_page_pings_l7d",
          "num_pricing_views_l7d",
          "num_conversions_l7d",
          "num_form_engagements_l7d",
          "num_use_cases_views_l7d",
        ]
        ));
        setConversionScore(predictionResJson.score * 100);
        setProgress(predictionResJson.progress);
      }

    }
    const interval = setInterval(fetchAttributes, 2000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleOpenDemo = () => {
    setIsSignalsDemo(false)
    setOpenWidget(true);
    setOpenSplashScreen(false);
  }
  return (
    <>
      {isSignalsDemo && (
        <SignalsAdminButton
          active={isSignalsDemo}
          onClick={() => setOpenSplashScreen(true)}
        />)}
      {openSplashScreen && <SplashScreen onClose={handleOpenDemo} />}
      <SignalsWidget
        browserAttributes={browserAttributes}
        clickAttributes={clickAttributes}
        isOpen={openWidget}
        conversionScore={conversionScore}
        progress={progress}
        onToggle={() => setOpenWidget(!openWidget)}
      />
    </>
  );
}

export default App;
