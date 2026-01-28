import * as vscode from 'vscode';
import { TaskJugglerParser } from './taskjugglerParser';

export class TaskJugglerDefinitionProvider implements vscode.DefinitionProvider {
    private parser: TaskJugglerParser;

    constructor() {
        this.parser = new TaskJugglerParser();
    }

    public provideDefinition(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]> {
        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return null;
        }

        const word = document.getText(range);

        // Remove leading ! from dependency references
        const symbolId = word.startsWith('!') ? word.substring(1) : word;

        // Check if this is a reference (after 'depends' or 'allocate')
        const lineText = document.lineAt(position).text;
        const isReference = lineText.match(/\b(depends|allocate)\b/);

        if (!isReference) {
            return null;
        }

        // Find the symbol definition
        const symbol = this.parser.findSymbol(document, symbolId);

        if (!symbol) {
            return null;
        }

        return new vscode.Location(document.uri, symbol.range);
    }
}
