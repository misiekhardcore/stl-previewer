import { WorkspaceConfiguration, workspace } from "vscode";

import { Settings } from "./types/settings";
import { EXTENSION_NAME } from "./constants";

export class SettingsService {
  private getExtensionConfig = (): WorkspaceConfiguration =>
    workspace.getConfiguration(EXTENSION_NAME);

  getSettings = (): Settings => {
    const {
      showInfo,
      showAxes,
      showBoundingBox,
      showViewButtons,
      viewOffset,
      showGrid,
      gridColor,
      meshMaterialType,
      meshMaterialConfig,
    } = this.getExtensionConfig();
    return {
      view: {
        showInfo,
        showAxes,
        showBoundingBox,
        showViewButtons,
        viewOffset,
      },
      grid: {
        enable: showGrid,
        color: gridColor,
      },
      meshMaterial: {
        type: meshMaterialType,
        config: meshMaterialConfig,
      },
    };
  };
}
