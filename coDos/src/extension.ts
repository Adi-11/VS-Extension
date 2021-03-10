import * as vscode from "vscode";
import { HelloPanel } from "./HelloPanel";
import { authenticate } from "./helper/Authenticate";
import { SidebarProvider } from "./helper/SidebarProvider";
import { TokenManager } from "./helper/TokenManager";

export const activate = (context: vscode.ExtensionContext): void => {
  console.log('Congratulations, your extension "coDos" is now active!');
  TokenManager.globalState = context.globalState;

  const sidebarProvider = new SidebarProvider(context.extensionUri);
  const btn = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  btn.text = "$(beaker) add to todo";
  btn.command = "coDos.addTodo";
  btn.show();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("coDos-sidebar", sidebarProvider)
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("coDos.helloWorld", () => {
      vscode.window.showInformationMessage(
        "token is: " + TokenManager.getToken()
      );
      // HelloPanel.createOrShow(context.extensionUri);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("coDos.authenticate", () => {
      try {
        authenticate();
      } catch (error) {
        console.log(error);
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("coDos.addTodo", () => {
      const { activeTextEditor } = vscode.window;
      if (!activeTextEditor) {
        vscode.window.showInformationMessage("No Text editor");
        return;
      }

      const text: string = activeTextEditor.document.getText(
        activeTextEditor.selection
      );
      sidebarProvider._view?.webview.postMessage({
        type: "new-todo",
        value: text,
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("coDos.refresh", async () => {
      // vscode.window.showInformationMessage("Hello World from Adi");
      // HelloPanel.kill();
      // HelloPanel.createOrShow(context.extensionUri);

      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.coDos-sidebar-view"
      );
      // setTimeout(() => {
      //   vscode.commands.executeCommand(
      //     "workbench.action.webview.openDeveloperTools"
      //   );
      // }, 1000);
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
