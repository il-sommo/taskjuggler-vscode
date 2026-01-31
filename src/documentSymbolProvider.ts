import * as vscode from 'vscode';
import { TaskJugglerParser } from './taskjugglerParser';

/**
 * Provides document symbols for outline view and breadcrumb navigation
 */
export class TaskJugglerDocumentSymbolProvider implements vscode.DocumentSymbolProvider {
    private parser: TaskJugglerParser;

    constructor() {
        this.parser = new TaskJugglerParser();
    }

    public provideDocumentSymbols(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];

        try {
            const parsed = this.parser.parseDocument(document);

            // Create sections for different symbol types
            const taskSymbols = this.createTaskSymbols(parsed.tasks, document);
            const resourceSymbols = this.createResourceSymbols(parsed.resources, document);
            const accountSymbols = this.createAccountSymbols(parsed.accounts, document);  // NEW
            const scenarioSymbols = this.createScenarioSymbols(parsed.scenarios, document);

            // Add sections if they have content
            if (taskSymbols.length > 0) {
                symbols.push(...taskSymbols);
            }
            if (resourceSymbols.length > 0) {
                symbols.push(...resourceSymbols);
            }
            if (accountSymbols.length > 0) {  // NEW
                symbols.push(...accountSymbols);
            }
            if (scenarioSymbols.length > 0) {
                symbols.push(...scenarioSymbols);
            }

        } catch (error) {
            console.error('Error providing document symbols:', error);
        }

        return symbols;
    }

    /**
     * Create symbols for tasks with hierarchy support
     */
    private createTaskSymbols(
        tasks: any[],
        document: vscode.TextDocument
    ): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];
        const symbolMap = new Map<string, vscode.DocumentSymbol>();

        // First pass: create all symbols
        tasks.forEach((task) => {
            const id = task.id;
            const symbol = new vscode.DocumentSymbol(
                `${id} - ${task.name || id}`,
                task.type || 'task',
                vscode.SymbolKind.Function,
                task.range,
                task.range
            );

            symbolMap.set(id, symbol);
        });

        // Second pass: build hierarchy
        tasks.forEach((task) => {
            const symbol = symbolMap.get(task.id);
            if (!symbol) return;

            if (task.parent) {
                // This is a nested task - add to parent's children
                const parentSymbol = symbolMap.get(task.parent);
                if (parentSymbol) {
                    parentSymbol.children.push(symbol);
                } else {
                    // Parent not found, add to root
                    symbols.push(symbol);
                }
            } else {
                // Root level task
                symbols.push(symbol);
            }
        });

        return symbols;
    }

    /**
     * Create symbols for resources
     */
    private createResourceSymbols(
        resources: any[],
        document: vscode.TextDocument
    ): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];

        resources.forEach((resource) => {
            const id = resource.id;
            const symbol = new vscode.DocumentSymbol(
                `${id} - ${resource.name || id}`,
                resource.type || 'resource',
                vscode.SymbolKind.Class,
                resource.range,
                resource.range
            );

            symbols.push(symbol);
        });

        return symbols;
    }

    /**
     * Create symbols for scenarios
     */
    private createScenarioSymbols(
        scenarios: any[],
        document: vscode.TextDocument
    ): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];

        scenarios.forEach((scenario) => {
            const id = scenario.id;
            const symbol = new vscode.DocumentSymbol(
                `${id} - ${scenario.name || id}`,
                'scenario',
                vscode.SymbolKind.Namespace,
                scenario.range,
                scenario.range
            );

            symbols.push(symbol);
        });

        return symbols;
    }

    /**
     * Create symbols for accounts (NEW)
     */
    private createAccountSymbols(
        accounts: any[],
        document: vscode.TextDocument
    ): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];

        accounts.forEach((account) => {
            const id = account.id;
            const symbol = new vscode.DocumentSymbol(
                `${id} - ${account.name || id}`,
                'account',
                vscode.SymbolKind.Enum,
                account.range,
                account.range
            );

            symbols.push(symbol);
        });

        return symbols;
    }
}
