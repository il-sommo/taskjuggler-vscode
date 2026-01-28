import * as vscode from 'vscode';
import { TaskJugglerHoverProvider } from './hoverProvider';
import { TaskJugglerCompletionProvider } from './completionProvider';
import { TaskJugglerDefinitionProvider } from './definitionProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('TaskJuggler extension activated');

    const selector: vscode.DocumentSelector = {
        language: 'taskjuggler',
        scheme: 'file'
    };

    // Register Hover Provider
    const hoverProvider = vscode.languages.registerHoverProvider(
        selector,
        new TaskJugglerHoverProvider()
    );

    // Register Completion Provider
    const completionProvider = vscode.languages.registerCompletionItemProvider(
        selector,
        new TaskJugglerCompletionProvider(),
        '.', ' ', '\n'
    );

    // Register Definition Provider
    const definitionProvider = vscode.languages.registerDefinitionProvider(
        selector,
        new TaskJugglerDefinitionProvider()
    );

    context.subscriptions.push(
        hoverProvider,
        completionProvider,
        definitionProvider
    );

    vscode.window.showInformationMessage('TaskJuggler: AI features enabled!');
}

export function deactivate() {
    console.log('TaskJuggler extension deactivated');
}
