import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./global.css";

// Helper to inject CSS into shadow root
function injectCSS(shadowRoot: ShadowRoot, cssHref: string) {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = cssHref;
  shadowRoot.appendChild(link);
}

const mountWidget = () => {
  const rootId = "signals-components-root";
  let hostElem = document.getElementById(rootId);
  if (!hostElem) {
    hostElem = document.createElement("div");
    hostElem.id = rootId;
    document.body.appendChild(hostElem);
  }

  // Attach shadow root if not already present
  let shadow = hostElem.shadowRoot;
  if (!shadow) {
    shadow = hostElem.attachShadow({ mode: "open" });
    injectCSS(
      shadow,
      "https://cdn.jsdelivr.net/gh/snowplow-incubator/snowplow-website-signals-demo@main/frontend/dist/vite-widget.css"
    );
  }

  // Create a container inside shadow root for React
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