import * as fs from "fs";
import * as glob from "glob";
import * as path from "path";
import * as vscode from "vscode";
import { Location, Position, ProviderResult, TextDocument, Uri } from "vscode";

export class AngularUrlDefinitionProvider implements vscode.DefinitionProvider {
  urlRangeRegex = /[\w./-]+/;
  styleExtensions = ["css", "sass", "scss", "less"];

  findFile(uri: string): Location {
    return fs.existsSync(uri)
      ? new Location(Uri.file(uri), new Position(0, 0))
      : null;
  }

  findStyle(uri: string): Location {
    const file = this.findFile(uri);
    if (file !== null) return file;

    const splitted = uri.split(".");
    splitted[splitted.length - 1] = `{${this.styleExtensions.join(",")}}`;
    const globUri = splitted.join(".");

    const result = glob.sync(globUri);
    if (result.length === 0) return null;
    return new Location(Uri.file(result[0]), new Position(0, 0));
  }

  provideDefinition(
    document: TextDocument,
    position: Position
  ): ProviderResult<Location> {
    const wordRange = document.getWordRangeAtPosition(
      position,
      this.urlRangeRegex
    );
    const clickedPath = document.getText(wordRange);
    const fullUri = path.resolve(path.dirname(document.fileName), clickedPath);

    const split = fullUri.split(".");
    const extension = split[split.length - 1];

    if (extension === "html") {
      return this.findFile(fullUri);
    }

    if (this.styleExtensions.indexOf(extension) !== -1) {
      return this.findStyle(fullUri);
    }

    return null;
  }
}
