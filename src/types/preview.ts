import { Status } from "./git";
import { Settings } from "./settings";

export interface PreviewData {
  settings: Settings;
  diffStatus: Status | undefined;
  data: string[];
}
