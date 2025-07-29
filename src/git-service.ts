import * as vscode from "vscode";
import { relative } from "path";

import type { API, GitExtension, Repository } from "./types/git";
import { ContentService } from "./content-service";

type Query = {
  path: string;
  ref: string;
};

export class GitService {
  private api: API;

  constructor() {
    const gitExtension =
      vscode.extensions.getExtension<GitExtension>(
        "vscode.git"
      )?.exports;

    if (!gitExtension) {
      throw new Error("Git extension not found");
    }

    this.api = gitExtension.getAPI(1);
  }

  public getPrevFileContent = async (
    uri: vscode.Uri
  ): Promise<Buffer<ArrayBufferLike>> => {
    const { path, ref } = ContentService.parse<Query>(uri.query);
    const relPath = this.getRelPath(path);
    const sanitizedRef = this.sanitizeRef(ref);
    const fileBuffer = await this.getRepository().buffer(
      sanitizedRef,
      relPath
    );

    return fileBuffer;
  };

  isGitRepository = (uri: vscode.Uri): boolean => {
    return uri.scheme === "git";
  };

  private getRelPath = (filePath: string): string => {
    const gitRoot = this.getGitRoot();
    return relative(gitRoot, filePath);
  };

  private sanitizeRef = (ref: string): string => {
    return ref === "~" ? "HEAD" : ref;
  };

  private getRepository = (which: number = 0): Repository => {
    return this.api.repositories[which];
  };

  private getGitRoot = (): string => {
    return this.getRepository().rootUri.fsPath;
  };
}
