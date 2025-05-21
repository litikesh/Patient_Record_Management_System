import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Toaster } from "react-hot-toast";
import { DatabaseProvider } from "./components/Context/DatabaseContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DatabaseProvider>
      <App />
      <Toaster position="top-right" reverseOrder={false} />
    </DatabaseProvider>
  </StrictMode>
);
