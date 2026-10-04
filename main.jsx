import React from "react";
import ReactDOM from "react-dom/client";
import App from "./AppV2.jsx";
import ErrorBoundary from './ErrorBoundary.jsx';
import "./index.css";
import "./pro.css";
import "./readability.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ErrorBoundary><App /></ErrorBoundary>
  </React.StrictMode>
);
