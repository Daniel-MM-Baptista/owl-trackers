import React from "react";
import ReactDOM from "react-dom/client";
import "../index.css";
import OBR from "@owlbear-rodeo/sdk";
import App from "./App";
import { getMetadataFromItems } from "../itemHelpers";

OBR.onReady(async () => {
  const [theme, metadata] = await Promise.all([
    OBR.theme.getTheme(),
    getMetadataFromItems(),
  ]);

  const [trackers, trackersHidden] = metadata;

  ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
      <App
        initialMode={theme.mode}
        initialTrackers={trackers}
        initialHidden={trackersHidden}
      />
    </React.StrictMode>,
  );
});
