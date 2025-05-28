import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./global.css";

createRoot(document.getElementById("signals-components-root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
