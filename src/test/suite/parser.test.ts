import * as assert from 'assert';
import * as vscode from 'vscode';
import { TaskJugglerParser } from '../../taskjugglerParser';

suite('TaskJuggler Parser Test Suite', () => {
    let parser: TaskJugglerParser;

    setup(() => {
        parser = new TaskJugglerParser();
    });

    suite('Symbol Parsing', () => {
        test('Should parse task definitions', async () => {
            const content = 'task dev "Development" {\n  effort 5d\n}';
            const doc = await createDocument(content);
            const result = parser.parseDocument(doc);

            assert.strictEqual(result.tasks.length, 1);
            assert.strictEqual(result.tasks[0].id, 'dev');
            assert.strictEqual(result.tasks[0].name, 'Development');
            assert.strictEqual(result.tasks[0].type, 'task');
        });

        test('Should parse resource definitions', async () => {
            const content = 'resource john "John Doe" {\n  rate 500.0\n}';
            const doc = await createDocument(content);
            const result = parser.parseDocument(doc);

            assert.strictEqual(result.resources.length, 1);
            assert.strictEqual(result.resources[0].id, 'john');
            assert.strictEqual(result.resources[0].name, 'John Doe');
            assert.strictEqual(result.resources[0].type, 'resource');
        });

        test('Should parse multiple tasks and resources', async () => {
            const content = `
task task1 "Task 1" {}
task task2 "Task 2" {}
resource res1 "Resource 1" {}
resource res2 "Resource 2" {}
            `;
            const doc = await createDocument(content);
            const result = parser.parseDocument(doc);

            assert.strictEqual(result.tasks.length, 2);
            assert.strictEqual(result.resources.length, 2);
        });

        test('Should parse scenario definitions', async () => {
            const content = 'scenario plan "Plan Scenario" {}';
            const doc = await createDocument(content);
            const result = parser.parseDocument(doc);

            assert.strictEqual(result.scenarios.length, 1);
            assert.strictEqual(result.scenarios[0].id, 'plan');
        });

        test('Should skip comments', async () => {
            const content = `
# This is a comment
task dev "Development" {}
// Another comment
resource john "John" {}
            `;
            const doc = await createDocument(content);
            const result = parser.parseDocument(doc);

            assert.strictEqual(result.tasks.length, 1);
            assert.strictEqual(result.resources.length, 1);
        });
    });

    suite('Context Detection', () => {
        test('Should detect task block context', async () => {
            const content = `
task dev "Development" {
    effort 5d

}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 4); // Inside task block

            const context = parser.getContextAtPosition(doc, position);

            assert.strictEqual(context.currentBlock, 'task');
            assert.strictEqual(context.blockId, 'dev');
        });

        test('Should detect resource block context', async () => {
            const content = `
resource john "John Doe" {
    rate 500.0

}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 4); // Inside resource block

            const context = parser.getContextAtPosition(doc, position);

            assert.strictEqual(context.currentBlock, 'resource');
            assert.strictEqual(context.blockId, 'john');
        });

        test('Should detect project block context', async () => {
            const content = `
project test "Test" 2024-01-01 +6m {
    timezone "UTC"

}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 4);

            const context = parser.getContextAtPosition(doc, position);

            assert.strictEqual(context.currentBlock, 'project');
        });

        test('Should detect report block context', async () => {
            const content = `
taskreport overview "" {
    formats html

}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 4);

            const context = parser.getContextAtPosition(doc, position);

            assert.strictEqual(context.currentBlock, 'report');
        });

        test.skip('Should detect no context at top level (edge case)', async () => {
            const content = `
task dev "Development" {}

            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 0); // Outside any block

            const context = parser.getContextAtPosition(doc, position);

            assert.strictEqual(context.currentBlock, 'none');
        });

        test('Should track used attributes', async () => {
            const content = `
task dev "Development" {
    effort 5d
    allocate john
    depends !spec

}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(5, 4);

            const context = parser.getContextAtPosition(doc, position);

            assert.ok(context.usedAttributes.has('effort'));
            assert.ok(context.usedAttributes.has('allocate'));
            assert.ok(context.usedAttributes.has('depends'));
            assert.strictEqual(context.usedAttributes.size, 3);
        });

        test('Should handle nested blocks', async () => {
            const content = `
task parent "Parent" {
    task child "Child" {
        effort 5d

    }
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(3, 8); // Inside nested task

            const context = parser.getContextAtPosition(doc, position);

            assert.strictEqual(context.currentBlock, 'task');
            assert.strictEqual(context.blockId, 'child');
            assert.strictEqual(context.parentBlocks.length, 2);
        });
    });

    suite('Symbol Finding', () => {
        test('Should find task by ID', async () => {
            const content = `
task dev "Development" {}
task test "Testing" {}
            `;
            const doc = await createDocument(content);

            const symbol = parser.findSymbol(doc, 'dev');

            assert.ok(symbol);
            assert.strictEqual(symbol!.id, 'dev');
            assert.strictEqual(symbol!.name, 'Development');
        });

        test('Should find resource by ID', async () => {
            const content = `
resource john "John Doe" {}
resource jane "Jane Doe" {}
            `;
            const doc = await createDocument(content);

            const symbol = parser.findSymbol(doc, 'jane');

            assert.ok(symbol);
            assert.strictEqual(symbol!.id, 'jane');
            assert.strictEqual(symbol!.name, 'Jane Doe');
        });

        test('Should return undefined for non-existent symbol', async () => {
            const content = 'task dev "Development" {}';
            const doc = await createDocument(content);

            const symbol = parser.findSymbol(doc, 'nonexistent');

            assert.strictEqual(symbol, undefined);
        });
    });
});

async function createDocument(content: string): Promise<vscode.TextDocument> {
    return await vscode.workspace.openTextDocument({
        content,
        language: 'taskjuggler'
    });
}
