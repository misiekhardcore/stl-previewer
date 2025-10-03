import { Uri, workspace } from "vscode";
import type { WebviewPanel } from "vscode";
import { readFile } from "fs/promises";

import { Disposable } from "./disposable";
import { GitService } from "./git-service";
import { SettingsService } from "./settings-service";
import { ContentService } from "./content-service";
import type { PreviewResponse, PreviewData } from "./types/preview";
import { WEBVIEW_DIST_PATH } from "./constants";

const enum PreviewState {
  Init,
  Disposed,
}

export class Preview extends Disposable {
  private _previewState = PreviewState.Init;
  private static readonly CSS_PATH = WEBVIEW_DIST_PATH + "/index.css";
  private static readonly JS_PATH = WEBVIEW_DIST_PATH + "/index.js";

  constructor(
    private readonly extensionRoot: Uri,
    private readonly fileUri: Uri,
    private readonly webviewPanel: WebviewPanel,
    private readonly gitService: GitService,
    private readonly configService: SettingsService,
  ) {
    super();
    const resourceRoot = fileUri.with({
      path: fileUri.path.replace(/\/[^\/]+?\.\w+$/, "/"),
    });

    webviewPanel.webview.options = {
      enableScripts: true,
      localResourceRoots: [
        resourceRoot,
        extensionRoot,
        extensionRoot.with({ path: extensionRoot.path + "/dist" }),
      ],
    };

    this._register(
      webviewPanel.onDidChangeViewState(() => {
        this.update();
      }),
    );

    this._register(
      webviewPanel.onDidDispose(() => {
        this._previewState = PreviewState.Disposed;
      }),
    );

    const watcher = this._register(
      workspace.createFileSystemWatcher(fileUri.fsPath),
    );

    this._register(
      watcher.onDidChange((e) => {
        if (e.toString() === this.fileUri.toString()) {
          this.render();
        }
      }),
    );

    this._register(
      watcher.onDidDelete((e) => {
        if (e.toString() === this.fileUri.toString()) {
          this.webviewPanel.dispose();
        }
      }),
    );

    workspace.fs.stat(this.fileUri).then(() => {
      this.update();
    });

    this.render();
    this.update();
  }

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

  private getDiffStatus = async () => {
    return this.gitService.getStatus(this.fileUri);
  };

  private getPreviewData = async (): Promise<PreviewResponse> => {
    const settings = this.configService.getSettings();
    const data = await this.parseData();

    return { settings, data };
  };

  private parseData = async (): Promise<PreviewData> => {
    const gitStatus = await this.getDiffStatus();

    if (gitStatus === undefined) {
      return {
        prevFileContent: undefined,
        currentFileContent: undefined,
        fileContent: await this.readFile(this.fileUri),
      };
    }

    switch (true) {
      case this.gitService.isDeleted(gitStatus):
        return {
          prevFileContent: await this.getPrevFileContent(this.fileUri),
          currentFileContent: undefined,
          fileContent: undefined,
        };
      case this.gitService.isAdded(gitStatus):
        return {
          prevFileContent: undefined,
          currentFileContent: await this.readFile(this.fileUri),
          fileContent: undefined,
        };
      case this.gitService.isModified(gitStatus):
        return {
          prevFileContent: await this.getPrevFileContent(this.fileUri),
          currentFileContent: await this.readFile(this.fileUri),
          fileContent: undefined,
        };
      default:
        return {
          prevFileContent: undefined,
          currentFileContent: undefined,
          fileContent: await this.readFile(this.fileUri),
        };
    }
  };

  private readFile = async (uri: Uri): Promise<string> => {
    return readFile(uri.fsPath, { encoding: "base64" });
  };

  private getPrevFileContent = async (uri: Uri): Promise<string> => {
    return (await this.gitService.getPrevFileContent(uri)).toString("base64");
  };

  private getWebviewContents = async (): Promise<string> => {
    const previewData = await this.getPreviewData();
    const nonce = Date.now().toString();
    const cspSource = this.webviewPanel.webview.cspSource;
    const workerDataUrl = await this.getWorkerDataUrl();

    return /* html */ `<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<!-- Disable pinch zooming -->
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no">
	<title>STL Preview</title>
	<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src data: ${cspSource}; script-src 'nonce-${nonce}' 'unsafe-eval'; style-src ${cspSource} 'nonce-${nonce}'; connect-src https:; worker-src data: blob:;">
	<meta id="settings" data-settings="${ContentService.escapeAttribute(
    ContentService.stringify(previewData),
  )}">
  <link rel="stylesheet" type="text/css" href="${ContentService.escapeAttribute(
    this.getResourceUri(Preview.CSS_PATH),
  )}">
</head>
<body>
  <div id="root"></div>
  <div id="viewer"></div>
  <script nonce="${nonce}">
    window.CSG_WORKER_URL = "${workerDataUrl}";
  </script>
	<script type="module" src="${ContentService.escapeAttribute(
    this.getResourceUri(Preview.JS_PATH),
  )}" nonce="${nonce}"></script>
</body>
</html>`;
  };

  private getResourceUri = (path: string): Uri => {
    return this.webviewPanel.webview.asWebviewUri(
      this.extensionRoot.with({
        path: this.extensionRoot.path + path,
      }),
    );
  };

  private getWorkerDataUrl = async (): Promise<string> => {
    const workerContent = await readFile(
      this.extensionRoot.with({
        path: this.extensionRoot.path + "/dist/media/csg-worker.js",
      }).fsPath,
      "utf8",
    );
    return `data:application/javascript;base64,${Buffer.from(
      workerContent,
    ).toString("base64")}`;
  };
}
