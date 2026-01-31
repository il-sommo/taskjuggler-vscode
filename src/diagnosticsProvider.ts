import * as vscode from 'vscode';
import { DateValidator } from './validators/dateValidator';
import { SyntaxValidator } from './validators/syntaxValidator';
import { SemanticValidator } from './validators/semanticValidator';

/**
 * Provides real-time diagnostics for TaskJuggler files
 */
export class DiagnosticsProvider {
    private diagnosticCollection: vscode.DiagnosticCollection;
    private dateValidator: DateValidator;
    private syntaxValidator: SyntaxValidator;
    private semanticValidator: SemanticValidator;
    private validationTimeout: NodeJS.Timeout | null = null;

    constructor() {
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('taskjuggler');
        this.dateValidator = new DateValidator();
        this.syntaxValidator = new SyntaxValidator();
        this.semanticValidator = new SemanticValidator();
    }

    /**
     * Register diagnostics provider with VS Code
     */
    public register(context: vscode.ExtensionContext): void {
        context.subscriptions.push(this.diagnosticCollection);

        // Validate on document open
        vscode.workspace.textDocuments.forEach(doc => {
            if (doc.languageId === 'taskjuggler') {
                this.validateDocument(doc);
            }
        });

        // Validate on document change (debounced)
        context.subscriptions.push(
            vscode.workspace.onDidChangeTextDocument(event => {
                if (event.document.languageId === 'taskjuggler') {
                    this.debouncedValidate(event.document);
                }
            })
        );

        // Validate on document save
        context.subscriptions.push(
            vscode.workspace.onDidSaveTextDocument(doc => {
                if (doc.languageId === 'taskjuggler') {
                    this.validateDocument(doc);
                }
            })
        );

        // Clear diagnostics when document is closed
        context.subscriptions.push(
            vscode.workspace.onDidCloseTextDocument(doc => {
                if (doc.languageId === 'taskjuggler') {
                    this.diagnosticCollection.delete(doc.uri);
                }
            })
        );
    }

    /**
     * Debounced validation (500ms delay after typing stops)
     */
    private debouncedValidate(document: vscode.TextDocument): void {
        if (this.validationTimeout) {
            clearTimeout(this.validationTimeout);
        }

        this.validationTimeout = setTimeout(() => {
            this.validateDocument(document);
        }, 500);
    }

    /**
     * Validate a document and update diagnostics
     */
    public validateDocument(document: vscode.TextDocument): void {
        if (document.languageId !== 'taskjuggler') {
            return;
        }

        const diagnostics: vscode.Diagnostic[] = [];

        // Run all validators
        try {
            // 1. Date validation
            const dateDiagnostics = this.dateValidator.validateDatesInDocument(document);
            diagnostics.push(...dateDiagnostics);

            // 2. Syntax validation (braces)
            const braceDiagnostics = this.syntaxValidator.validateBraces(document);
            diagnostics.push(...braceDiagnostics);

            // 3. Duplicate ID validation
            const duplicateDiagnostics = this.syntaxValidator.validateDuplicateIds(document);
            diagnostics.push(...duplicateDiagnostics);

            // 4. Semantic validation (undefined references)
            const referenceDiagnostics = this.semanticValidator.validateReferences(document);
            diagnostics.push(...referenceDiagnostics);

            // 5. Circular dependency validation
            const circularDiagnostics = this.semanticValidator.validateCircularDependencies(document);
            diagnostics.push(...circularDiagnostics);

        } catch (error) {
            console.error('Error during validation:', error);
        }

        // Update diagnostics collection
        this.diagnosticCollection.set(document.uri, diagnostics);
    }

    /**
     * Clear all diagnostics
     */
    public clearAll(): void {
        this.diagnosticCollection.clear();
    }

    /**
     * Dispose of resources
     */
    public dispose(): void {
        this.diagnosticCollection.dispose();
        if (this.validationTimeout) {
            clearTimeout(this.validationTimeout);
        }
    }
}
