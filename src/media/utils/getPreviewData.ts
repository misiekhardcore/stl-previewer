import { ContentService } from "../../content-service";
import { PreviewResponse } from "../../types/preview";
import { MeshMaterialType } from "../../types/settings";

export const DEFAULT_DATA: PreviewResponse["data"] = {
  fileContent: undefined,
  prevFileContent: undefined,
  currentFileContent: undefined,
};

export const DEFAULT_SETTINGS: PreviewResponse["settings"] = {
  grid: {
    enable: false,
    color: 0x000000,
  },
  meshMaterial: {
    type: MeshMaterialType.LAMBERT,
    config: {},
  },
  view: {
    showInfo: false,
    showViewButtons: false,
    viewOffset: 0,
    showAxes: false,
    showBoundingBox: false,
  },
};

let cachedData: PreviewResponse | null = null;

export function getPreviewData(): PreviewResponse {
  const element = document.getElementById("settings");
  if (element) {
    const data = element.getAttribute("data-settings");
    if (data) {
      cachedData = ContentService.parse<PreviewResponse>(data);
      return cachedData;
    }
  }

  return (
    cachedData || {
      settings: DEFAULT_SETTINGS,
      data: DEFAULT_DATA,
    }
  );
}
