import { createRoot } from "react-dom/client";
import { App } from "./App";
import { RenderService, RenderState } from "../render-service";
import { getPreviewData } from "./utils/getPreviewData";

const WEBVIEW_API = acquireVsCodeApi<RenderState>();
const stateManager = {
  getState: () => WEBVIEW_API.getState() || {},
  setState: (s: RenderState) => WEBVIEW_API.setState(s),
  updateState: (s: Partial<RenderState>) =>
    WEBVIEW_API.setState({ ...WEBVIEW_API.getState(), ...s }),
};

const viewerElement = document.getElementById("viewer")!;
const { settings } = getPreviewData();
RenderService.createInstance(viewerElement, stateManager, settings);

const rootElement = document.getElementById("root");
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(<App />);
}
