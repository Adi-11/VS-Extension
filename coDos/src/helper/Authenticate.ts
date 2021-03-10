import * as vscode from "vscode";
import { apiBaseUrl } from "./Constants";
import * as polka from "polka";
import { TokenManager } from "./TokenManager";

export const authenticate = (cb?: () => void) => {
  //   console.log("fdgsdfgsfdg");
  const app = polka();
  app.get("/auth/:token", async (req: any, res: any) => {
    const { token } = req.params;
    if (!token) {
      res.end("<h1>Something went worng</h1>");
      return;
    }
    TokenManager.setToken(token);
    if (cb) {
      cb();
    }
    res.end("<h1>Auth was successfull</h1>");

    (app as any).server.close();
  });
  app.listen(54321, (err: Error) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`${apiBaseUrl}/auth/github`)
      );
    }
  });
};
