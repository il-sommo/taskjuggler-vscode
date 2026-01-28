import * as vscode from 'vscode';
import { taskjugglerKeywords } from './taskjugglerData';

export class TaskJugglerHoverProvider implements vscode.HoverProvider {
    public provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.Hover> {
        const range = document.getWordRangeAtPosition(position);
        if (!range) {
            return null;
        }

        const word = document.getText(range);
        const keyword = taskjugglerKeywords[word];

        if (!keyword) {
            return null;
        }

        const markdown = new vscode.MarkdownString();
        markdown.appendMarkdown(`**${keyword.name}** *(${keyword.category})*\n\n`);
        markdown.appendMarkdown(`${keyword.description}\n\n`);

        if (keyword.syntax) {
            markdown.appendMarkdown(`**Syntax:**\n\`\`\`taskjuggler\n${keyword.syntax}\n\`\`\`\n\n`);
        }

        if (keyword.example) {
            markdown.appendMarkdown(`**Example:**\n\`\`\`taskjuggler\n${keyword.example}\n\`\`\`\n`);
        }

        return new vscode.Hover(markdown, range);
    }
}
