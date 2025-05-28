import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./global.css";

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
    hostElem.style.position = "fixed";
    hostElem.style.top = "0";
    hostElem.style.left = "0";
    hostElem.style.width = "100vw";
    hostElem.style.height = "100vh";
    hostElem.style.zIndex = "9999";
    document.body.appendChild(hostElem);
  }
  let shadow = hostElem.shadowRoot;
  if (!shadow) {
    shadow = hostElem.attachShadow({ mode: "open" });
    await injectCSS(
      shadow,
      "https://cdn.jsdelivr.net/gh/snowplow-incubator/snowplow-website-signals-demo@main/frontend/dist/vite-widget.css"
    );
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