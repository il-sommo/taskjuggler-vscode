import * as vscode from 'vscode';

export interface Symbol {
    id: string;
    name: string;
    range: vscode.Range;
    type: 'task' | 'resource' | 'macro' | 'scenario';
}

export interface ParsedDocument {
    tasks: Symbol[];
    resources: Symbol[];
    macros: Symbol[];
    scenarios: Symbol[];
}

export class TaskJugglerParser {
    /**
     * Parse a TaskJuggler document and extract all defined symbols
     */
    public parseDocument(document: vscode.TextDocument): ParsedDocument {
        const result: ParsedDocument = {
            tasks: [],
            resources: [],
            macros: [],
            scenarios: []
        };

        const text = document.getText();
        const lines = text.split('\n');

        // Regex patterns for different symbol types
        const taskPattern = /^\s*task\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+"([^"]+)"/;
        const resourcePattern = /^\s*resource\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+"([^"]+)"/;
        const macroPattern = /^\s*macro\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+\[/;
        const scenarioPattern = /^\s*scenario\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+"([^"]+)"/;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Skip comments
            if (line.trim().startsWith('#') || line.trim().startsWith('/*')) {
                continue;
            }

            // Check for task definition
            let match = line.match(taskPattern);
            if (match) {
                result.tasks.push({
                    id: match[1],
                    name: match[2],
                    range: new vscode.Range(i, 0, i, line.length),
                    type: 'task'
                });
                continue;
            }

            // Check for resource definition
            match = line.match(resourcePattern);
            if (match) {
                result.resources.push({
                    id: match[1],
                    name: match[2],
                    range: new vscode.Range(i, 0, i, line.length),
                    type: 'resource'
                });
                continue;
            }

            // Check for macro definition
            match = line.match(macroPattern);
            if (match) {
                result.macros.push({
                    id: match[1],
                    name: match[1],
                    range: new vscode.Range(i, 0, i, line.length),
                    type: 'macro'
                });
                continue;
            }

            // Check for scenario definition
            match = line.match(scenarioPattern);
            if (match) {
                result.scenarios.push({
                    id: match[1],
                    name: match[2],
                    range: new vscode.Range(i, 0, i, line.length),
                    type: 'scenario'
                });
            }
        }

        return result;
    }

    /**
     * Find a symbol by its ID
     */
    public findSymbol(document: vscode.TextDocument, symbolId: string): Symbol | undefined {
        const parsed = this.parseDocument(document);

        // Search in all symbol collections
        for (const symbols of [parsed.tasks, parsed.resources, parsed.macros, parsed.scenarios]) {
            const found = symbols.find(s => s.id === symbolId);
            if (found) {
                return found;
            }
        }

        return undefined;
    }
}
