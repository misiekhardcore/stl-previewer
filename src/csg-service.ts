import { BufferAttribute, BufferGeometry, Material } from "three";
import {
  SUBTRACTION,
  Brush,
  Evaluator,
  INTERSECTION,
  ADDITION,
} from "three-bvh-csg";
import { MeshMaterialSettings } from "./types/settings";
import { RenderService } from "./render-service";

type DiffResult = {
  added: Brush | null;
  removed: Brush | null;
  intersection: Brush | null;
  sum: Brush;
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

  private evaluator: Evaluator;
  private firstBrush: Brush | null = null;
  private secondBrush: Brush | null = null;

  constructor(
    firstSolid: BufferGeometry | null,
    secondSolid: BufferGeometry | null,
    private readonly meshMaterial: MeshMaterialSettings
  ) {
    if (!firstSolid && !secondSolid) {
      throw new Error("No solids provided for diff calculation.");
    }
    this.evaluator = new Evaluator();

    if (firstSolid) {
      this.setUv(firstSolid);
      this.firstBrush = new Brush(firstSolid);
    }
    if (secondSolid) {
      this.setUv(secondSolid);
      this.secondBrush = new Brush(secondSolid);
    }
  }

  private setUv(geometry: BufferGeometry) {
    geometry?.setAttribute(
      "uv",
      new BufferAttribute(new Float32Array([]), 1)
    );
  }

  private getAddedDiff(material: Material): Brush | null {
    if (!this.secondBrush) {
      return null;
    }

    if (!this.firstBrush) {
      return new Brush(this.secondBrush.geometry, material);
    }

    const result = this.evaluator.evaluate(
      this.secondBrush,
      this.firstBrush,
      CSGService.operations.SUBTRACTION
    );
    return new Brush(result.geometry, material);
  }

  private getRemovedDiff(material: Material): Brush | null {
    if (!this.firstBrush) {
      return null;
    }

    if (!this.secondBrush) {
      return new Brush(this.firstBrush.geometry, material);
    }

    const result = this.evaluator.evaluate(
      this.firstBrush,
      this.secondBrush,
      CSGService.operations.SUBTRACTION
    );
    return new Brush(result.geometry, material);
  }

  private getIntersection(material: Material): Brush | null {
    if (!this.firstBrush || !this.secondBrush) {
      return null;
    }

    const result = this.evaluator.evaluate(
      this.firstBrush,
      this.secondBrush,
      CSGService.operations.INTERSECTION
    );
    return new Brush(result.geometry, material);
  }

  private hasBothBrushes(): boolean {
    return !!this.firstBrush && !!this.secondBrush;
  }

  private getSum(material: Material): Brush {
    if (!this.firstBrush && !this.secondBrush) {
      throw new Error("No brushes provided for sum calculation.");
    }

    if (!this.firstBrush) {
      return this.secondBrush!;
    }
    if (!this.secondBrush) {
      return this.firstBrush;
    }

    const result = this.evaluator.evaluate(
      this.firstBrush,
      this.secondBrush,
      CSGService.operations.ADDITION
    );
    return new Brush(result.geometry, material);
  }

  getDiff(): DiffResult {
    const opacity = this.hasBothBrushes() ? 0.5 : 1;
    const addedMaterial = this.createColoredMaterial(
      CSGService.colors.ADDED,
      opacity
    );
    const removedMaterial = this.createColoredMaterial(
      CSGService.colors.REMOVED,
      opacity
    );
    const intersectionMaterial = this.createColoredMaterial(
      CSGService.colors.INTERSECTION
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
    opacity: number = 0.5
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
}
