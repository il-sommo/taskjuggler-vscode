import * as assert from 'assert';
import * as vscode from 'vscode';
import { TaskJugglerParser } from '../../taskjugglerParser';
import { TaskJugglerDocumentSymbolProvider } from '../../documentSymbolProvider';
import { TaskJugglerReferenceProvider } from '../../referenceProvider';
import { TaskJugglerRenameProvider } from '../../renameProvider';

suite('v0.5.1 - Quick Fixes Test Suite', () => {

    suite('Account Support', () => {
        let parser: TaskJugglerParser;

        setup(() => {
            parser = new TaskJugglerParser();
        });

        test('Parser should extract account definitions', async () => {
            const content = `
account costs "Project Costs"
account revenue "Revenue Stream"
            `;
            const doc = await createDocument(content);
            const parsed = parser.parseDocument(doc);

            assert.strictEqual(parsed.accounts.length, 2);
            assert.strictEqual(parsed.accounts[0].id, 'costs');
            assert.strictEqual(parsed.accounts[0].name, 'Project Costs');
            assert.strictEqual(parsed.accounts[1].id, 'revenue');
        });

        test('Account should appear in outline', async () => {
            const content = `
account costs "Project Costs"
task dev "Development" {}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerDocumentSymbolProvider();
            const symbols = provider.provideDocumentSymbols(doc, {} as any);

            assert.ok(symbols.length >= 2, 'Should have task and account symbols');
            const labels = symbols.map(s => s.name);
            assert.ok(labels.some(l => l.includes('costs')), 'Should include account');
        });

        test('Should find account references in charge', async () => {
            const content = `
account costs "Project Costs"
task dev "Development" {
    charge 1000 costs
}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerReferenceProvider();
            const position = new vscode.Position(1, 10); // On "costs"
            const context = { includeDeclaration: true };

            const locations = provider.provideReferences(doc, position, context, {} as any);

            assert.ok(locations, 'Should provide locations');
            assert.ok(locations!.length >= 2, 'Should find definition + reference');
        });

        test('Should rename account everywhere', async () => {
            const content = `
account oldAcc "Old Account"
task dev {
    charge 1000 oldAcc
}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerRenameProvider();
            const position = new vscode.Position(1, 10); // On "oldAcc"
            const newName = 'newAcc';

            const edit = provider.provideRenameEdits(doc, position, newName, {} as any);

            assert.ok(edit, 'Should provide edit');
            const edits = edit!.get(doc.uri);
            assert.ok(edits && edits.length >= 2, 'Should rename definition and reference');
        });
    });

    suite('Nested Tasks Support', () => {
        let parser: TaskJugglerParser;

        setup(() => {
            parser = new TaskJugglerParser();
        });

        test('Parser should track parent-child relationships', async () => {
            const content = `
task parent "Parent" {
    task child "Child" {
    }
}
            `;
            const doc = await createDocument(content);
            const parsed = parser.parseDocument(doc);

            assert.strictEqual(parsed.tasks.length, 2);
            const parent = parsed.tasks.find(t => t.id === 'parent');
            const child = parsed.tasks.find(t => t.id === 'child');

            assert.ok(parent, 'Should have parent task');
            assert.ok(child, 'Should have child task');
            assert.strictEqual(child!.parent, 'parent', 'Child should have parent reference');
        });

        test('Outline should show nested task hierarchy', async () => {
            const content = `
task parent "Parent" {
    task child1 "Child 1" {}
    task child2 "Child 2" {}
}
            `;
            const doc = await createDocument(content);
            const provider = new TaskJugglerDocumentSymbolProvider();
            const symbols = provider.provideDocumentSymbols(doc, {} as any);

            assert.ok(symbols.length >= 1, 'Should have symbols');
            const parentSymbol = symbols.find(s => s.name.includes('parent'));
            assert.ok(parentSymbol, 'Should have parent symbol');
            assert.strictEqual(parentSymbol!.children.length, 2, 'Parent should have 2 children');
        });

        test('Multi-level nesting should work', async () => {
            const content = `
task level1 "Level 1" {
    task level2 "Level 2" {
        task level3 "Level 3" {
        }
    }
}
            `;
            const doc = await createDocument(content);
            const parsed = parser.parseDocument(doc);

            assert.strictEqual(parsed.tasks.length, 3);
            const l1 = parsed.tasks.find(t => t.id === 'level1');
            const l2 = parsed.tasks.find(t => t.id === 'level2');
            const l3 = parsed.tasks.find(t => t.id === 'level3');

            assert.ok(!l1!.parent, 'Level 1 should be root');
            assert.strictEqual(l2!.parent, 'level1', 'Level 2 parent should be level1');
            assert.strictEqual(l3!.parent, 'level2', 'Level 3 parent should be level2');
        });
    });

    suite('Integration Tests', () => {
        test('Account and tasks should coexist', async () => {
            const content = `
account costs "Costs"
task dev "Development" {}
resource john "John" {}
            `;
            const doc = await createDocument(content);
            const parser = new TaskJugglerParser();
            const parsed = parser.parseDocument(doc);

            assert.strictEqual(parsed.accounts.length, 1);
            assert.strictEqual(parsed.tasks.length, 1);
            assert.strictEqual(parsed.resources.length, 1);
        });

        test('Nested tasks with account charges', async () => {
            const content = `
account costs "Costs"
task parent "Parent" {
    task child "Child" {
        charge 500 costs
    }
}
            `;
            const doc = await createDocument(content);
            const parser = new TaskJugglerParser();
            const parsed = parser.parseDocument(doc);

            assert.strictEqual(parsed.tasks.length, 2);
            assert.strictEqual(parsed.accounts.length, 1);

            const child = parsed.tasks.find(t => t.id === 'child');
            assert.strictEqual(child!.parent, 'parent');
        });
    });
});

async function createDocument(content: string): Promise<vscode.TextDocument> {
    return await vscode.workspace.openTextDocument({
        content,
        language: 'taskjuggler'
    });
}
