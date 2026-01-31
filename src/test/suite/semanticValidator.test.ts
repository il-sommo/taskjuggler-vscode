import * as assert from 'assert';
import * as vscode from 'vscode';
import { SemanticValidator } from '../../validators/semanticValidator';

suite('Semantic Validator Test Suite', () => {
    let validator: SemanticValidator;

    setup(() => {
        validator = new SemanticValidator();
    });

    suite('Undefined Reference Detection', () => {
        test('Should detect undefined task in depends', async () => {
            const content = `
task dev "Development" {
    depends !spec
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateReferences(doc);

            assert.strictEqual(diagnostics.length, 1);
            assert.ok(diagnostics[0].message.includes('Undefined task'));
            assert.ok(diagnostics[0].message.includes('spec'));
        });

        test('Should detect undefined resource in allocate', async () => {
            const content = `
task dev "Development" {
    allocate john
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateReferences(doc);

            assert.strictEqual(diagnostics.length, 1);
            assert.ok(diagnostics[0].message.includes('Undefined resource'));
            assert.ok(diagnostics[0].message.includes('john'));
        });

        test('Should not error when task exists', async () => {
            const content = `
task spec "Specification" {}
task dev "Development" {
    depends !spec
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateReferences(doc);

            assert.strictEqual(diagnostics.length, 0);
        });

        test('Should not error when resource exists', async () => {
            const content = `
resource john "John Doe" {}
task dev "Development" {
    allocate john
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateReferences(doc);

            assert.strictEqual(diagnostics.length, 0);
        });

        test('Should handle multiple references', async () => {
            const content = `
task spec "Specification" {}
task dev "Development" {
    depends !spec
    depends !design
    allocate john
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateReferences(doc);

            // Should detect 2 undefined references: design task and john resource
            assert.strictEqual(diagnostics.length, 2);
        });
    });

    suite('Circular Dependency Detection', () => {
        test('Should detect simple circular dependency', async () => {
            const content = `
task a "Task A" {
    depends !b
}
task b "Task B" {
    depends !a
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateCircularDependencies(doc);

            assert.strictEqual(diagnostics.length, 1);
            assert.ok(diagnostics[0].message.includes('Circular dependency'));
            assert.ok(diagnostics[0].message.includes('a') && diagnostics[0].message.includes('b'));
        });

        test('Should detect 3-way circular dependency', async () => {
            const content = `
task a "Task A" {
    depends !b
}
task b "Task B" {
    depends !c
}
task c "Task C" {
    depends !a
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateCircularDependencies(doc);

            assert.strictEqual(diagnostics.length, 1);
            assert.ok(diagnostics[0].message.includes('Circular dependency'));
        });

        test('Should not error on valid dependency chain', async () => {
            const content = `
task a "Task A" {}
task b "Task B" {
    depends !a
}
task c "Task C" {
    depends !b
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateCircularDependencies(doc);

            assert.strictEqual(diagnostics.length, 0);
        });

        test('Should handle self-dependency', async () => {
            const content = `
task a "Task A" {
    depends !a
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateCircularDependencies(doc);

            assert.strictEqual(diagnostics.length, 1);
            assert.ok(diagnostics[0].message.includes('Circular dependency'));
        });

        test('Should handle diamond dependency (no cycle)', async () => {
            const content = `
task a "Task A" {}
task b "Task B" {
    depends !a
}
task c "Task C" {
    depends !a
}
task d "Task D" {
    depends !b, !c
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateCircularDependencies(doc);

            // Diamond pattern is valid - no cycle
            assert.strictEqual(diagnostics.length, 0);
        });
    });
});

async function createDocument(content: string): Promise<vscode.TextDocument> {
    return await vscode.workspace.openTextDocument({
        content,
        language: 'taskjuggler'
    });
}
