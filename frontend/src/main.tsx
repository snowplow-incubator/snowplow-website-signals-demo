import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./global.css";

// Ensure the root element exists
const rootId = "signals-components-root";
let rootElem = document.getElementById(rootId);
if (!rootElem) {
  rootElem = document.createElement("div");
  rootElem.id = rootId;
  document.body.appendChild(rootElem);
}

createRoot(rootElem).render(
  <StrictMode>
    <App />
  </StrictMode>
);