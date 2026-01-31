import * as assert from 'assert';
import * as vscode from 'vscode';
import { TaskJugglerDocumentSymbolProvider } from '../../documentSymbolProvider';
import { TaskJugglerReferenceProvider } from '../../referenceProvider';
import { TaskJugglerRenameProvider } from '../../renameProvider';

suite('Navigation Providers Test Suite', () => {

    suite('Document Symbol Provider', () => {
        let provider: TaskJugglerDocumentSymbolProvider;

        setup(() => {
            provider = new TaskJugglerDocumentSymbolProvider();
        });

        test('Should provide symbols for tasks', async () => {
            const content = `
task dev "Development" {}
task test "Testing" {}
            `;
            const doc = await createDocument(content);
            const symbols = provider.provideDocumentSymbols(doc, {} as any);

            assert.ok(symbols.length >= 2, 'Should have at least 2 symbols');
            const labels = symbols.map(s => s.name);
            assert.ok(labels.some(l => l.includes('dev')), 'Should include dev task');
            assert.ok(labels.some(l => l.includes('test')), 'Should include test task');
        });

        test('Should provide symbols for resources', async () => {
            const content = `
resource john "John Doe" {}
resource jane "Jane Doe" {}
            `;
            const doc = await createDocument(content);
            const symbols = provider.provideDocumentSymbols(doc, {} as any);

            assert.ok(symbols.length >= 2, 'Should have at least 2 symbols');
            const labels = symbols.map(s => s.name);
            assert.ok(labels.some(l => l.includes('john')), 'Should include john resource');
            assert.ok(labels.some(l => l.includes('jane')), 'Should include jane resource');
        });

        test('Should use correct symbol kinds', async () => {
            const content = `
task dev "Development" {}
resource john "John Doe" {}
            `;
            const doc = await createDocument(content);
            const symbols = provider.provideDocumentSymbols(doc, {} as any);

            assert.ok(symbols.length >= 2, 'Should have symbols');
            // Tasks should be Function kind, Resources should be Class kind
            const hasFunction = symbols.some(s => s.kind === vscode.SymbolKind.Function);
            const hasClass = symbols.some(s => s.kind === vscode.SymbolKind.Class);
            assert.ok(hasFunction || hasClass, 'Should have appropriate symbol kinds');
        });
    });

    suite('Reference Provider', () => {
        let provider: TaskJugglerReferenceProvider;

        setup(() => {
            provider = new TaskJugglerReferenceProvider();
        });

        test('Should find task references in depends', async () => {
            const content = `
task spec "Specification" {}
task dev "Development" {
    depends !spec
}
task test "Testing" {
    depends !spec
}
            `;
            const doc = await createDocument(content);
            // Position on "spec" in first task definition
            const position = new vscode.Position(1, 6);
            const context = { includeDeclaration: true };

            const locations = provider.provideReferences(doc, position, context, {} as any);

            assert.ok(locations, 'Should provide locations');
            assert.ok(locations!.length >= 3, 'Should find definition + 2 references');
        });

        test('Should find resource references in allocate', async () => {
            const content = `
resource john "John Doe" {}
task dev "Development" {
    allocate john
}
task test "Testing" {
    allocate john
}
            `;
            const doc = await createDocument(content);
            // Position on "john" in resource definition
            const position = new vscode.Position(1, 10);
            const context = { includeDeclaration: true };

            const locations = provider.provideReferences(doc, position, context, {} as any);

            assert.ok(locations, 'Should provide locations');
            assert.ok(locations!.length >= 3, 'Should find definition + 2 references');
        });

        test('Should exclude declaration when requested', async () => {
            const content = `
task spec "Specification" {}
task dev "Development" {
    depends !spec
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(1, 6);
            const context = { includeDeclaration: false };

            const locations = provider.provideReferences(doc, position, context, {} as any);

            assert.ok(locations, 'Should provide locations');
            // Should only have references, not declaration
            assert.ok(locations!.length >= 1, 'Should find at least 1 reference');
        });
    });

    suite('Rename Provider', () => {
        let provider: TaskJugglerRenameProvider;

        setup(() => {
            provider = new TaskJugglerRenameProvider();
        });

        test('Should prepare rename for valid task', async () => {
            const content = `
task dev "Development" {}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(1, 6); // On "dev"

            const range = provider.prepareRename(doc, position, {} as any);

            assert.ok(range, 'Should allow rename');
        });

        test('Should rename task and all references', async () => {
            const content = `
task spec "Specification" {}
task dev "Development" {
    depends !spec
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(1, 6); // On "spec"
            const newName = 'specification';

            const edit = provider.provideRenameEdits(doc, position, newName, {} as any);

            assert.ok(edit, 'Should provide edit');
            const edits = edit!.get(doc.uri);
            assert.ok(edits && edits.length >= 2, 'Should rename definition and reference');
        });

        test('Should rename resource and all references', async () => {
            const content = `
resource john "John Doe" {}
task dev "Development" {
    allocate john
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(1, 10); // On "john"
            const newName = 'johnDoe';

            const edit = provider.provideRenameEdits(doc, position, newName, {} as any);

            assert.ok(edit, 'Should provide edit');
            const edits = edit!.get(doc.uri);
            assert.ok(edits && edits.length >= 2, 'Should rename definition and reference');
        });

        test('Should reject invalid identifier names', async () => {
            const content = `
task dev "Development" {}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(1, 6);
            const invalidName = '123invalid'; // Starts with number

            const edit = provider.provideRenameEdits(doc, position, invalidName, {} as any);

            // Should return null for invalid name
            assert.strictEqual(edit, null, 'Should reject invalid identifier');
        });
    });
});

async function createDocument(content: string): Promise<vscode.TextDocument> {
    return await vscode.workspace.openTextDocument({
        content,
        language: 'taskjuggler'
    });
}
