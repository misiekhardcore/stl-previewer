import { createRoot } from "react-dom/client";
import { App } from "./App";
import { renderData } from "./renderData";
import { RenderState } from "../render-service";
import { getPreviewData } from "./utils/getPreviewData";

const WEBVIEW_API = acquireVsCodeApi<RenderState>();
const viewerElement = document.getElementById("viewer")!;
const { settings, data } = getPreviewData();

const stateManager = {
  getState: () => WEBVIEW_API.getState() || {},
  setState: (s: RenderState) => WEBVIEW_API.setState(s),
};

renderData(viewerElement, stateManager, data, settings);

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
