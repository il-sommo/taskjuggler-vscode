import * as vscode from 'vscode';
import { TaskJugglerParser } from './taskjugglerParser';

/**
 * Provides workspace-wide symbol search (Ctrl+T)
 */
export class TaskJugglerWorkspaceSymbolProvider implements vscode.WorkspaceSymbolProvider {
    private parser: TaskJugglerParser;

    constructor() {
        this.parser = new TaskJugglerParser();
    }

    public async provideWorkspaceSymbols(
        query: string,
        token: vscode.CancellationToken
    ): Promise<vscode.SymbolInformation[]> {
        const symbols: vscode.SymbolInformation[] = [];

        try {
            // Find all .tjp and .tji files in workspace (no limit)
            const files = await vscode.workspace.findFiles(
                '**/*.{tjp,tji}',
                '**/node_modules/**'
                // No file limit - search all TaskJuggler files
            );

            for (const file of files) {
                if (token.isCancellationRequested) {
                    break;
                }

                try {
                    const document = await vscode.workspace.openTextDocument(file);
                    const parsed = this.parser.parseDocument(document);

                    // Filter symbols by query
                    const lowerQuery = query.toLowerCase();

                    // Add matching tasks
                    parsed.tasks.forEach((task) => {
                        const id = task.id;
                        const name = task.name || '';
                        if (!query || id.toLowerCase().includes(lowerQuery) ||
                            name.toLowerCase().includes(lowerQuery)) {

                            const symbol = new vscode.SymbolInformation(
                                `${id} - ${name || id}`,
                                vscode.SymbolKind.Function,
                                'Tasks',
                                new vscode.Location(file, task.range)
                            );
                            symbols.push(symbol);
                        }
                    });

                    // Add matching resources
                    parsed.resources.forEach((resource) => {
                        const id = resource.id;
                        const name = resource.name || '';
                        if (!query || id.toLowerCase().includes(lowerQuery) ||
                            name.toLowerCase().includes(lowerQuery)) {

                            const symbol = new vscode.SymbolInformation(
                                `${id} - ${name || id}`,
                                vscode.SymbolKind.Class,
                                'Resources',
                                new vscode.Location(file, resource.range)
                            );
                            symbols.push(symbol);
                        }
                    });

                    // Add matching scenarios
                    parsed.scenarios.forEach((scenario) => {
                        const id = scenario.id;
                        const name = scenario.name || '';
                        if (!query || id.toLowerCase().includes(lowerQuery) ||
                            name.toLowerCase().includes(lowerQuery)) {

                            const symbol = new vscode.SymbolInformation(
                                `${id} - ${name || id}`,
                                vscode.SymbolKind.Namespace,
                                'Scenarios',
                                new vscode.Location(file, scenario.range)
                            );
                            symbols.push(symbol);
                        }
                    });

                    // Add matching accounts
                    parsed.accounts.forEach((account) => {
                        const id = account.id;
                        const name = account.name || '';
                        if (!query || id.toLowerCase().includes(lowerQuery) ||
                            name.toLowerCase().includes(lowerQuery)) {

                            const symbol = new vscode.SymbolInformation(
                                `${id} - ${name || id}`,
                                vscode.SymbolKind.Enum,
                                'Accounts',
                                new vscode.Location(file, account.range)
                            );
                            symbols.push(symbol);
                        }
                    });

                } catch (error) {
                    console.error(`Error parsing file ${file.fsPath}:`, error);
                }
            }

        } catch (error) {
            console.error('Error providing workspace symbols:', error);
        }

        return symbols;
    }
}
