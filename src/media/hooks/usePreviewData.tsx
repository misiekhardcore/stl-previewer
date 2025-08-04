import { useEffect, useState } from "react";
import { getPreviewData } from "../utils/getPreviewData";
import { PreviewResponse } from "../../types/preview";
import { DEFAULT_SETTINGS } from "../utils/getPreviewData";

export function usePreviewData() {
  const [data, setData] = useState<PreviewResponse["data"]>(null);
  const [settings, setSettings] =
    useState<PreviewResponse["settings"]>(DEFAULT_SETTINGS);

  useEffect(() => {
    const { data, settings } = getPreviewData();
    setSettings(settings);
    setData(data);
  }, []);

  return { settings, data, setSettings, setData };
}
