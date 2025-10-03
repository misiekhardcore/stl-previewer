import * as vscode from "vscode";
import { relative } from "path";

import type { API, GitExtension, Repository } from "./types/git";
import { Status } from "./types/git";

export class GitService {
  static readonly HEAD_REF = "HEAD";
  api: API;

  constructor() {
    const gitExtension =
      vscode.extensions.getExtension<GitExtension>("vscode.git")?.exports;

    if (!gitExtension) {
      throw new Error("Git extension not found");
    }

    this.api = gitExtension.getAPI(1);
  }

  public getPrevFileContent = async (
    uri: vscode.Uri,
  ): Promise<Buffer<ArrayBufferLike>> => {
    const relPath = this.getRelPath(uri.fsPath);
    try {
      const fileBuffer = await this.getRepository().buffer(
        GitService.HEAD_REF,
        relPath,
      );

      return fileBuffer;
    } catch (_error) {
      return Buffer.from([]);
    }
  };

  getStatus = async (uri: vscode.Uri): Promise<Status | undefined> => {
    const workingTreeStatus = await this.getWorkingTreeStatus(uri);

    if (workingTreeStatus !== undefined) {
      return workingTreeStatus;
    }
    const indexStatus = await this.getIndexStatus(uri);

    return indexStatus;
  };

  getWorkingTreeStatus = async (
    uri: vscode.Uri,
  ): Promise<Status | undefined> => {
    const workingTreeChanges =
      await this.getRepository().state.workingTreeChanges;
    return workingTreeChanges.find((change) => change.uri.fsPath === uri.fsPath)
      ?.status;
  };

  getIndexStatus = async (uri: vscode.Uri): Promise<Status | undefined> => {
    const indexChanges = await this.getRepository().state.indexChanges;
    return indexChanges.find((change) => change.uri.fsPath === uri.fsPath)
      ?.status;
  };

  private getRelPath = (filePath: string): string => {
    const gitRoot = this.getGitRoot();
    return relative(gitRoot, filePath);
  };

  private getRepository = (which: number = 0): Repository => {
    return this.api.repositories[which];
  };

  private getGitRoot = (): string => {
    return this.getRepository().rootUri.fsPath;
  };

  isDeleted = (status: Status): boolean => {
    return [Status.DELETED, Status.INDEX_DELETED].includes(status);
  };

  isAdded = (status: Status): boolean => {
    return [Status.ADDED, Status.INDEX_ADDED].includes(status);
  };

  isModified = (status: Status): boolean => {
    return [Status.MODIFIED, Status.INDEX_MODIFIED].includes(status);
  };
}
