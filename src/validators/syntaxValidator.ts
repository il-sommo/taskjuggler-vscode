import * as vscode from 'vscode';

/**
 * Validates basic syntax in TaskJuggler files
 */
export class SyntaxValidator {
    /**
     * Check for unclosed braces
     */
    public validateBraces(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        let braceStack: Array<{ line: number; char: number }> = [];

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const text = line.text;

            for (let j = 0; j < text.length; j++) {
                if (text[j] === '{') {
                    braceStack.push({ line: i, char: j });
                } else if (text[j] === '}') {
                    if (braceStack.length === 0) {
                        // Closing brace without opening
                        const diagnostic = new vscode.Diagnostic(
                            new vscode.Range(i, j, i, j + 1),
                            'Unexpected closing brace - no matching opening brace',
                            vscode.DiagnosticSeverity.Error
                        );
                        diagnostic.code = 'unmatched-closing-brace';
                        diagnostic.source = 'taskjuggler';
                        diagnostics.push(diagnostic);
                    } else {
                        braceStack.pop();
                    }
                }
            }
        }

        // Check for unclosed braces
        braceStack.forEach(brace => {
            const diagnostic = new vscode.Diagnostic(
                new vscode.Range(brace.line, brace.char, brace.line, brace.char + 1),
                'Unclosed brace - missing closing brace',
                vscode.DiagnosticSeverity.Error
            );
            diagnostic.code = 'unclosed-brace';
            diagnostic.source = 'taskjuggler';
            diagnostics.push(diagnostic);
        });

        return diagnostics;
    }

    /**
     * Check for duplicate IDs
     */
    public validateDuplicateIds(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const taskIds = new Map<string, vscode.Range>();
        const resourceIds = new Map<string, vscode.Range>();
        const accountIds = new Map<string, vscode.Range>();

        // Pattern to match task/resource/account definitions
        const taskPattern = /^\s*task\s+([a-zA-Z_][a-zA-Z0-9_]*)/;
        const resourcePattern = /^\s*resource\s+([a-zA-Z_][a-zA-Z0-9_]*)/;
        const accountPattern = /^\s*account\s+([a-zA-Z_][a-zA-Z0-9_]*)/;

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const text = line.text;

            // Check for task definitions
            let match = taskPattern.exec(text);
            if (match) {
                const id = match[1];
                const startChar = text.indexOf(id);
                const range = new vscode.Range(i, startChar, i, startChar + id.length);

                if (taskIds.has(id)) {
                    const diagnostic = new vscode.Diagnostic(
                        range,
                        `Duplicate task ID '${id}' - already defined at line ${taskIds.get(id)!.start.line + 1}`,
                        vscode.DiagnosticSeverity.Error
                    );
                    diagnostic.code = 'duplicate-task-id';
                    diagnostic.source = 'taskjuggler';
                    diagnostics.push(diagnostic);

                    // Also mark the original
                    const originalDiagnostic = new vscode.Diagnostic(
                        taskIds.get(id)!,
                        `Task ID '${id}' is duplicated at line ${i + 1}`,
                        vscode.DiagnosticSeverity.Warning
                    );
                    originalDiagnostic.code = 'duplicate-task-id';
                    originalDiagnostic.source = 'taskjuggler';
                    diagnostics.push(originalDiagnostic);
                } else {
                    taskIds.set(id, range);
                }
            }

            // Check for resource definitions
            match = resourcePattern.exec(text);
            if (match) {
                const id = match[1];
                const startChar = text.indexOf(id);
                const range = new vscode.Range(i, startChar, i, startChar + id.length);

                if (resourceIds.has(id)) {
                    const diagnostic = new vscode.Diagnostic(
                        range,
                        `Duplicate resource ID '${id}' - already defined at line ${resourceIds.get(id)!.start.line + 1}`,
                        vscode.DiagnosticSeverity.Error
                    );
                    diagnostic.code = 'duplicate-resource-id';
                    diagnostic.source = 'taskjuggler';
                    diagnostics.push(diagnostic);

                    // Also mark the original
                    const originalDiagnostic = new vscode.Diagnostic(
                        resourceIds.get(id)!,
                        `Resource ID '${id}' is duplicated at line ${i + 1}`,
                        vscode.DiagnosticSeverity.Warning
                    );
                    originalDiagnostic.code = 'duplicate-resource-id';
                    originalDiagnostic.source = 'taskjuggler';
                    diagnostics.push(originalDiagnostic);
                } else {
                    resourceIds.set(id, range);
                }
            }

            // Check for account definitions
            match = accountPattern.exec(text);
            if (match) {
                const id = match[1];
                const startChar = text.indexOf(id);
                const range = new vscode.Range(i, startChar, i, startChar + id.length);

                if (accountIds.has(id)) {
                    const diagnostic = new vscode.Diagnostic(
                        range,
                        `Duplicate account ID '${id}' - already defined at line ${accountIds.get(id)!.start.line + 1}`,
                        vscode.DiagnosticSeverity.Error
                    );
                    diagnostic.code = 'duplicate-account-id';
                    diagnostic.source = 'taskjuggler';
                    diagnostics.push(diagnostic);
                } else {
                    accountIds.set(id, range);
                }
            }
        }

        return diagnostics;
    }
}
