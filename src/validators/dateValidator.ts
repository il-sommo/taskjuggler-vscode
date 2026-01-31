import * as vscode from 'vscode';

/**
 * Validates date formats and logic in TaskJuggler files
 */
export class DateValidator {
    /**
     * Validate date format (YYYY-MM-DD)
     */
    public validateDateFormat(text: string, range: vscode.Range): vscode.Diagnostic | null {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

        if (!dateRegex.test(text)) {
            const diagnostic = new vscode.Diagnostic(
                range,
                `Invalid date format. Expected YYYY-MM-DD, got: ${text}`,
                vscode.DiagnosticSeverity.Error
            );
            diagnostic.code = 'invalid-date-format';
            diagnostic.source = 'taskjuggler';
            return diagnostic;
        }

        // Validate that date is actually valid
        const [year, month, day] = text.split('-').map(Number);
        const date = new Date(year, month - 1, day);

        if (date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day) {
            const diagnostic = new vscode.Diagnostic(
                range,
                `Invalid date: ${text} (e.g., month must be 01-12, day must be valid for month)`,
                vscode.DiagnosticSeverity.Error
            );
            diagnostic.code = 'invalid-date-value';
            diagnostic.source = 'taskjuggler';
            return diagnostic;
        }

        return null;
    }

    /**
     * Find all date attributes in document and validate them
     */
    public validateDatesInDocument(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const datePattern = /\b(start|end|minstart|maxstart|minend|maxend)\s+(\d{4}-\d{2}-\d{2}|\d{4}-\d{1,2}-\d{1,2}|\S+)/gi;

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let match;

            while ((match = datePattern.exec(line.text)) !== null) {
                const dateString = match[2];
                const startChar = match.index + match[1].length + 1; // +1 for space
                const range = new vscode.Range(
                    i, startChar,
                    i, startChar + dateString.length
                );

                // Skip macros like ${now}
                if (dateString.startsWith('${') || dateString.startsWith('$')) {
                    continue;
                }

                const diagnostic = this.validateDateFormat(dateString, range);
                if (diagnostic) {
                    diagnostics.push(diagnostic);
                }
            }
        }

        return diagnostics;
    }
}
