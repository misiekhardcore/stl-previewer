import {
  SUBTRACTION,
  Brush,
  Evaluator,
  INTERSECTION,
  ADDITION,
} from "three-bvh-csg";
import { BufferGeometry, BufferAttribute } from "three";

interface WorkerMessage {
  brush1Data: BrushData;
  brush2Data: BrushData;
  operation: typeof ADDITION | typeof SUBTRACTION | typeof INTERSECTION;
}

interface BrushData {
  geometry: {
    attributes: {
      position: { array: number[]; itemSize: number };
      normal: { array: number[]; itemSize: number };
      uv?: { array: number[]; itemSize: number };
    };
    index?: { array: number[] };
  };
}

self.onmessage = (event: MessageEvent<WorkerMessage>) => {
  const { brush1Data, brush2Data, operation } = event.data;

  try {
    const brush1 = reconstructBrush(brush1Data);
    const brush2 = reconstructBrush(brush2Data);

    const evaluator = new Evaluator();
    const result = evaluator.evaluate(brush1, brush2, operation);

    self.postMessage({
      success: true,
      result: serializeBrush(result),
    });
  } catch (error) {
    self.postMessage({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

function reconstructBrush(brushData: BrushData): Brush {
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

function serializeBrush(brush: Brush) {
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
