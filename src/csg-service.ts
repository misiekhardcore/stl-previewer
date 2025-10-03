import { BufferAttribute, BufferGeometry, Material, Mesh } from "three";
import { SUBTRACTION, Brush, INTERSECTION, ADDITION } from "three-bvh-csg";
import { MeshMaterialSettings } from "./types/settings";
import { RenderService } from "./render-service";

type DiffResult = {
  added: Promise<Brush | null>;
  removed: Promise<Brush | null>;
  intersection: Promise<Brush | null>;
  sum: Promise<Brush>;
};

export class CSGService {
  static operations = {
    SUBTRACTION,
    INTERSECTION,
    ADDITION,
  };
  static colors = {
    ADDED: "#00ff00",
    REMOVED: "#ff0000",
    INTERSECTION: "#0000ff",
  };

  private firstBrush: Brush | null = null;
  private secondBrush: Brush | null = null;

  constructor(
    firstMesh: Mesh | null,
    secondMesh: Mesh | null,
    private readonly meshMaterial: MeshMaterialSettings,
  ) {
    if (!firstMesh && !secondMesh) {
      throw new Error("No solids provided for diff calculation.");
    }

    if (firstMesh) {
      this.setUv(firstMesh.geometry);
      this.firstBrush = new Brush(firstMesh.geometry);
    }
    if (secondMesh) {
      this.setUv(secondMesh.geometry);
      this.secondBrush = new Brush(secondMesh.geometry);
    }
  }

  private setUv(geometry: BufferGeometry) {
    geometry?.setAttribute("uv", new BufferAttribute(new Float32Array([]), 1));
  }

  private async evaluate(
    brush1: Brush,
    brush2: Brush,
    operation: typeof ADDITION | typeof SUBTRACTION | typeof INTERSECTION,
  ): Promise<Brush> {
    return new Promise(async (resolve, reject) => {
      try {
        const workerUrl = (window as any).CSG_WORKER_URL;
        if (!workerUrl) {
          console.error("CSG_WORKER_URL is not available");
          throw new Error("CSG worker URL not available");
        }

        const worker = new Worker(workerUrl);

        worker.onmessage = (event) => {
          const { success, result, error } = event.data;
          worker.terminate();

          if (success) {
            resolve(this.reconstructBrush(result));
          } else {
            reject(new Error(error || "Worker evaluation failed"));
          }
        };

        worker.onerror = (error) => {
          worker.terminate();
          reject(error);
        };

        worker.postMessage({
          brush1Data: this.serializeBrush(brush1),
          brush2Data: this.serializeBrush(brush2),
          operation,
        });
      } catch (e) {
        console.error("Worker creation error:", e);
        reject(e);
      }
    });
  }

  private async getAddedDiff(material: Material): Promise<Brush | null> {
    if (!this.secondBrush) {
      return null;
    }

    if (!this.firstBrush) {
      return new Brush(this.secondBrush.geometry, material);
    }

    const result = await this.evaluate(
      this.secondBrush,
      this.firstBrush,
      CSGService.operations.SUBTRACTION,
    );
    return new Brush(result.geometry, material);
  }

  private async getRemovedDiff(material: Material): Promise<Brush | null> {
    if (!this.firstBrush) {
      return null;
    }

    if (!this.secondBrush) {
      return new Brush(this.firstBrush.geometry, material);
    }

    const result = await this.evaluate(
      this.firstBrush,
      this.secondBrush,
      CSGService.operations.SUBTRACTION,
    );
    return new Brush(result.geometry, material);
  }

  private async getIntersection(material: Material): Promise<Brush | null> {
    if (!this.firstBrush || !this.secondBrush) {
      return null;
    }

    const result = await this.evaluate(
      this.firstBrush,
      this.secondBrush,
      CSGService.operations.INTERSECTION,
    );
    return new Brush(result.geometry, material);
  }

  private hasBothBrushes(): boolean {
    return !!this.firstBrush && !!this.secondBrush;
  }

  private async getSum(material: Material): Promise<Brush> {
    if (!this.firstBrush && !this.secondBrush) {
      throw new Error("No brushes provided for sum calculation.");
    }

    if (!this.firstBrush) {
      return this.secondBrush!;
    }

    if (!this.secondBrush) {
      return this.firstBrush!;
    }

    const result = await this.evaluate(
      this.firstBrush,
      this.secondBrush,
      CSGService.operations.ADDITION,
    );
    return new Brush(result.geometry, material);
  }

  getDiff(): DiffResult {
    const opacity = this.hasBothBrushes() ? 0.7 : 1;
    const addedMaterial = this.createColoredMaterial(
      CSGService.colors.ADDED,
      opacity,
    );
    const removedMaterial = this.createColoredMaterial(
      CSGService.colors.REMOVED,
      opacity,
    );
    const intersectionMaterial = this.createColoredMaterial(
      CSGService.colors.INTERSECTION,
    );
    const sumMaterial = RenderService.getMaterial(this.meshMaterial);

    return {
      added: this.getAddedDiff(addedMaterial),
      removed: this.getRemovedDiff(removedMaterial),
      intersection: this.getIntersection(intersectionMaterial),
      sum: this.getSum(sumMaterial),
    };
  }

  private createColoredMaterial(
    color: string,
    opacity: number = 0.7,
  ): Material {
    return RenderService.getMaterial({
      ...this.meshMaterial,
      config: {
        ...this.meshMaterial.config,
        // @ts-expect-error color type mismatch
        color,
        opacity,
        transparent: opacity < 1,
      },
    });
  }

  private serializeBrush(brush: Brush) {
    const geometry = brush.geometry;
    const attributes: any = {};

    for (const [name, attribute] of Object.entries(geometry.attributes)) {
      attributes[name] = {
        array: Array.from(attribute.array),
        itemSize: attribute.itemSize,
      };
    }

    return {
      geometry: {
        attributes,
        index: geometry.index
          ? {
              array: Array.from(geometry.index.array),
            }
          : undefined,
      },
    };
  }

  private reconstructBrush(brushData: any): Brush {
    const geometry = new BufferGeometry();

    const positionArray = new Float32Array(
      brushData.geometry.attributes.position.array,
    );
    geometry.setAttribute(
      "position",
      new BufferAttribute(
        positionArray,
        brushData.geometry.attributes.position.itemSize,
      ),
    );

    const normalArray = new Float32Array(
      brushData.geometry.attributes.normal.array,
    );
    geometry.setAttribute(
      "normal",
      new BufferAttribute(
        normalArray,
        brushData.geometry.attributes.normal.itemSize,
      ),
    );

    if (brushData.geometry.attributes.uv) {
      const uvArray = new Float32Array(brushData.geometry.attributes.uv.array);
      geometry.setAttribute(
        "uv",
        new BufferAttribute(uvArray, brushData.geometry.attributes.uv.itemSize),
      );
    }

    if (brushData.geometry.index) {
      const indexArray = new Uint16Array(brushData.geometry.index.array);
      geometry.setIndex(new BufferAttribute(indexArray, 1));
    }

    return new Brush(geometry);
  }
}
