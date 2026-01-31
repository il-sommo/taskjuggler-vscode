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

            // Check if this is a valid symbol (task or resource)
            const isTask = parsed.tasks.some(t => t.id === word);
            const isResource = parsed.resources.some(r => r.id === word);
            if (isTask || isResource) {
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
                             parsed.resources.some(r => r.id === newName);
            if (nameExists) {
                vscode.window.showErrorMessage(
                    `Cannot rename: ${newName} already exists.`
                );
                return null;
            }

            const edit = new vscode.WorkspaceEdit();

            // Determine if this is a task or resource
            const task = parsed.tasks.find(t => t.id === oldName);
            const resource = parsed.resources.find(r => r.id === oldName);

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
     * Find all references to a task
     */
    private findTaskReferences(document: vscode.TextDocument, taskId: string): vscode.Range[] {
        const references: vscode.Range[] = [];
        const dependsRegex = new RegExp(`\\bdepends\\s+(!?)(${taskId})\\b`, 'g');

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let match;

            while ((match = dependsRegex.exec(line.text)) !== null) {
                const startChar = match.index + match[0].indexOf(taskId);
                const range = new vscode.Range(
                    i, startChar,
                    i, startChar + taskId.length
                );
                references.push(range);
            }
        }

        return references;
    }

    /**
     * Find all references to a resource
     */
    private findResourceReferences(document: vscode.TextDocument, resourceId: string): vscode.Range[] {
        const references: vscode.Range[] = [];
        const allocateRegex = new RegExp(`\\ballocate\\s+(${resourceId})\\b`, 'g');

        for (let i = 0; i < document.lineCount; i++) {
            const line = document.lineAt(i);
            let match;

            while ((match = allocateRegex.exec(line.text)) !== null) {
                const startChar = match.index + match[0].indexOf(resourceId);
                const range = new vscode.Range(
                    i, startChar,
                    i, startChar + resourceId.length
                );
                references.push(range);
            }
        }

        return references;
    }
}
