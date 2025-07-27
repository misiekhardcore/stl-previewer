import * as vscode from "vscode";
import { Preview } from "./preview";

export class StlViewer implements vscode.CustomReadonlyEditorProvider {
  public static readonly viewType = "stlViewer.previewEditor";

  private readonly _previews = new Map<string, Preview>();

  constructor(private readonly extensionRoot: vscode.Uri) {}

  public async openCustomDocument(uri: vscode.Uri) {
    return { uri, dispose: () => {} };
  }

  public async resolveCustomEditor(
    document: vscode.CustomDocument,
    webviewEditor: vscode.WebviewPanel
  ): Promise<void> {
    const fsPath = document.uri.fsPath;

    if (!this._previews.has(fsPath)) {
      const preview = new Preview(
        this.extensionRoot,
        document.uri,
        webviewEditor
      );
      this._previews.set(fsPath, preview);
    }

    webviewEditor.onDidDispose(() => {
      this._previews.delete(fsPath);
    });
  }
}
