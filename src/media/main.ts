import { ContentService } from "../content-service";
import { CSGService } from "../csg-service";
import { RenderService, RenderState } from "../render-service";
import { PreviewData } from "../types/preview";
import { createInfoBox } from "./info-box";

const WEBVIEW_API = acquireVsCodeApi<RenderState>();
let previewData: PreviewData;
const viewerElement = document.getElementById("viewer")!;

// -----------------------------------------
// functions

function getPreviewData(): PreviewData {
  if (previewData) {
    return previewData;
  }

  const element = document.getElementById("settings");
  if (element) {
    const data = element.getAttribute("data-settings");
    if (data) {
      // cache so we dont need to go over and over the DOM
      previewData = ContentService.parse<PreviewData>(data);
      return previewData;
    }
  }

  throw new Error("Could not load settings");
}

function init() {
  const { settings, data } = getPreviewData();
  const rendererService = new RenderService(
    viewerElement,
    WEBVIEW_API,
    data,
    settings
  );

  const camera = rendererService.getCamera();
  const meshes = rendererService.getMeshes();

  if (meshes.length !== 2) {
    rendererService.renderObject(...meshes);
  } else {
    const csgService = new CSGService(
      meshes[0].geometry,
      meshes[1].geometry,
      settings.meshMaterial
    );
    const { added, removed, intersection } = csgService.getDiff();
    added && rendererService.renderObject(added);
    removed && rendererService.renderObject(removed);
    intersection && rendererService.renderObject(intersection);
  }

  const boundingBox = rendererService.getMeshBoundingBox(meshes[0]);
  const dimensions =
    rendererService.getBoundingBoxDimensions(boundingBox);

  if (settings.view.showInfo) {
    const infoBox = createInfoBox(camera, boundingBox, dimensions);
    viewerElement.appendChild(infoBox);
  }

  // set events
  window.addEventListener(
    "resize",
    () => rendererService.onWindowResize(),
    false
  );

  const actionsEl = document.getElementById("actions")!;
  if (settings.view.showViewButtons) {
    (["isometric", "top", "left", "right", "bottom"] as const).forEach(
      (action) => {
        document
          .querySelector<HTMLButtonElement>(`.button--${action}`)!
          .addEventListener("click", () => {
            rendererService.setCameraPosition(action);
          });
      }
    );
  } else {
    actionsEl.remove();
  }
}

// -----------------------------------------
// runtime

init();
