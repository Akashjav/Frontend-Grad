
import { createRoot } from "react-dom/client";
import App from "./app/App.tsx";
import { AuthProvider } from "./app/AuthContext";
import ErrorBoundary from "./app/ErrorBoundary";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(<ErrorBoundary><AuthProvider><App /></AuthProvider></ErrorBoundary>);
