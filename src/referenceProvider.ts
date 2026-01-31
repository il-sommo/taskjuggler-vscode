import * as vscode from 'vscode';
import { TaskJugglerParser } from './taskjugglerParser';

/**
 * Provides "Find All References" functionality for tasks and resources
 */
export class TaskJugglerReferenceProvider implements vscode.ReferenceProvider {
    private parser: TaskJugglerParser;

    constructor() {
        this.parser = new TaskJugglerParser();
    }

    public provideReferences(
        document: vscode.TextDocument,
        position: vscode.Position,
        context: vscode.ReferenceContext,
        token: vscode.CancellationToken
    ): vscode.Location[] | null {
        const locations: vscode.Location[] = [];

        try {
            // Get the word at the current position
            const wordRange = document.getWordRangeAtPosition(position);
            if (!wordRange) {
                return null;
            }

            const word = document.getText(wordRange);
            const parsed = this.parser.parseDocument(document);

            // Check if this is a task or resource definition
            const task = parsed.tasks.find(t => t.id === word);
            const resource = parsed.resources.find(r => r.id === word);
            const isTask = !!task;
            const isResource = !!resource;

            if (!isTask && !isResource) {
                return null;
            }

            // Include the definition if requested
            if (context.includeDeclaration) {
                if (isTask && task) {
                    locations.push(new vscode.Location(document.uri, task.range));
                } else if (isResource && resource) {
                    locations.push(new vscode.Location(document.uri, resource.range));
                }
            }

            // Find all references
            if (isTask) {
                const refs = this.findTaskReferences(document, word);
                refs.forEach(range => {
                    locations.push(new vscode.Location(document.uri, range));
                });
            } else if (isResource) {
                const refs = this.findResourceReferences(document, word);
                refs.forEach(range => {
                    locations.push(new vscode.Location(document.uri, range));
                });
            }

        } catch (error) {
            console.error('Error providing references:', error);
        }

        return locations.length > 0 ? locations : null;
    }

    /**
     * Find all references to a task (in depends statements)
     */
    private findTaskReferences(document: vscode.TextDocument, taskId: string): vscode.Range[] {
        const references: vscode.Range[] = [];
        const dependsRegex = new RegExp(`\\bdepends\\s+!?(${taskId})\\b`, 'g');

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
     * Find all references to a resource (in allocate statements)
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
