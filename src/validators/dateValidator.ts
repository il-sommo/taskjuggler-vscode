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

        // Validate date logic (start < end, etc.)
        diagnostics.push(...this.validateDateLogic(document));

        return diagnostics;
    }

    /**
     * Validate date logic within tasks (start < end, etc.)
     */
    public validateDateLogic(document: vscode.TextDocument): vscode.Diagnostic[] {
        const diagnostics: vscode.Diagnostic[] = [];
        const tasks = this.extractTaskDates(document);

        for (const task of tasks) {
            // Check start < end
            if (task.start && task.end) {
                const startDate = new Date(task.start.date);
                const endDate = new Date(task.end.date);

                if (endDate <= startDate) {
                    const diagnostic = new vscode.Diagnostic(
                        task.end.range,
                        `End date (${task.end.date}) must be after start date (${task.start.date})`,
                        vscode.DiagnosticSeverity.Error
                    );
                    diagnostic.code = 'invalid-date-range';
                    diagnostic.source = 'taskjuggler';
                    diagnostics.push(diagnostic);
                }
            }

            // Check minstart < maxstart
            if (task.minstart && task.maxstart) {
                const minDate = new Date(task.minstart.date);
                const maxDate = new Date(task.maxstart.date);

                if (maxDate <= minDate) {
                    const diagnostic = new vscode.Diagnostic(
                        task.maxstart.range,
                        `maxstart (${task.maxstart.date}) must be after minstart (${task.minstart.date})`,
                        vscode.DiagnosticSeverity.Warning
                    );
                    diagnostic.code = 'invalid-constraint-range';
                    diagnostic.source = 'taskjuggler';
                    diagnostics.push(diagnostic);
                }
            }

            // Check minend < maxend
            if (task.minend && task.maxend) {
                const minDate = new Date(task.minend.date);
                const maxDate = new Date(task.maxend.date);

                if (maxDate <= minDate) {
                    const diagnostic = new vscode.Diagnostic(
                        task.maxend.range,
                        `maxend (${task.maxend.date}) must be after minend (${task.minend.date})`,
                        vscode.DiagnosticSeverity.Warning
                    );
                    diagnostic.code = 'invalid-constraint-range';
                    diagnostic.source = 'taskjuggler';
                    diagnostics.push(diagnostic);
                }
            }
        }

        return diagnostics;
    }

    /**
     * Extract tasks with their date attributes
     */
    private extractTaskDates(document: vscode.TextDocument): Array<{
        id: string;
        start?: { date: string; range: vscode.Range };
        end?: { date: string; range: vscode.Range };
        minstart?: { date: string; range: vscode.Range };
        maxstart?: { date: string; range: vscode.Range };
        minend?: { date: string; range: vscode.Range };
        maxend?: { date: string; range: vscode.Range };
    }> {
        const tasks: Array<any> = [];
        let currentTask: any = null;

        const taskRegex = /^\s*task\s+([a-zA-Z_][a-zA-Z0-9_]*)/;
        const dateRegex = /\b(start|end|minstart|maxstart|minend|maxend)\s+(\d{4}-\d{2}-\d{2})/gi;

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            const text = line.text;

            // Check for task definition
            const taskMatch = text.match(taskRegex);
            if (taskMatch) {
                if (currentTask) {
                    tasks.push(currentTask);
                }
                currentTask = { id: taskMatch[1] };
            }

            // Extract date attributes
            if (currentTask) {
                let match;
                while ((match = dateRegex.exec(text)) !== null) {
                    const attr = match[1].toLowerCase();
                    const date = match[2];
                    const startChar = match.index + match[1].length + 1;
                    const range = new vscode.Range(i, startChar, i, startChar + date.length);

                    currentTask[attr] = { date, range };
                }
            }

            // Reset on closing brace
            if (text.trim() === '}' && currentTask) {
                tasks.push(currentTask);
                currentTask = null;
            }
        }

        if (currentTask) {
            tasks.push(currentTask);
        }

        return tasks;
    }
}
