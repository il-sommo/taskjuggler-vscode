import * as vscode from 'vscode';
import { TaskJugglerHoverProvider } from './hoverProvider';
import { TaskJugglerCompletionProvider } from './completionProvider';
import { TaskJugglerDefinitionProvider } from './definitionProvider';
import { TaskJugglerSignatureHelpProvider } from './signatureHelpProvider';
import { registerQuickStart } from './quickStart';
import { InteractiveSnippets } from './interactiveSnippets';

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

    // Register Interactive Snippets
    const interactiveSnippets = new InteractiveSnippets();

    const insertProjectCommand = vscode.commands.registerCommand(
        'taskjuggler.insertProject',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'taskjuggler') {
                interactiveSnippets.insertProject(editor);
            }
        }
    );

    const insertTaskCommand = vscode.commands.registerCommand(
        'taskjuggler.insertTask',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'taskjuggler') {
                interactiveSnippets.insertTask(editor);
            }
        }
    );

    const insertResourceCommand = vscode.commands.registerCommand(
        'taskjuggler.insertResource',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'taskjuggler') {
                interactiveSnippets.insertResource(editor);
            }
        }
    );

    const insertReportCommand = vscode.commands.registerCommand(
        'taskjuggler.insertReport',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'taskjuggler') {
                interactiveSnippets.insertReport(editor);
            }
        }
    );

    const insertAllocateCommand = vscode.commands.registerCommand(
        'taskjuggler.insertAllocate',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'taskjuggler') {
                interactiveSnippets.insertAllocate(editor);
            }
        }
    );

    const insertDependenciesCommand = vscode.commands.registerCommand(
        'taskjuggler.insertDependencies',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'taskjuggler') {
                interactiveSnippets.insertDependencies(editor);
            }
        }
    );

    const insertVacationCommand = vscode.commands.registerCommand(
        'taskjuggler.insertVacation',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'taskjuggler') {
                interactiveSnippets.insertVacation(editor);
            }
        }
    );

    const insertShiftCommand = vscode.commands.registerCommand(
        'taskjuggler.insertShift',
        () => {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId === 'taskjuggler') {
                interactiveSnippets.insertShift(editor);
            }
        }
    );

    context.subscriptions.push(
        insertProjectCommand,
        insertTaskCommand,
        insertResourceCommand,
        insertReportCommand,
        insertAllocateCommand,
        insertDependenciesCommand,
        insertVacationCommand,
        insertShiftCommand
    );

    vscode.window.showInformationMessage('TaskJuggler: Context-aware features enabled!');
}

export function deactivate() {
    console.log('TaskJuggler extension deactivated');
}
