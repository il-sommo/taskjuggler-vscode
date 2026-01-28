import * as vscode from 'vscode';
import { completionItems, taskjugglerKeywords } from './taskjugglerData';
import { TaskJugglerParser } from './taskjugglerParser';

export class TaskJugglerCompletionProvider implements vscode.CompletionItemProvider {
    private parser: TaskJugglerParser;

    constructor() {
        this.parser = new TaskJugglerParser();
    }

    public provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        const linePrefix = document.lineAt(position).text.substring(0, position.character);

        // Parse document to find defined tasks and resources
        const symbols = this.parser.parseDocument(document);

        // Context-aware completions
        const contextItems: vscode.CompletionItem[] = [];

        // If typing "depends", suggest existing tasks
        if (linePrefix.match(/\bdepends\s+[!]?$/)) {
            symbols.tasks.forEach(task => {
                const item = new vscode.CompletionItem(task.id, vscode.CompletionItemKind.Reference);
                item.detail = `Task: ${task.name}`;
                item.documentation = `Reference to task "${task.name}"`;
                contextItems.push(item);
            });
        }

        // If typing "allocate", suggest existing resources
        if (linePrefix.match(/\ballocate\s+$/)) {
            symbols.resources.forEach(resource => {
                const item = new vscode.CompletionItem(resource.id, vscode.CompletionItemKind.Reference);
                item.detail = `Resource: ${resource.name}`;
                item.documentation = `Reference to resource "${resource.name}"`;
                contextItems.push(item);
            });
        }

        // Return context-specific items if available, otherwise return all keywords
        if (contextItems.length > 0) {
            return contextItems;
        }

        return completionItems;
    }
}
