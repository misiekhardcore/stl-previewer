import { ContentService } from "../content-service";
import { CSGService } from "../csg-service";
import { RenderService, RenderState } from "../render-service";
import { PreviewResponse } from "../types/preview";
import { createInfoBox } from "./info-box";

const WEBVIEW_API = acquireVsCodeApi<RenderState>();
const viewerElement = document.getElementById("viewer")!;

// -----------------------------------------
// functions

function getPreviewData(): PreviewResponse {
  const element = document.getElementById("settings");
  if (element) {
    const data = element.getAttribute("data-settings");
    if (data) {
      // cache so we dont need to go over and over the DOM
      return ContentService.parse<PreviewResponse>(data);
    }
  }

  throw new Error("Could not load settings");
}

function init() {
  const { settings, data } = getPreviewData();
  const rendererService = new RenderService(
    viewerElement,
    WEBVIEW_API,
    Object.values(data).filter((content) => content !== undefined),
    settings
  );

  const camera = rendererService.getCamera();
  let csgService: CSGService;
  let mesh;

  if (data.fileContent && rendererService.hasMesh(data.fileContent)) {
    mesh = rendererService.getMesh(data.fileContent)!;
    rendererService.renderObject(mesh);
  } else {
    const oldMesh = rendererService.getMesh(data.prevFileContent!);
    const newMesh = rendererService.getMesh(data.currentFileContent!);
    oldMesh?.geometry.center();
    newMesh?.geometry.center();

    csgService = new CSGService(
      oldMesh?.geometry ?? null,
      newMesh?.geometry ?? null,
      settings.meshMaterial
    );

    const { added, removed, intersection, sum } = csgService.getDiff();
    added && rendererService.renderObject(added);
    removed && rendererService.renderObject(removed);
    intersection && rendererService.renderObject(intersection);
    mesh = sum;
  }
  rendererService.setCameraPosition({ mesh });

  if (settings.view.showInfo) {
    const boundingBox = rendererService.getMeshBoundingBox(mesh);
    const dimensions =
      rendererService.getBoundingBoxDimensions(boundingBox);
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
            rendererService.setCameraPosition({
              position: action,
              mesh,
            });
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
