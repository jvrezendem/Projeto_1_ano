import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/geist";
import "@fontsource/instrument-serif";
import App from "./App";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <TooltipProvider delayDuration={180}>
      <App />
    </TooltipProvider>
  </StrictMode>,
);
