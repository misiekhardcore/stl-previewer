import { useState } from "react";
import { Controls } from "./controls";
import { usePreviewData } from "./hooks/usePreviewData";
import { InfoBox } from "./info-box";
import { RenderService } from "../render-service";
import { Mesh } from "three";

export function App() {
  const rendererService = RenderService.getInstance();
  const { settings } = usePreviewData();
  const camera = rendererService.getCamera();
  const [mesh] = useState<Mesh | null>(rendererService.getFirstMesh());

  if (!mesh) {
    return null;
  }

  return (
    <>
      {settings?.view.showInfo && (
        <InfoBox camera={camera} mesh={mesh} />
      )}
      {settings?.view.showViewButtons && (
        <Controls
          onButtonClick={(button) => {
            rendererService.setCameraPosition({
              position: button,
              mesh,
            });
          }}
        />
      )}
    </>
  );
}
