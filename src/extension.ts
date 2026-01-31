import * as vscode from 'vscode';
import { TaskJugglerHoverProvider } from './hoverProvider';
import { TaskJugglerCompletionProvider } from './completionProvider';
import { TaskJugglerDefinitionProvider } from './definitionProvider';
import { TaskJugglerSignatureHelpProvider } from './signatureHelpProvider';
import { registerQuickStart } from './quickStart';

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

    // Register Signature Help Provider
    const signatureHelpProvider = vscode.languages.registerSignatureHelpProvider(
        selector,
        new TaskJugglerSignatureHelpProvider(),
        ' ', '-'
    );

    context.subscriptions.push(
        hoverProvider,
        completionProvider,
        definitionProvider,
        signatureHelpProvider
    );

    // Register Quick Start for empty files
    registerQuickStart(context);

    vscode.window.showInformationMessage('TaskJuggler: Context-aware features enabled!');
}

export function deactivate() {
    console.log('TaskJuggler extension deactivated');
}
