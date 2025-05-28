import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./global.css";

// Only use Shadow DOM in production build
const isEmbed = true
if (isEmbed) {

  function injectCSS(shadowRoot: ShadowRoot, cssHref: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = cssHref;
      link.onload = () => resolve();
      link.onerror = reject;
      shadowRoot.appendChild(link);
    });
  }

  const mountWidget = async () => {
    const rootId = "signals-components-root";
    let hostElem = document.getElementById(rootId);
    if (!hostElem) {
      hostElem = document.createElement("div");
      hostElem.id = rootId;
      // Optional: position the widget
      hostElem.style.position = "fixed";
      hostElem.style.bottom = "24px";
      hostElem.style.right = "24px";
      hostElem.style.zIndex = "9999";
      document.body.appendChild(hostElem);
    }

    let shadow = hostElem.shadowRoot;
    if (!shadow) {
      shadow = hostElem.attachShadow({ mode: "open" });
      const cssHref =
        location.hostname === "localhost" || location.hostname === "127.0.0.1"
          ? "/dist/vite-widget.css"
          : "https://cdn.jsdelivr.net/gh/snowplow-incubator/snowplow-website-signals-demo@main/frontend/dist/vite-widget.css";

      await injectCSS(shadow, cssHref);
    }

    let shadowContainer = shadow.getElementById("shadow-widget-root");
    if (!shadowContainer) {
      shadowContainer = document.createElement("div");
      shadowContainer.id = "shadow-widget-root";
      shadow.appendChild(shadowContainer);
    }

    createRoot(shadowContainer).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountWidget);
  } else {
    mountWidget();
  }
}
else {
  // Dev mode: mount to #root
  const rootElem = document.getElementById("root");
  if (rootElem) {
    createRoot(rootElem).render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  }
}