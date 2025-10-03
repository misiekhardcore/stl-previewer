import { useEffect, useState } from "react";
import { Mesh, PerspectiveCamera } from "three";
import { RenderService } from "../render-service";

interface InfoBoxProps {
  camera: PerspectiveCamera;
  mesh: Mesh;
}

export function InfoBox({ camera, mesh }: InfoBoxProps) {
  const [debugValues, setDebugValues] = useState<string[]>([]);
  const boundingBox = RenderService.getBoundingBoxForMesh(mesh);
  const size = RenderService.getBoundingBoxSize(boundingBox);

  const update = () => {
    const debugData = {
      camera_x: camera.position.x,
      camera_y: camera.position.y,
      camera_z: camera.position.z,
      camera_rotation_x: camera.rotation.x,
      camera_rotation_y: camera.rotation.y,
      camera_rotation_z: camera.rotation.z,
      bounding_box_width: size.x,
      bounding_box_length: size.y,
      bounding_box_height: size.z,
      bounding_box_min_x: boundingBox.min.x,
      bounding_box_max_x: boundingBox.max.x,
      bounding_box_min_y: boundingBox.min.y,
      bounding_box_max_y: boundingBox.max.y,
      bounding_box_min_z: boundingBox.min.y,
      bounding_box_max_z: boundingBox.max.z,
    };

    const debugValues = Object.entries(debugData).map(([key, value]) => {
      return `${key}: ${roundDecimals(value)}`;
    });

    setDebugValues(debugValues);

    window.requestAnimationFrame(update);
  };

  useEffect(() => {
    update();
  }, [camera, mesh]);

  return (
    <div className="info-box">
      {debugValues.map((value) => (
        <span key={value}>{value}</span>
      ))}
    </div>
  );
}

function roundDecimals(num: number): number {
  return Math.round(num * 100) / 100;
}
