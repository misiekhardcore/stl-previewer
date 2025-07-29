import {
  ColorRepresentation,
  MeshBasicMaterialParameters,
  MeshLambertMaterialParameters,
  MeshNormalMaterialParameters,
  MeshPhongMaterialParameters,
  MeshStandardMaterialParameters,
} from "three";

export interface GridSettings {
  enable: boolean;
  color: ColorRepresentation;
}

export enum MeshMaterialType {
  PHONG = "phong",
  LAMBERT = "lambert",
  NORMAL = "normal",
  BASIC = "basic",
  STANDARD = "standard",
}

export type MeshMaterialSettings =
  | {
      type: MeshMaterialType.PHONG;
      config: MeshPhongMaterialParameters;
    }
  | {
      type: MeshMaterialType.LAMBERT;
      config: MeshLambertMaterialParameters;
    }
  | {
      type: MeshMaterialType.NORMAL;
      config: MeshNormalMaterialParameters;
    }
  | {
      type: MeshMaterialType.BASIC;
      config: MeshBasicMaterialParameters;
    }
  | {
      type: MeshMaterialType.STANDARD;
      config: MeshStandardMaterialParameters;
    };

export interface ViewSettings {
  showViewButtons: boolean;
  viewOffset: number;
  showInfo: boolean;
  showAxes: boolean;
  showBoundingBox: boolean;
}

export interface Settings {
  view: ViewSettings;
  grid: GridSettings;
  meshMaterial: MeshMaterialSettings;
}
