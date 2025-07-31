import {
  CustomDocument,
  CustomReadonlyEditorProvider,
  Uri,
  WebviewPanel,
} from "vscode";

import { Preview } from "./preview";
import { GitService } from "./git-service";
import { SettingsService } from "./settings-service";
import { EXTENSION_NAME } from "./constants";

export class StlPreviewer implements CustomReadonlyEditorProvider {
  public static readonly viewType = `${EXTENSION_NAME}.previewEditor`;

  private readonly _previews = new Map<string, Preview>();

  constructor(
    private readonly extensionRoot: Uri,
    private readonly gitService: GitService,
    private readonly configService: SettingsService
  ) {}

  public openCustomDocument = async (uri: Uri) => {
    return { uri, dispose: () => {} };
  };

  public resolveCustomEditor = async (
    document: CustomDocument,
    webviewPanel: WebviewPanel
  ): Promise<void> => {
    const { fsPath } = document.uri;

    if (this._previews.has(fsPath)) {
      this._previews.get(fsPath)?.addResource(document.uri);
    } else {
      const preview = new Preview(
        this.extensionRoot,
        [document.uri],
        webviewPanel,
        this.gitService,
        this.configService
      );
      this._previews.set(fsPath, preview);
    }

    webviewPanel.onDidDispose(() => {
      this._previews.get(fsPath)?.dispose();
      this._previews.delete(fsPath);
    });
  };
}
