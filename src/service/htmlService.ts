
import { readFileSync } from "fs";
import { basename, dirname, resolve } from "path";
import * as vscode from "vscode";
import { Util } from "../common/util";

export class HtmlService {

    public static previewHtml(uri: vscode.Uri, context: vscode.ExtensionContext) {
        const av = vscode.window.activeTextEditor.document;
        if (!uri) {
            uri = av.uri
        }
        const folderPath = vscode.Uri.file(resolve(uri.fsPath, ".."));
        const webviewPanel = vscode.window.createWebviewPanel("richfmt-viewer.viewHtml", basename(uri.fsPath), { viewColumn: vscode.ViewColumn.Two, preserveFocus: true }, { enableScripts: true })

        function readContent() {
            const content = av ? av.getText() : Util.buildPath(readFileSync(uri.fsPath, 'utf8'), webviewPanel.webview, folderPath.fsPath);
            return Util.buildPath(content, webviewPanel.webview, dirname(uri.fsPath))
        }

        webviewPanel.iconPath = vscode.Uri.file(`${context.extensionPath}/icons/html.svg`)
        webviewPanel.webview.html = readContent()

        Util.listen(webviewPanel, uri, () => {
            webviewPanel.webview.html = readContent() + `<input type="hidden" value="${new Date().getTime()}"/>`;
        })
    }

}