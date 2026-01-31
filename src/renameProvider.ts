import * as vscode from 'vscode';
import { TaskJugglerParser } from './taskjugglerParser';

/**
 * Provides rename refactoring for tasks and resources
 */
export class TaskJugglerRenameProvider implements vscode.RenameProvider {
    private parser: TaskJugglerParser;

    constructor() {
        this.parser = new TaskJugglerParser();
    }

    /**
     * Prepare rename - validate that the symbol can be renamed
     */
    public prepareRename(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.Range | null {
        try {
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                return null;
            }

            const word = document.getText(wordRange);
            const parsed = this.parser.parseDocument(document);

            // Check if this is a valid symbol (task, resource, or account)
            const isTask = parsed.tasks.some(t => t.id === word);
            const isResource = parsed.resources.some(r => r.id === word);
            const isAccount = parsed.accounts.some(a => a.id === word);  // NEW
            if (isTask || isResource || isAccount) {
                return wordRange;
            }

            return null;
        } catch (error) {
            console.error('Error preparing rename:', error);
            return null;
        }
    }

    /**
     * Provide rename edits
     */
    public provideRenameEdits(
        document: vscode.TextDocument,
        position: vscode.Position,
        newName: string,
        token: vscode.CancellationToken
    ): vscode.WorkspaceEdit | null {
        try {
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                return null;
            }

            const oldName = document.getText(wordRange);
            const parsed = this.parser.parseDocument(document);

            // Validate new name
            if (!this.isValidIdentifier(newName)) {
                vscode.window.showErrorMessage(
                    `Invalid identifier: ${newName}. Must start with letter or underscore.`
                );
                return null;
            }

            // Check if new name already exists
            const nameExists = parsed.tasks.some(t => t.id === newName) ||
                             parsed.resources.some(r => r.id === newName) ||
                             parsed.accounts.some(a => a.id === newName);  // NEW
            if (nameExists) {
                vscode.window.showErrorMessage(
                    `Cannot rename: ${newName} already exists.`
                );
                return null;
            }

            const edit = new vscode.WorkspaceEdit();

            // Determine if this is a task, resource, or account
            const task = parsed.tasks.find(t => t.id === oldName);
            const resource = parsed.resources.find(r => r.id === oldName);
            const account = parsed.accounts.find(a => a.id === oldName);  // NEW

            if (task) {
                // Rename task definition
                edit.replace(document.uri, task.range, newName);

                // Rename all task references (in depends)
                const references = this.findTaskReferences(document, oldName);
                references.forEach(range => {
                    edit.replace(document.uri, range, newName);
                });

            } else if (resource) {
                // Rename resource definition
                edit.replace(document.uri, resource.range, newName);

                // Rename all resource references (in allocate)
                const references = this.findResourceReferences(document, oldName);
                references.forEach(range => {
                    edit.replace(document.uri, range, newName);
                });

            } else if (account) {  // NEW
                // Rename account definition
                edit.replace(document.uri, account.range, newName);

                // Rename all account references (in charge, revenue, purge)
                const references = this.findAccountReferences(document, oldName);
                references.forEach(range => {
                    edit.replace(document.uri, range, newName);
                });
            }

            return edit;

        } catch (error) {
            console.error('Error providing rename edits:', error);
            return null;
        }
    }

    /**
     * Validate identifier name
     */
    private isValidIdentifier(name: string): boolean {
        return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name);
    }

    /**
     * Find all references to a task (in depends, precedes, follows, supplement statements)
     */
    private findTaskReferences(document: vscode.TextDocument, taskId: string): vscode.Range[] {
        const references: vscode.Range[] = [];

        // Match patterns with optional negation (!)
        const dependsRegex = new RegExp(`\\bdepends\\s+(!?)(${taskId})\\b`, 'g');
        const precedesRegex = new RegExp(`\\bprecedes\\s+(!?)(${taskId})\\b`, 'g');
        const followsRegex = new RegExp(`\\bfollows\\s+(!?)(${taskId})\\b`, 'g');
        const supplementRegex = new RegExp(`\\bsupplement\\s+task\\s+(${taskId})\\b`, 'g');

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);

            // Check all patterns
            [dependsRegex, precedesRegex, followsRegex, supplementRegex].forEach(regex => {
                let match;
                while ((match = regex.exec(line.text)) !== null) {
                    const startChar = match.index + match[0].indexOf(taskId);
                    const range = new vscode.Range(
                        i, startChar,
                        i, startChar + taskId.length
                    );
                    references.push(range);
                }
            });
        }

        return references;
    }

    /**
     * Find all references to a resource (in allocate, responsible, shifts, supplement statements)
     */
    private findResourceReferences(document: vscode.TextDocument, resourceId: string): vscode.Range[] {
        const references: vscode.Range[] = [];

        const allocateRegex = new RegExp(`\\ballocate\\s+(${resourceId})\\b`, 'g');
        const responsibleRegex = new RegExp(`\\bresponsible\\s+(${resourceId})\\b`, 'g');
        const shiftsRegex = new RegExp(`\\bshifts\\s+(${resourceId})\\b`, 'g');
        const supplementRegex = new RegExp(`\\bsupplement\\s+resource\\s+(${resourceId})\\b`, 'g');

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);

            // Check all patterns
            [allocateRegex, responsibleRegex, shiftsRegex, supplementRegex].forEach(regex => {
                let match;
                while ((match = regex.exec(line.text)) !== null) {
                    const startChar = match.index + match[0].indexOf(resourceId);
                    const range = new vscode.Range(
                        i, startChar,
                        i, startChar + resourceId.length
                    );
                    references.push(range);
                }
            });
        }

        return references;
    }

    /**
     * Find all references to an account
     */
    private findAccountReferences(document: vscode.TextDocument, accountId: string): vscode.Range[] {
        const references: vscode.Range[] = [];
        const chargeRegex = new RegExp(`\\bcharge\\s+(\\d+(?:\\.\\d+)?)\\s+(${accountId})\\b`, 'g');
        const revenueRegex = new RegExp(`\\brevenue\\s+${accountId}\\b`, 'g');
        const purgeRegex = new RegExp(`\\bpurge\\s+${accountId}\\b`, 'g');

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let match;

            // Check charge statements
            while ((match = chargeRegex.exec(line.text)) !== null) {
                const startChar = match.index + match[0].indexOf(accountId);
                const range = new vscode.Range(
                    i, startChar,
                    i, startChar + accountId.length
                );
                references.push(range);
            }

            // Check revenue statements
            while ((match = revenueRegex.exec(line.text)) !== null) {
                const startChar = match.index + match[0].indexOf(accountId);
                const range = new vscode.Range(
                    i, startChar,
                    i, startChar + accountId.length
                );
                references.push(range);
            }

            // Check purge statements
            while ((match = purgeRegex.exec(line.text)) !== null) {
                const startChar = match.index + match[0].indexOf(accountId);
                const range = new vscode.Range(
                    i, startChar,
                    i, startChar + accountId.length
                );
                references.push(range);
            }
        }

        return references;
    }
}
