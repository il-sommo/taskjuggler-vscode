import * as vscode from 'vscode';

export interface Symbol {
    id: string;
    name: string;
    range: vscode.Range;
    type: 'task' | 'resource' | 'macro' | 'scenario' | 'account';
    parent?: string;  // For nested tasks
    children?: Symbol[];  // For hierarchy
}

export interface ParsedDocument {
    tasks: Symbol[];
    resources: Symbol[];
    macros: Symbol[];
    scenarios: Symbol[];
    accounts: Symbol[];  // NEW
}

export interface ParserContext {
    currentBlock: 'project' | 'task' | 'resource' | 'account' | 'report' | 'none';
    blockId?: string;
    blockRange: vscode.Range;
    parentBlocks: string[]; // nesting hierarchy
    usedAttributes: Set<string>; // attributes already defined in current block
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
            scenarios: [],
            accounts: []  // NEW
        };

        const text = document.getText();
        const lines = text.split('\n');

        // Track nested task hierarchy
        const taskStack: Array<{ id: string; braceDepth: number }> = [];
        let braceDepth = 0;

        // Regex patterns for different symbol types
        const taskPattern = /^\s*task\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+"([^"]+)"/;
        const resourcePattern = /^\s*resource\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+"([^"]+)"/;
        const macroPattern = /^\s*macro\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+\[/;
        const scenarioPattern = /^\s*scenario\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+"([^"]+)"/;
        const accountPattern = /^\s*account\s+([a-zA-Z_][a-zA-Z0-9_]*)\s+"([^"]+)"/;  // NEW

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Skip comments
            if (line.trim().startsWith('#') || line.trim().startsWith('/*')) {
                continue;
            }

            // Check for task definition
            let match = line.match(taskPattern);
            if (match) {
                const taskId = match[1];
                // Find parent task at current brace depth
                let parent: string | undefined = undefined;
                for (let j = taskStack.length - 1; j >= 0; j--) {
                    if (taskStack[j].braceDepth < braceDepth) {
                        parent = taskStack[j].id;
                        break;
                    }
                }

                const task: Symbol = {
                    id: taskId,
                    name: match[2],
                    range: new vscode.Range(i, 0, i, line.length),
                    type: 'task',
                    parent: parent,
                    children: []
                };

                result.tasks.push(task);

                // Track opening brace on same line
                if (line.includes('{')) {
                    taskStack.push({ id: taskId, braceDepth: braceDepth });
                    braceDepth++;
                }
            } else if (line.includes('{')) {
                // Opening brace not on task line
                braceDepth++;
            }

            // Track closing braces
            if (line.includes('}')) {
                braceDepth--;
                // Pop tasks that were at this depth or deeper
                while (taskStack.length > 0 && taskStack[taskStack.length - 1].braceDepth > braceDepth) {
                    taskStack.pop();
                }
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
                    type: 'scenario',
                    children: []
                });
                continue;
            }

            // Check for account definition (NEW)
            match = line.match(accountPattern);
            if (match) {
                result.accounts.push({
                    id: match[1],
                    name: match[2],
                    range: new vscode.Range(i, 0, i, line.length),
                    type: 'account',
                    children: []
                });
                continue;
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
        for (const symbols of [parsed.tasks, parsed.resources, parsed.macros, parsed.scenarios, parsed.accounts]) {
            const found = symbols.find(s => s.id === symbolId);
            if (found) {
                return found;
            }
        }

        return undefined;
    }

    /**
     * Get the context at a specific position in the document
     * Determines what block type we're in and what attributes have been used
     */
    public getContextAtPosition(document: vscode.TextDocument, position: vscode.Position): ParserContext {
        const context: ParserContext = {
            currentBlock: 'none',
            blockRange: new vscode.Range(0, 0, 0, 0),
            parentBlocks: [],
            usedAttributes: new Set<string>()
        };

        // Track brace depth and block types
        const blockStack: Array<{ type: string; id?: string; startLine: number }> = [];

        // Patterns for block detection
        const projectPattern = /^\s*project\s+([a-zA-Z_][a-zA-Z0-9_]*)/;
        const taskPattern = /^\s*task\s+([a-zA-Z_][a-zA-Z0-9_]*)/;
        const resourcePattern = /^\s*resource\s+([a-zA-Z_][a-zA-Z0-9_]*)/;
        const accountPattern = /^\s*account\s+([a-zA-Z_][a-zA-Z0-9_]*)/;
        const reportPattern = /^\s*(?:taskreport|resourcereport|textreport|tracereport|statussheetreport|nikureport)\s+([a-zA-Z_][a-zA-Z0-9_]*)/;

        // Parse line by line up to the cursor position
        for (let i = 0; i <= position.line; i++) {
            const line = document.lineAt(i).text;
            const trimmed = line.trim();

            // Skip comments
            if (trimmed.startsWith('#') || trimmed.startsWith('//')) {
                continue;
            }

            // Check for block starts
            let match = line.match(projectPattern);
            if (match && line.includes('{')) {
                blockStack.push({ type: 'project', id: match[1], startLine: i });
                continue;
            }

            match = line.match(taskPattern);
            if (match && line.includes('{')) {
                blockStack.push({ type: 'task', id: match[1], startLine: i });
                continue;
            }

            match = line.match(resourcePattern);
            if (match && line.includes('{')) {
                blockStack.push({ type: 'resource', id: match[1], startLine: i });
                continue;
            }

            match = line.match(accountPattern);
            if (match && line.includes('{')) {
                blockStack.push({ type: 'account', id: match[1], startLine: i });
                continue;
            }

            match = line.match(reportPattern);
            if (match && line.includes('{')) {
                blockStack.push({ type: 'report', id: match[1], startLine: i });
                continue;
            }

            // Check for block ends
            if (trimmed === '}' && blockStack.length > 0) {
                blockStack.pop();
            }
        }

        // Determine current block context
        if (blockStack.length > 0) {
            const currentBlock = blockStack[blockStack.length - 1];
            context.currentBlock = currentBlock.type as any;
            context.blockId = currentBlock.id;
            context.blockRange = new vscode.Range(
                currentBlock.startLine, 0,
                position.line, 999
            );
            context.parentBlocks = blockStack.map(b => b.type);

            // Find used attributes in current block
            for (let i = currentBlock.startLine + 1; i <= position.line; i++) {
                const line = document.lineAt(i).text.trim();
                // Extract attribute names (first word on the line)
                const attrMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s/);
                if (attrMatch && !line.includes('{')) {
                    context.usedAttributes.add(attrMatch[1]);
                }
            }
        }

        return context;
    }
}
