// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.
(() => {
  const vscode = acquireVsCodeApi();

  //   const button = document.getElementById("button");
  //   button.innerText = "javascript";
  console.log("button");
})();
