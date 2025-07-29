import { Box3, PerspectiveCamera, Vector3 } from "three";

export function createInfoBox(
  camera: PerspectiveCamera,
  boundingBox: Box3,
  dimensions: Vector3
) {
  const infoBox = document.createElement("div");

  infoBox.setAttribute("id", "info-box");
  infoBox.classList.add("info-box");

  const update = () => {
    const debugData = {
      camera_x: camera.position.x,
      camera_y: camera.position.y,
      camera_z: camera.position.z,
      camera_rotation_x: camera.rotation.x,
      camera_rotation_y: camera.rotation.y,
      camera_rotation_z: camera.rotation.z,
      bounding_box_width: dimensions.x,
      bounding_box_length: dimensions.y,
      bounding_box_height: dimensions.z,
      bounding_box_min_x: boundingBox.min.x,
      bounding_box_max_x: boundingBox.max.x,
      bounding_box_min_y: boundingBox.min.y,
      bounding_box_max_y: boundingBox.max.y,
      bounding_box_min_z: boundingBox.min.y,
      bounding_box_max_z: boundingBox.max.z,
    };

    const debugValues = Object.entries(debugData).map(
      ([key, value]) => {
        return `<div>${key}: ${roundDecimals(value)}</div>`;
      }
    );

    infoBox.innerHTML = debugValues.join("</br>");

    window.requestAnimationFrame(update);
  };

  update();

  return infoBox;
}

function roundDecimals(num: number): number {
  return Math.round(num * 100) / 100;
}
