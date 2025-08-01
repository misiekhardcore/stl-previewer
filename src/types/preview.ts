import { Settings } from "./settings";

export interface PreviewData {
  prevFileContent: string | undefined;
  currentFileContent: string | undefined;
  fileContent: string | undefined;
}

export interface PreviewResponse {
  settings: Settings;
  data: PreviewData;
}
