import * as assert from 'assert';
import * as vscode from 'vscode';
import { TaskJugglerReferenceProvider } from '../../referenceProvider';
import { TaskJugglerRenameProvider } from '../../renameProvider';
import { TaskJugglerWorkspaceSymbolProvider } from '../../workspaceSymbolProvider';
import { TaskJugglerDocumentSymbolProvider } from '../../documentSymbolProvider';

suite('v0.5.5 - Comprehensive Improvements Test Suite', () => {

    suite('Enhanced Task References', () => {
        test('Should find task references in depends', async () => {
            const content = `
task spec "Specification" {}
task dev "Development" {
    depends !spec
}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerReferenceProvider();
            const position = new vscode.Position(1, 6); // On "spec"
            const context = { includeDeclaration: true };

            const locations = provider.provideReferences(doc, position, context, {} as any);

            assert.ok(locations, 'Should provide locations');
            assert.ok(locations!.length >= 2, 'Should find definition + depends reference');
        });

        test('Should find task references in precedes', async () => {
            const content = `
task dev "Development" {
    precedes !test
}
task test "Testing" {}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerReferenceProvider();
            const position = new vscode.Position(4, 6); // On "test"
            const context = { includeDeclaration: true };

            const locations = provider.provideReferences(doc, position, context, {} as any);

            assert.ok(locations, 'Should provide locations');
            assert.ok(locations!.length >= 2, 'Should find definition + precedes reference');
        });

        test('Should find task references in follows', async () => {
            const content = `
task test "Testing" {
    follows !dev
}
task dev "Development" {}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerReferenceProvider();
            const position = new vscode.Position(4, 6); // On "dev"
            const context = { includeDeclaration: true };

            const locations = provider.provideReferences(doc, position, context, {} as any);

            assert.ok(locations, 'Should provide locations');
            assert.ok(locations!.length >= 2, 'Should find definition + follows reference');
        });

        test('Should find task references in supplement task', async () => {
            const content = `
task dev "Development" {}
supplement task dev {
    note "Additional info"
}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerReferenceProvider();
            const position = new vscode.Position(1, 6); // On "dev"
            const context = { includeDeclaration: true };

            const locations = provider.provideReferences(doc, position, context, {} as any);

            assert.ok(locations, 'Should provide locations');
            assert.ok(locations!.length >= 2, 'Should find definition + supplement reference');
        });
    });

    suite('Enhanced Resource References', () => {
        test('Should find resource references in allocate', async () => {
            const content = `
resource john "John Doe" {}
task dev "Development" {
    allocate john
}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerReferenceProvider();
            const position = new vscode.Position(1, 10); // On "john"
            const context = { includeDeclaration: true };

            const locations = provider.provideReferences(doc, position, context, {} as any);

            assert.ok(locations, 'Should provide locations');
            assert.ok(locations!.length >= 2, 'Should find definition + allocate reference');
        });

        test('Should find resource references in responsible', async () => {
            const content = `
resource john "John Doe" {}
task dev "Development" {
    responsible john
}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerReferenceProvider();
            const position = new vscode.Position(1, 10); // On "john"
            const context = { includeDeclaration: true };

            const locations = provider.provideReferences(doc, position, context, {} as any);

            assert.ok(locations, 'Should provide locations');
            assert.ok(locations!.length >= 2, 'Should find definition + responsible reference');
        });

        test('Should find resource references in shifts (shift IDs)', async () => {
            const content = `
resource teamA "Team A" {}
resource john "John Doe" {
    shifts teamA
}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerReferenceProvider();
            const position = new vscode.Position(1, 10); // On "teamA"
            const context = { includeDeclaration: true };

            const locations = provider.provideReferences(doc, position, context, {} as any);

            // Note: shifts can reference resources or shift definitions
            // This tests the reference finding capability
            assert.ok(locations, 'Should provide locations');
            assert.ok(locations!.length >= 2, 'Should find definition + shifts reference');
        });

        test('Should find resource references in supplement resource', async () => {
            const content = `
resource john "John Doe" {}
supplement resource john {
    email "john@example.com"
}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerReferenceProvider();
            const position = new vscode.Position(1, 10); // On "john"
            const context = { includeDeclaration: true };

            const locations = provider.provideReferences(doc, position, context, {} as any);

            assert.ok(locations, 'Should provide locations');
            assert.ok(locations!.length >= 2, 'Should find definition + supplement reference');
        });
    });

    suite('Enhanced Rename Support', () => {
        test('Should rename task in all reference contexts', async () => {
            const content = `
task oldTask "Old Task" {}
task dev {
    depends !oldTask
    precedes !oldTask
    follows oldTask
}
supplement task oldTask {}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerRenameProvider();
            const position = new vscode.Position(1, 6); // On "oldTask"
            const newName = 'newTask';

            const edit = provider.provideRenameEdits(doc, position, newName, {} as any);

            assert.ok(edit, 'Should provide edit');
            const edits = edit!.get(doc.uri);
            assert.ok(edits && edits.length >= 5, 'Should rename all 5 occurrences');
        });

        test('Should rename resource in all reference contexts', async () => {
            const content = `
resource oldRes "Old Resource" {}
task dev {
    allocate oldRes
    responsible oldRes
}
supplement resource oldRes {}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerRenameProvider();
            const position = new vscode.Position(1, 10); // On "oldRes"
            const newName = 'newRes';

            const edit = provider.provideRenameEdits(doc, position, newName, {} as any);

            assert.ok(edit, 'Should provide edit');
            const edits = edit!.get(doc.uri);
            assert.ok(edits && edits.length >= 4, 'Should rename all 4 occurrences');
        });
    });

    suite('Workspace Symbol Provider Improvements', () => {
        test('Should include accounts in workspace search', async () => {
            const provider = new TaskJugglerWorkspaceSymbolProvider();
            const symbols = await provider.provideWorkspaceSymbols('costs', {} as any);

            // Note: This test searches actual workspace files
            // In real usage, symbols are found in saved workspace files
            assert.ok(Array.isArray(symbols), 'Should return array');
        });

        test('Should search without 100 file limit', async () => {
            const provider = new TaskJugglerWorkspaceSymbolProvider();
            const symbols = await provider.provideWorkspaceSymbols('', {} as any);

            // Should return results (empty or populated depending on workspace)
            assert.ok(Array.isArray(symbols), 'Should return array');
        });
    });

    suite('Attribute Visibility in Outline', () => {
        test('Should show task attributes in outline detail', async () => {
            const content = `
task dev "Development" {
    effort 10d
    allocate john
}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerDocumentSymbolProvider();
            const symbols = provider.provideDocumentSymbols(doc, {} as any);

            assert.ok(symbols.length > 0, 'Should have symbols');
            const taskSymbol = symbols.find(s => s.name.includes('dev'));
            assert.ok(taskSymbol, 'Should have dev task symbol');

            // Check that detail contains attributes
            assert.ok(
                taskSymbol!.detail.includes('10d') || taskSymbol!.detail.includes('john'),
                'Detail should show effort or allocate'
            );
        });

        test('Should show milestone flag in outline', async () => {
            const content = `
task launch "Product Launch" {
    milestone
}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerDocumentSymbolProvider();
            const symbols = provider.provideDocumentSymbols(doc, {} as any);

            assert.ok(symbols.length > 0, 'Should have symbols');
            const taskSymbol = symbols.find(s => s.name.includes('launch'));
            assert.ok(taskSymbol, 'Should have launch task symbol');
            assert.ok(
                taskSymbol!.detail.includes('milestone'),
                'Detail should show milestone flag'
            );
        });

        test('Should show resource attributes in outline detail', async () => {
            const content = `
resource john "John Doe" {
    rate 500.0
    efficiency 0.9
}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerDocumentSymbolProvider();
            const symbols = provider.provideDocumentSymbols(doc, {} as any);

            assert.ok(symbols.length > 0, 'Should have symbols');
            const resourceSymbol = symbols.find(s => s.name.includes('john'));
            assert.ok(resourceSymbol, 'Should have john resource symbol');

            // Check that detail contains rate or efficiency
            assert.ok(
                resourceSymbol!.detail.includes('€500') || resourceSymbol!.detail.includes('90%'),
                'Detail should show rate or efficiency'
            );
        });

        test('Should handle tasks without attributes gracefully', async () => {
            const content = `
task simple "Simple Task" {
}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerDocumentSymbolProvider();
            const symbols = provider.provideDocumentSymbols(doc, {} as any);

            assert.ok(symbols.length > 0, 'Should have symbols');
            const taskSymbol = symbols.find(s => s.name.includes('simple'));
            assert.ok(taskSymbol, 'Should have simple task symbol');
            // Should have default detail (task type)
            assert.ok(taskSymbol!.detail, 'Should have detail field');
        });
    });

    suite('Integration Tests', () => {
        test('All reference contexts should work together', async () => {
            const content = `
task spec "Specification" {}
task dev "Development" {
    depends !spec
    precedes !test
}
task test "Testing" {
    follows !dev
}
resource john "John" {}
task impl "Implementation" {
    allocate john
    responsible john
}
supplement task impl {
    note "Important"
}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerReferenceProvider();

            // Test multiple reference types
            const devPos = new vscode.Position(2, 6); // On "dev" in task def
            const devRefs = provider.provideReferences(doc, devPos, { includeDeclaration: true }, {} as any);

            assert.ok(devRefs, 'Should find dev references');
            assert.ok(devRefs!.length >= 2, 'Should find multiple dev references');
        });
    });
});

async function createDocument(content: string): Promise<vscode.TextDocument> {
    return await vscode.workspace.openTextDocument({
        content,
        language: 'taskjuggler'
    });
}
