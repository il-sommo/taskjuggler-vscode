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
            const scenarioSymbols = this.createScenarioSymbols(parsed.scenarios, document);

            // Add sections if they have content
            if (taskSymbols.length > 0) {
                symbols.push(...taskSymbols);
            }
            if (resourceSymbols.length > 0) {
                symbols.push(...resourceSymbols);
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
     * Create symbols for tasks
     */
    private createTaskSymbols(
        tasks: any[],
        document: vscode.TextDocument
    ): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];

        tasks.forEach((task) => {
            const id = task.id;
            const symbol = new vscode.DocumentSymbol(
                `${id} - ${task.name || id}`,
                task.type || 'task',
                vscode.SymbolKind.Function,
                task.range,
                task.range
            );

            // Add task details as children
            const children: vscode.DocumentSymbol[] = [];

            // Add effort/duration if present
            if (task.effort) {
                const effortSymbol = new vscode.DocumentSymbol(
                    `effort: ${task.effort}`,
                    '',
                    vscode.SymbolKind.Property,
                    task.range,
                    task.range
                );
                children.push(effortSymbol);
            }

            if (task.duration) {
                const durationSymbol = new vscode.DocumentSymbol(
                    `duration: ${task.duration}`,
                    '',
                    vscode.SymbolKind.Property,
                    task.range,
                    task.range
                );
                children.push(durationSymbol);
            }

            // Add children symbols to parent
            if (children.length > 0) {
                children.forEach(child => symbol.children.push(child));
            }

            symbols.push(symbol);
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
}
