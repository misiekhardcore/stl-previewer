import * as vscode from "vscode";

const DEFAULT_KEY_LENGTH = 20;

export class ContentService {
  static escapeAttribute = (value: string | vscode.Uri): string =>
    value.toString().replace(/"/g, "&quot;");

  static base64ToArrayBuffer = (base64: string) => {
    const binary_string = window.atob(base64);
    const len = binary_string.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
  };

  static stringify = (value: unknown) => {
    return JSON.stringify(value);
  };

  static parse = <T>(value: string): T => {
    return JSON.parse(value) as T;
  };

  static stringToKey = (
    value: string,
    keyLength = DEFAULT_KEY_LENGTH
  ) => {
    const stringLength = value.length;
    return value.substring(stringLength - keyLength, stringLength);
  };
}
