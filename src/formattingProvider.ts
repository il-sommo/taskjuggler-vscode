import * as vscode from 'vscode';

export class TaskJugglerFormattingProvider implements vscode.DocumentFormattingEditProvider {

    public provideDocumentFormattingEdits(
        document: vscode.TextDocument,
        options: vscode.FormattingOptions,
        token: vscode.CancellationToken
    ): vscode.TextEdit[] {
        const edits: vscode.TextEdit[] = [];
        let runningIndentLevel = 0;
        const indentUnit = options.insertSpaces ? ' '.repeat(options.tabSize) : '\t';

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const text = line.text;
            const trimmedText = text.trim();

            // Skip empty lines
            if (trimmedText.length === 0) {
                continue;
            }

            // Calculate indentation for the CURRENT line
            let currentLineIndentLevel = runningIndentLevel;

            // If the line starts with a closing brace, it belongs to the outer block
            if (trimmedText.startsWith('}')) {
                currentLineIndentLevel = Math.max(0, currentLineIndentLevel - 1);
            }

            // Apply indentation if changed
            const desiredIndentation = indentUnit.repeat(currentLineIndentLevel);

            // Calculate range to replace: strict replacement of leading whitespace
            const whitelistStart = text.search(/\S|$/); // First non-whitespace
            const currentIndentation = text.substring(0, whitelistStart);

            if (currentIndentation !== desiredIndentation) {
                edits.push(vscode.TextEdit.replace(
                    new vscode.Range(i, 0, i, whitelistStart),
                    desiredIndentation
                ));
            }

            // Update running level for NEXT line
            // Ignore braces in comments (basic check)
            // Remove comments from string for brace counting
            const codeOnly = trimmedText.replace(/#.*/, '').replace(/\/\*[\s\S]*?\*\//, '');

            // Simple string masking could be added here if needed, but for now assuming valid syntax

            const openBraces = (codeOnly.match(/\{/g) || []).length;
            const closeBraces = (codeOnly.match(/\}/g) || []).length;

            runningIndentLevel += (openBraces - closeBraces);
            runningIndentLevel = Math.max(0, runningIndentLevel);
        }

        return edits;
    }
}
