import * as vscode from "vscode";
import { StlPreviewer } from "./stl-previewer";
import { GitService } from "./git-service";
import { SettingsService } from "./settings-service";

export function activate(context: vscode.ExtensionContext) {
  const gitService = new GitService();
  const configService = new SettingsService();
  const stlPreviewer = new StlPreviewer(
    context.extensionUri,
    gitService,
    configService,
  );
  context.subscriptions.push(
    vscode.window.registerCustomEditorProvider(
      StlPreviewer.viewType,
      stlPreviewer,
      {
        supportsMultipleEditorsPerDocument: true,
      },
    ),
  );
}
