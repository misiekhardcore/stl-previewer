import { Mesh } from "three";
import { CSGService } from "../csg-service";
import { RenderService } from "../render-service";
import { PreviewData } from "../types/preview";
import { Settings } from "../types/settings";

export function renderData(
  rendererService: RenderService,
  data: PreviewData,
  settings: Settings
): Mesh | null {
  let mesh: Mesh | null = null;
  let csgService: CSGService;
  if (data.fileContent) {
    mesh = rendererService.createMesh(data.fileContent);
    rendererService.renderObject(mesh);
  } else {
    let oldMesh: Mesh | null = null;
    let newMesh: Mesh | null = null;
    if (data.prevFileContent) {
      oldMesh = rendererService.createMesh(data.prevFileContent);
    }
    if (data.currentFileContent) {
      newMesh = rendererService.createMesh(data.currentFileContent);
    }

    csgService = new CSGService(
      oldMesh,
      newMesh,
      settings.meshMaterial
    );

    const { added, removed, intersection, sum } = csgService.getDiff();

    added && rendererService.renderObject(added);
    removed && rendererService.renderObject(removed);
    intersection && rendererService.renderObject(intersection);

    mesh = sum;
  }
  if (!mesh) {
    return null;
  }

  rendererService.setCameraPosition({ mesh });
  rendererService.createExtras(mesh);

  return mesh;
}
