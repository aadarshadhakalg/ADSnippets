import * as vscode from "vscode";
import { AngularSelectorDefinitionProvider } from "./providers/selector";
import { AngularUrlDefinitionProvider } from "./providers/url";

export function activate(context: vscode.ExtensionContext) {
  const selectorRegistration = vscode.languages.registerDefinitionProvider(
    {
      language: "html",
      pattern: "**/*.html",
      scheme: "file",
    },
    new AngularSelectorDefinitionProvider(context)
  );

  const urlRegistration = vscode.languages.registerDefinitionProvider(
    {
      language: "dart",
      pattern: "**/*.dart",
      scheme: "file",
    },
    new AngularUrlDefinitionProvider()
  );

  context.subscriptions.push(selectorRegistration, urlRegistration);
}

export function deactivate() {}
