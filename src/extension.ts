import * as vscode from "vscode";
import { StlViewer } from "./stl-viewer";
import { GitService } from "./git-service";
import { SettingsService } from "./settings-service";

export function activate(context: vscode.ExtensionContext) {
  const gitService = new GitService();
  const configService = new SettingsService();
  const stlViewer = new StlViewer(
    context.extensionUri,
    gitService,
    configService
  );
  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(
      StlViewer.viewType,
      stlViewer,
      {
        supportsMultipleEditorsPerDocument: true,
      }
    )
  );
}
