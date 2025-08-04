import { Mesh } from "three";
import { CSGService } from "../csg-service";
import { RenderService } from "../render-service";
import { PreviewData } from "../types/preview";
import { Settings } from "../types/settings";

export async function renderData(
  rendererService: RenderService,
  data: PreviewData,
  settings: Settings
): Promise<Mesh | null> {
  let mesh: Mesh | null = null;
  let csgService: CSGService;
  if (data.fileContent) {
    mesh = await rendererService.createMesh(data.fileContent);
    rendererService.renderObject(mesh);
  } else {
    const [oldMesh, newMesh] = await Promise.all([
      data.prevFileContent
        ? rendererService.createMesh(data.prevFileContent)
        : null,
      data.currentFileContent
        ? rendererService.createMesh(data.currentFileContent)
        : null,
    ]);

    csgService = new CSGService(
      oldMesh,
      newMesh,
      settings.meshMaterial
    );

    const { added, removed, intersection, sum } = csgService.getDiff();

    const [addedMesh, removedMesh, intersectionMesh, sumMesh] =
      await Promise.all([added, removed, intersection, sum]);

    addedMesh && rendererService.renderObject(addedMesh);
    removedMesh && rendererService.renderObject(removedMesh);
    intersectionMesh && rendererService.renderObject(intersectionMesh);

    mesh = sumMesh;
  }
  if (!mesh) {
    return null;
  }

  rendererService.setCameraPosition({ mesh });
  rendererService.createExtras(mesh);

  return mesh;
}
