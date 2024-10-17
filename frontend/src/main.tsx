import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import { GameStateProvider } from "./contexts/gameContext.tsx";
import App from "./App.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <GameStateProvider>
      <Router>
        <App />
      </Router>
    </GameStateProvider>
  </StrictMode>
);