import * as vscode from "vscode";
import { HelloPanel } from "./HelloPanel";
import { SidebarProvider } from "./helper/SidebarProvider";

export const activate = (context: vscode.ExtensionContext): void => {
  console.log('Congratulations, your extension "coDos" is now active!');

  const sidebarProvider = new SidebarProvider(context.extensionUri);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("coDos-sidebar", sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("coDos.helloWorld", () => {
      // vscode.window.showInformationMessage("Hello World from Adi");
      HelloPanel.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("coDos.refresh", () => {
      // vscode.window.showInformationMessage("Hello World from Adi");
      HelloPanel.kill();
      HelloPanel.createOrShow(context.extensionUri);
      setTimeout(() => {
        vscode.commands.executeCommand(
          "workbench.action.webview.openDeveloperTools"
        );
      }, 1000);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("coDos.askQuestion", async () => {
      const answer = await vscode.window.showInformationMessage(
        "How you doing",
        "Fine",
        "Bad"
      );

      if (answer === "Bad") {
        vscode.window.showInformationMessage("Sorry to hear that!");
      } else {
        console.log({ answer });
      }
    })
  );
};

export const deactivate = () => {};
