import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import GoogleAuthProvider from "./components/GoogleAuthProvider";
import App from "./App";
import "./style.css";

createRoot(document.getElementById("app")!).render(
  <StrictMode>
    <GoogleAuthProvider>
      <App />
    </GoogleAuthProvider>
  </StrictMode>,
);
