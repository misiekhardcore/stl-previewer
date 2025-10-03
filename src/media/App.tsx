// @ts-nocheck
import { useEffect, useState } from "react";
import { Controls } from "./controls";
import { usePreviewData } from "./hooks/usePreviewData";
import { InfoBox } from "./info-box";
import { RenderService } from "../render-service";
import { Mesh } from "three";
import { renderData } from "./renderData";
import { PreviewData } from "../types/preview";
import { Loading } from "./Loading";

export function App() {
  const rendererService = RenderService.getInstance();
  const { settings, data } = usePreviewData();
  const camera = rendererService.getCamera();
  const [mesh, setMesh] = useState<Mesh | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (hasData(data)) {
      setIsLoading(true);
      renderData(rendererService, data, settings)
        .then((mesh) => {
          setMesh(mesh);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [data, settings]);

  useEffect(() => {
    const onWindowResize = () => rendererService.onWindowResize();
    window.addEventListener("resize", onWindowResize, false);

    return () => {
      window.removeEventListener("resize", onWindowResize);
    };
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  if (!mesh) {
    return <div className="error">No mesh</div>;
  }

  return (
    <>
      {settings?.view.showInfo && <InfoBox camera={camera} mesh={mesh} />}
      {settings?.view.showViewButtons && (
        <Controls
          onButtonClick={(position) => {
            rendererService.setCameraPosition({
              position,
            });
          }}
        />
      )}
    </>
  );
}

function hasData(data: PreviewData | null): data is PreviewData {
  return (
    !!data?.fileContent || !!data?.prevFileContent || !!data?.currentFileContent
  );
}
