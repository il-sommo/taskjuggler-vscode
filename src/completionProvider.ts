import * as vscode from 'vscode';
import {
    completionItems,
    taskjugglerKeywords,
    taskAttributes,
    resourceAttributes,
    projectAttributes,
    reportAttributes,
    accountAttributes
} from './taskjugglerData';
import { TaskJugglerParser } from './taskjugglerParser';

export class TaskJugglerCompletionProvider implements vscode.CompletionItemProvider {
    private parser: TaskJugglerParser;

    constructor() {
        this.parser = new TaskJugglerParser();
    }

    public provideCompletionItems(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.CompletionContext
    ): vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList> {
        const linePrefix = document.lineAt(position).text.substring(0, position.character);

        // Parse document to find defined tasks and resources
        const symbols = this.parser.parseDocument(document);

        // Get context at current position
        const parserContext = this.parser.getContextAtPosition(document, position);

        // Context-aware completions for depends/allocate references
        const contextItems: vscode.CompletionItem[] = [];

        // If typing "depends", suggest existing tasks
        if (linePrefix.match(/\bdepends\s+!?[a-zA-Z0-9_]*$/)) {
            symbols.tasks.forEach(task => {
                const item = new vscode.CompletionItem(task.id, vscode.CompletionItemKind.Reference);
                item.detail = `Task: ${task.name}`;
                item.documentation = `Reference to task "${task.name}"`;
                contextItems.push(item);
            });
            return contextItems;
        }

        // If typing "allocate", suggest existing resources
        if (linePrefix.match(/\ballocate\s+[a-zA-Z0-9_,\s]*$/)) {
            symbols.resources.forEach(resource => {
                const item = new vscode.CompletionItem(resource.id, vscode.CompletionItemKind.Reference);
                item.detail = `Resource: ${resource.name}`;
                item.documentation = `Reference to resource "${resource.name}"`;
                contextItems.push(item);
            });
            return contextItems;
        }

        // If typing date attributes, suggest date values
        if (this.isDateContext(linePrefix)) {
            return this.getDateCompletions();
        }

        // Context-based keyword filtering
        switch (parserContext.currentBlock) {
            case 'task':
                return this.getTaskCompletions(parserContext);
            case 'resource':
                return this.getResourceCompletions(parserContext);
            case 'project':
                return this.getProjectCompletions(parserContext);
            case 'report':
                return this.getReportCompletions(parserContext);
            case 'account':
                return this.getAccountCompletions(parserContext);
            default:
                return this.getTopLevelCompletions();
        }
    }

    private getTaskCompletions(context: any): vscode.CompletionItem[] {
        return this.filterCompletionsByAttributes(taskAttributes, context.usedAttributes);
    }

    private getResourceCompletions(context: any): vscode.CompletionItem[] {
        return this.filterCompletionsByAttributes(resourceAttributes, context.usedAttributes);
    }

    private getProjectCompletions(context: any): vscode.CompletionItem[] {
        return this.filterCompletionsByAttributes(projectAttributes, context.usedAttributes);
    }

    private getReportCompletions(context: any): vscode.CompletionItem[] {
        return this.filterCompletionsByAttributes(reportAttributes, context.usedAttributes);
    }

    private getAccountCompletions(context: any): vscode.CompletionItem[] {
        return this.filterCompletionsByAttributes(accountAttributes, context.usedAttributes);
    }

    private getTopLevelCompletions(): vscode.CompletionItem[] {
        // At top level, show property declarations (task, resource, project, etc.)
        return completionItems.filter(item =>
            taskjugglerKeywords[item.label as string]?.category === 'property'
        );
    }

    private filterCompletionsByAttributes(
        allowedAttributes: string[],
        usedAttributes: Set<string>
    ): vscode.CompletionItem[] {
        return completionItems.filter(item => {
            const keyword = item.label as string;
            // Include if it's an allowed attribute and not already used
            return allowedAttributes.includes(keyword) && !usedAttributes.has(keyword);
        });
    }

    private isDateContext(linePrefix: string): boolean {
        return /\b(start|end|minstart|maxstart|minend|maxend|now)\s+[^\s]*$/i.test(linePrefix);
    }

    private getDateCompletions(): vscode.CompletionItem[] {
        const today = new Date();
        const dates: Array<{ label: string; value: string; description: string }> = [
            {
                label: 'today',
                value: this.formatDate(today),
                description: 'Current date'
            },
            {
                label: 'tomorrow',
                value: this.formatDate(this.addDays(today, 1)),
                description: 'Tomorrow\'s date'
            },
            {
                label: 'next week',
                value: this.formatDate(this.addDays(today, 7)),
                description: 'One week from today'
            },
            {
                label: 'next month',
                value: this.formatDate(this.addMonths(today, 1)),
                description: 'One month from today'
            },
            {
                label: '${now}',
                value: '${now}',
                description: 'Project\'s current date macro'
            }
        ];

        return dates.map(d => {
            const item = new vscode.CompletionItem(d.label, vscode.CompletionItemKind.Constant);
            item.insertText = d.value;
            item.detail = `Date: ${d.value}`;
            item.documentation = new vscode.MarkdownString(d.description);
            item.sortText = `a${d.label}`; // Sort before other items
            return item;
        });
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    private addDays(date: Date, days: number): Date {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    private addMonths(date: Date, months: number): Date {
        const result = new Date(date);
        result.setMonth(result.getMonth() + months);
        return result;
    }
}
