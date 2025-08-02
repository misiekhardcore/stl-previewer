import { Mesh } from "three";
import { CSGService } from "../csg-service";
import { RenderService, StateManager } from "../render-service";
import { PreviewData } from "../types/preview";
import { Settings } from "../types/settings";

export function renderData(
  viewerElement: HTMLElement,
  stateManager: StateManager,
  data: PreviewData,
  settings: Settings
) {
  const rendererService = RenderService.createInstance(
    viewerElement,
    stateManager,
    Object.values(data).filter(
      (content): content is string => content !== undefined
    ),
    settings
  );

  let csgService: CSGService;
  let mesh;

  if (data.fileContent) {
    const mesh = rendererService.getMesh(data.fileContent);
    mesh && rendererService.renderObject(mesh);
  } else {
    let oldMesh: Mesh | null = null;
    let newMesh: Mesh | null = null;
    if (data.prevFileContent) {
      oldMesh = rendererService.getMesh(data.prevFileContent!);
      oldMesh?.geometry.center();
    }
    if (data.currentFileContent) {
      newMesh = rendererService.getMesh(data.currentFileContent!);
      newMesh?.geometry.center();
    }

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

  // set events
  window.addEventListener(
    "resize",
    () => rendererService.onWindowResize(),
    false
  );
}
