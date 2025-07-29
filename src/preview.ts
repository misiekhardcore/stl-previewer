import { Uri, workspace } from "vscode";
import type { WebviewPanel } from "vscode";
import { readFile } from "fs/promises";

import { Disposable } from "./disposable";
import { GitService } from "./git-service";
import { SettingsService } from "./settings-service";
import { ContentService } from "./content-service";
import type { PreviewData } from "./types/preview";
import { WEBVIEW_DIST_PATH } from "./constants";

const enum PreviewState {
  Init,
  Disposed,
}

export class Preview extends Disposable {
  private _previewState = PreviewState.Init;
  private static readonly CSS_PATH = WEBVIEW_DIST_PATH + "/main.css";
  private static readonly JS_PATH = WEBVIEW_DIST_PATH + "/main.js";

  constructor(
    private readonly extensionRoot: Uri,
    private readonly fileUris: Uri[],
    private readonly webviewPanel: WebviewPanel,
    private readonly gitService: GitService,
    private readonly configService: SettingsService
  ) {
    super();
    const resourceRoots = fileUris.map((resource) =>
      resource.with({
        path: resource.path.replace(/\/[^\/]+?\.\w+$/, "/"),
      })
    );

    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [...resourceRoots, extensionRoot],
    };

    this._register(
      webviewPanel.onDidChangeViewState(() => {
        this.update();
      })
    );

    this._register(
      webviewPanel.onDidDispose(() => {
        this._previewState = PreviewState.Disposed;
      })
    );

    const watcher = this._register(
      workspace.createFileSystemWatcher(
        fileUris.map((resource) => resource.fsPath).join(",")
      )
    );

    this._register(
      watcher.onDidChange((e) => {
        if (
          this.fileUris.some(
            (resource) => e.toString() === resource.toString()
          )
        ) {
          this.render();
        }
      })
    );

    this._register(
      watcher.onDidDelete((e) => {
        if (
          this.fileUris.some(
            (resource) => e.toString() === resource.toString()
          )
        ) {
          this.webviewPanel.dispose();
        }
      })
    );

    this.fileUris.forEach((resource) => {
      workspace.fs.stat(resource).then(() => {
        this.update();
      });
    });

    this.render();
    this.update();
  }

  public addResource = (uri: Uri) => {
    this.fileUris.push(uri);
    this.render();
    this.update();
  };

  private render = async () => {
    if (this._previewState !== PreviewState.Disposed) {
      this.webviewPanel.webview.html = await this.getWebviewContents();
    }
  };

  private update = () => {
    if (this._previewState === PreviewState.Disposed) {
      return;
    }
  };

  private getPreviewData = async (): Promise<PreviewData> => {
    const settings = this.configService.getSettings();
    const data = await this.parseData();

    return { settings, data };
  };

  private parseData = async (): Promise<string[]> => {
    return Promise.all(
      this.fileUris.map((resource) => this.readFile(resource))
    );
  };

  private readFile = async (uri: Uri): Promise<string> => {
    if (this.gitService.isGitRepository(uri)) {
      return (await this.gitService.getPrevFileContent(uri)).toString(
        "base64"
      );
    }
    return readFile(uri.fsPath, { encoding: "base64" });
  };

  private getWebviewContents = async (): Promise<string> => {
    const previewData = await this.getPreviewData();
    const nonce = Date.now().toString();

    const cspSource = this.webviewPanel.webview.cspSource;
    return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<!-- Disable pinch zooming -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
	<title>STL Preview</title>
	<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: ${cspSource}; script-src 'nonce-${nonce}'; style-src ${cspSource} 'nonce-${nonce}'; connect-src https:;">
	<meta id="settings" data-settings="${ContentService.escapeAttribute(
    ContentService.stringify(previewData)
  )}">
  <link rel="stylesheet" type="text/css" href="${ContentService.escapeAttribute(
    this.getResourceUri(Preview.CSS_PATH)
  )}">
</head>
<body>
  <div id="viewer">
    <div id="actions">
      <button class="button button--isometric">Isometric</button>
      <button class="button button--top">Top</button>
      <button class="button button--left">Left</button>
      <button class="button button--right">Right</button>
      <button class="button button--bottom">Bottom</button>
    </div>
  </div>
	<script src="${ContentService.escapeAttribute(
    this.getResourceUri(Preview.JS_PATH)
  )}" nonce="${nonce}"></script>
</body>
</html>`;
  };

  private getResourceUri = (path: string): Uri => {
    return this.webviewPanel.webview.asWebviewUri(
      this.extensionRoot.with({
        path: this.extensionRoot.path + path,
      })
    );
  };
}
