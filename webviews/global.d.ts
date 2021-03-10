import * as _vscode from "vscode";

declare global {
  const myvscode: {
    postMessage: ({ type: string, value: any }) => void;
  };
}
