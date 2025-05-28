import { useEffect, useState } from "react";
import { SignalsAdminButton } from "./components/signals-admin/SignalsAdminButton";
import { SplashScreen } from "./components/signals-admin/SplashScreen";
import { SignalsWidget } from "./components/signals-admin/SignalsWidget";
import { getSnowplowIds } from "./lib/utils";

function App() {
  const [isSignalsOpen, setIsSignalsOpen] = useState(true);
  const [startDemo, setStartDemo] = useState(false);
  const [attributes, setAttributes] = useState<any[]>([]);
  const [conversionScore, setConversionScore] = useState(0);

  const [progress, setProgress] = useState(null);

  function formatAttributes(data: Record<string, any>) {
    return Object.entries(data).map(([name, valueObj]) => ({
      name,
      value: valueObj
    }));
  }

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
        setAttributes(formatAttributes(predictionResJson.signals));
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
    setIsSignalsOpen(true);
    setStartDemo(false);
  }
  return (
    <>
      <SignalsAdminButton
        active={startDemo}
        onClick={() => setStartDemo(!startDemo)}
      />
      {startDemo && <SplashScreen onClose={handleOpenDemo} />}
      <SignalsWidget
        attributes={attributes}
        isOpen={isSignalsOpen}
        conversionScore={conversionScore}
        progress={progress}
        onToggle={() => setIsSignalsOpen(false)}
      />
    </>
  );
}

export default App;
