import * as assert from 'assert';
import * as vscode from 'vscode';
import { TaskJugglerFormattingProvider } from '../../formattingProvider';

suite('Formatter Test Suite', () => {
    vscode.window.showInformationMessage('Start Formatter tests.');

    test('Formats simple task with indentation', async () => {
        const content = `
task "project" {
task "sub" {
effort 5d
}
}
`;
        const expected = `
task "project" {
    task "sub" {
        effort 5d
    }
}
`;
        // Create a new document with content
        const document = await vscode.workspace.openTextDocument({
            language: 'taskjuggler',
            content: content.trim()
        });

        // We can test the provider directly to avoid race conditions with editor commands
        const provider = new TaskJugglerFormattingProvider();
        const options: vscode.FormattingOptions = {
            tabSize: 4,
            insertSpaces: true
        };
        const token = new vscode.CancellationTokenSource().token;

        const edits = provider.provideDocumentFormattingEdits(document, options, token);

        // Apply edits manually to verify result
        let formatted = document.getText();
        // Sort edits from bottom to top to apply them correctly without offset shift
        edits.sort((a, b) => b.range.start.compareTo(a.range.start));

        for (const edit of edits) {
            const startOffset = document.offsetAt(edit.range.start);
            const endOffset = document.offsetAt(edit.range.end);
            formatted = formatted.slice(0, startOffset) + edit.newText + formatted.slice(endOffset);
        }

        assert.strictEqual(formatted.trim(), expected.trim());
    });

    test('Handles closing brace at start of line', async () => {
        const content = `
project p "Project" {
  timezone "UTC"
}
`;
        const expected = `
project p "Project" {
    timezone "UTC"
}
`;
        const document = await vscode.workspace.openTextDocument({
            language: 'taskjuggler',
            content: content.trim()
        });

        const provider = new TaskJugglerFormattingProvider();
        const options: vscode.FormattingOptions = {
            tabSize: 4,
            insertSpaces: true
        };
        const token = new vscode.CancellationTokenSource().token;

        const edits = provider.provideDocumentFormattingEdits(document, options, token);

        let formatted = document.getText();
        edits.sort((a, b) => b.range.start.compareTo(a.range.start));

        for (const edit of edits) {
            const startOffset = document.offsetAt(edit.range.start);
            const endOffset = document.offsetAt(edit.range.end);
            formatted = formatted.slice(0, startOffset) + edit.newText + formatted.slice(endOffset);
        }

        assert.strictEqual(formatted.trim(), expected.trim());
    });
});
