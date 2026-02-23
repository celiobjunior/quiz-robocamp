import React from "react";
import ReactDOM from "react-dom/client";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { QuizProvider } from "./context/QuizContext";
import "./styles/theme.css";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <QuizProvider>
        <App />
        <SpeedInsights />
      </QuizProvider>
    </BrowserRouter>
  </React.StrictMode>
);
