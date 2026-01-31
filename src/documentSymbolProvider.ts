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
     * Create symbols for tasks with hierarchy support and attribute visibility
     */
    private createTaskSymbols(
        tasks: any[],
        document: vscode.TextDocument
    ): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];
        const symbolMap = new Map<string, vscode.DocumentSymbol>();

        // First pass: create all symbols with attributes
        tasks.forEach((task) => {
            const id = task.id;
            const attributes = this.extractTaskAttributes(task, document);
            const detail = attributes.length > 0 ? `[${attributes.join(', ')}]` : task.type || 'task';

            const symbol = new vscode.DocumentSymbol(
                `${id} - ${task.name || id}`,
                detail,
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
     * Create symbols for resources with attribute visibility
     */
    private createResourceSymbols(
        resources: any[],
        document: vscode.TextDocument
    ): vscode.DocumentSymbol[] {
        const symbols: vscode.DocumentSymbol[] = [];

        resources.forEach((resource) => {
            const id = resource.id;
            const attributes = this.extractResourceAttributes(resource, document);
            const detail = attributes.length > 0 ? `[${attributes.join(', ')}]` : resource.type || 'resource';

            const symbol = new vscode.DocumentSymbol(
                `${id} - ${resource.name || id}`,
                detail,
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

    /**
     * Extract key attributes from task definition (effort, duration, allocate)
     */
    private extractTaskAttributes(task: any, document: vscode.TextDocument): string[] {
        const attributes: string[] = [];
        const startLine = task.range.start.line;

        // Look for attributes in the next 20 lines (or until next block starts)
        const maxLines = Math.min(startLine + 20, document.lineCount);

        for (let i = startLine + 1; i < maxLines; i++) {
            const line = document.lineAt(i).text.trim();

            // Stop at closing brace or next definition
            if (line === '}' || /^(task|resource|account|report|project)\s/.test(line)) {
                break;
            }

            // Extract effort: "effort 10d" -> "10d"
            const effortMatch = line.match(/^\s*effort\s+(\S+)/);
            if (effortMatch) {
                attributes.push(effortMatch[1]);
            }

            // Extract duration: "duration 5d" -> "5d"
            const durationMatch = line.match(/^\s*duration\s+(\S+)/);
            if (durationMatch) {
                attributes.push(durationMatch[1]);
            }

            // Extract allocate: "allocate john" -> "john"
            const allocateMatch = line.match(/^\s*allocate\s+([a-zA-Z_][a-zA-Z0-9_]*)/);
            if (allocateMatch) {
                attributes.push(allocateMatch[1]);
            }

            // Extract milestone flag
            if (line.match(/^\s*milestone\s*$/)) {
                attributes.push('milestone');
            }
        }

        return attributes;
    }

    /**
     * Extract key attributes from resource definition (rate, limits, efficiency)
     */
    private extractResourceAttributes(resource: any, document: vscode.TextDocument): string[] {
        const attributes: string[] = [];
        const startLine = resource.range.start.line;

        // Look for attributes in the next 20 lines
        const maxLines = Math.min(startLine + 20, document.lineCount);

        for (let i = startLine + 1; i < maxLines; i++) {
            const line = document.lineAt(i).text.trim();

            // Stop at closing brace or next definition
            if (line === '}' || /^(task|resource|account|report|project)\s/.test(line)) {
                break;
            }

            // Extract rate: "rate 500.0" -> "€500"
            const rateMatch = line.match(/^\s*rate\s+([\d.]+)/);
            if (rateMatch) {
                attributes.push(`€${rateMatch[1]}`);
            }

            // Extract limits: "limits { dailymax 8h }" -> "8h/day"
            const limitsMatch = line.match(/^\s*limits\s*\{\s*dailymax\s+(\S+)/);
            if (limitsMatch) {
                attributes.push(`${limitsMatch[1]}/day`);
            }

            // Extract efficiency: "efficiency 0.8" -> "80%"
            const efficiencyMatch = line.match(/^\s*efficiency\s+([\d.]+)/);
            if (efficiencyMatch) {
                const percent = Math.round(parseFloat(efficiencyMatch[1]) * 100);
                attributes.push(`${percent}%`);
            }
        }

        return attributes;
    }
}
