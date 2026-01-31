import * as vscode from 'vscode';

interface Symbol {
    id: string;
    type: 'task' | 'resource' | 'account';
    range: vscode.Range;
}

interface Reference {
    id: string;
    type: 'task' | 'resource';
    range: vscode.Range;
    context: string; // 'depends' or 'allocate'
}

export class SemanticValidator {

    /**
     * Validate undefined references in the document
     */
    public validateReferences(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const symbols = this.extractSymbols(document);
        const references = this.extractReferences(document);

        // Check each reference to see if it's defined
        for (const ref of references) {
            const symbolExists = symbols.some(
                sym => sym.id === ref.id && sym.type === ref.type
            );

            if (!symbolExists) {
                const diagnostic = new vscode.Diagnostic(
                    ref.range,
                    `Undefined ${ref.type} '${ref.id}' referenced in ${ref.context}`,
                    vscode.DiagnosticSeverity.Error
                );
                diagnostic.code = 'undefined-reference';
                diagnostic.source = 'taskjuggler';
                diagnostics.push(diagnostic);
            }
        }

        return diagnostics;
    }

    /**
     * Validate circular dependencies in task graph
     */
    public validateCircularDependencies(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const dependencies = this.extractDependencies(document);

        // Build dependency graph
        const graph = new Map<string, Set<string>>();
        const taskRanges = new Map<string, vscode.Range>();

        for (const dep of dependencies) {
            if (!graph.has(dep.from)) {
                graph.set(dep.from, new Set());
            }
            graph.get(dep.from)!.add(dep.to);
            taskRanges.set(dep.from, dep.range);
        }

        // Detect cycles using DFS
        const visited = new Set<string>();
        const recursionStack = new Set<string>();

        const hasCycle = (taskId: string, path: string[]): string[] | null => {
            if (recursionStack.has(taskId)) {
                // Found a cycle - return the path
                const cycleStart = path.indexOf(taskId);
                return path.slice(cycleStart).concat(taskId);
            }

            if (visited.has(taskId)) {
                return null;
            }

            visited.add(taskId);
            recursionStack.add(taskId);
            path.push(taskId);

            const deps = graph.get(taskId);
            if (deps) {
                for (const dep of deps) {
                    const cycle = hasCycle(dep, [...path]);
                    if (cycle) {
                        return cycle;
                    }
                }
            }

            recursionStack.delete(taskId);
            return null;
        };

        // Check all tasks for cycles
        for (const taskId of graph.keys()) {
            if (!visited.has(taskId)) {
                const cycle = hasCycle(taskId, []);
                if (cycle) {
                    const range = taskRanges.get(taskId);
                    if (range) {
                        const diagnostic = new vscode.Diagnostic(
                            range,
                            `Circular dependency detected: ${cycle.join(' → ')}`,
                            vscode.DiagnosticSeverity.Error
                        );
                        diagnostic.code = 'circular-dependency';
                        diagnostic.source = 'taskjuggler';
                        diagnostics.push(diagnostic);
                    }
                    break; // Report only first cycle to avoid duplicate errors
                }
            }
        }

        return diagnostics;
    }

    /**
     * Extract all symbol definitions (tasks, resources, accounts)
     */
    private extractSymbols(document: vscode.TextDocument): Symbol[] {
        const symbols: Symbol[] = [];
        const taskRegex = /^\s*(task|resource|account)\s+([a-zA-Z_][a-zA-Z0-9_]*)/;

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const match = line.text.match(taskRegex);

            if (match) {
                const type = match[1] as 'task' | 'resource' | 'account';
                const id = match[2];
                const startChar = line.text.indexOf(id);
                const range = new vscode.Range(i, startChar, i, startChar + id.length);

                symbols.push({ id, type, range });
            }
        }

        return symbols;
    }

    /**
     * Extract all references to tasks and resources
     */
    private extractReferences(document: vscode.TextDocument): Reference[] {
        const references: Reference[] = [];

        // Match patterns like: depends !taskid, allocate resourceid
        const dependsRegex = /\bdepends\s+!?([a-zA-Z_][a-zA-Z0-9_]*)/g;
        const allocateRegex = /\ballocate\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const text = line.text;

            // Find depends references
            let match;
            while ((match = dependsRegex.exec(text)) !== null) {
                const id = match[1];
                const startChar = match.index + match[0].indexOf(id);
                const range = new vscode.Range(i, startChar, i, startChar + id.length);

                references.push({
                    id,
                    type: 'task',
                    range,
                    context: 'depends'
                });
            }

            // Find allocate references
            dependsRegex.lastIndex = 0; // Reset regex
            while ((match = allocateRegex.exec(text)) !== null) {
                const id = match[1];
                const startChar = match.index + match[0].indexOf(id);
                const range = new vscode.Range(i, startChar, i, startChar + id.length);

                references.push({
                    id,
                    type: 'resource',
                    range,
                    context: 'allocate'
                });
            }
        }

        return references;
    }

    /**
     * Extract dependency relationships between tasks
     */
    private extractDependencies(document: vscode.TextDocument): Array<{ from: string; to: string; range: vscode.Range }> {
        const dependencies: Array<{ from: string; to: string; range: vscode.Range }> = [];
        let currentTask: { id: string; range: vscode.Range } | null = null;

        const taskRegex = /^\s*task\s+([a-zA-Z_][a-zA-Z0-9_]*)/;
        const dependsRegex = /\bdepends\s+!?([a-zA-Z_][a-zA-Z0-9_]*)/g;

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const text = line.text;

            // Check if we're entering a new task
            const taskMatch = text.match(taskRegex);
            if (taskMatch) {
                const id = taskMatch[1];
                const startChar = text.indexOf(id);
                currentTask = {
                    id,
                    range: new vscode.Range(i, startChar, i, startChar + id.length)
                };
            }

            // Look for depends within current task
            if (currentTask) {
                let match;
                while ((match = dependsRegex.exec(text)) !== null) {
                    const dependsOn = match[1];
                    dependencies.push({
                        from: currentTask.id,
                        to: dependsOn,
                        range: currentTask.range
                    });
                }
            }

            // Reset on closing brace (simple heuristic)
            if (text.trim() === '}' && currentTask) {
                currentTask = null;
            }
        }

        return dependencies;
    }
}
