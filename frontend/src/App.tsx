import { useEffect, useState } from "react";
import { SplashScreen } from "./components/signals-admin/SplashScreen";
import { SignalsWidget } from "./components/signals-admin/SignalsWidget";
import { getSnowplowIds, formatAttributes, getPredictionScore, getProgress } from "./lib/utils";
import { ArrowLeftFromLine } from "lucide-react"
import { clickAttributesList, browserAttributesList } from "./lib/constants";
function App() {
  const [isSignalsDemo, setIsSignalsDemo] = useState(false);
  const [openWidget, setOpenWidget] = useState(() => {
    const stored = localStorage.getItem("openWidget");
    return stored === "true";
  });

  const [demoStart, setDemoStart] = useState(false);
  const [browserAttributes, setBrowserAttributes] = useState<any[]>([]);
  const [clickAttributes, setClickAttributes] = useState<any[]>([]);
  const [conversionScore, setConversionScore] = useState(0);
  const [progress, setProgress] = useState<"solutions" | "pricing" | "form" | "submit" | undefined>(undefined);

  useEffect(() => {
    localStorage.setItem("openWidget", openWidget ? "true" : "false");
  }, [openWidget]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const signalsDemoParam = params.get("signals-demo") === "true";
    const signalsDemoStorage = localStorage.getItem("signals-demo") === "true";
    if (signalsDemoParam || signalsDemoStorage) {
      setIsSignalsDemo(true);
    }
  }, []);

  useEffect(() => {
    if (openWidget) {
      document.body.style.marginRight = `450px`;
    } else {
      document.body.style.marginRight = "0";
    }
    return () => {
      document.body.style.marginRight = "0";
    };
  }, [openWidget]);

  // Polling for the attribute showcase when we have an available API
  useEffect(() => {
    const fetchAttributes = async () => {
      const ids = getSnowplowIds();
      if (ids) {
        const res = await fetch(
          `https://08bd-2a01-4b00-ae21-b000-44a3-1836-7bdb-71c0.ngrok-free.app/api/web_features?domainUserId=${ids.domain_userid}`,
          {
            method: "GET",
            headers: {
              "ngrok-skip-browser-warning": "69420"
            }
          }
        );
        const resJson = await res.json();
        setBrowserAttributes(formatAttributes(resJson, browserAttributesList));
        setClickAttributes(formatAttributes(resJson, clickAttributesList));
        setConversionScore(getPredictionScore(resJson))
        setProgress(getProgress(resJson));

      }
    }

    const interval = setInterval(fetchAttributes, 2000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const handleOpenDemo = () => {
    setIsSignalsDemo(false)
    setDemoStart(true);
    setOpenWidget(true);
  }
  return (
    <>
      {isSignalsDemo && <SplashScreen onClose={handleOpenDemo} />}
      <SignalsWidget
        browserAttributes={browserAttributes}
        clickAttributes={clickAttributes}
        isOpen={openWidget}
        conversionScore={conversionScore}
        progress={progress}
        onToggle={() => setOpenWidget(!openWidget)}
      />
      {!openWidget && !demoStart && (
        <button
          onClick={() => setOpenWidget(!openWidget)}
          className="fixed bg-brand top-[95px] right-6 text-white hover:text-white transition-colors z-50 w-12 h-12 flex items-center justify-center rounded shadow-lg p-2"
          aria-label="Open signals panel"
        >
          <ArrowLeftFromLine size={20} />
        </button>
      )}

    </>
  );
}

export default App;
