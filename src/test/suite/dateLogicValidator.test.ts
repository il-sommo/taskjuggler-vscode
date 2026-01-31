import * as assert from 'assert';
import * as vscode from 'vscode';
import { DateValidator } from '../../validators/dateValidator';

suite('Date Logic Validator Test Suite', () => {
    let validator: DateValidator;

    setup(() => {
        validator = new DateValidator();
    });

    suite('Start/End Date Logic', () => {
        test('Should error when end date is before start date', async () => {
            const content = `
task dev "Development" {
    start 2024-06-01
    end 2024-05-01
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateDateLogic(doc);

            assert.strictEqual(diagnostics.length, 1);
            assert.ok(diagnostics[0].message.includes('End date'));
            assert.ok(diagnostics[0].message.includes('must be after start date'));
        });

        test('Should error when end date equals start date', async () => {
            const content = `
task dev "Development" {
    start 2024-06-01
    end 2024-06-01
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateDateLogic(doc);

            assert.strictEqual(diagnostics.length, 1);
        });

        test('Should not error when end date is after start date', async () => {
            const content = `
task dev "Development" {
    start 2024-06-01
    end 2024-06-15
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateDateLogic(doc);

            assert.strictEqual(diagnostics.length, 0);
        });

        test('Should not error when only start is specified', async () => {
            const content = `
task dev "Development" {
    start 2024-06-01
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateDateLogic(doc);

            assert.strictEqual(diagnostics.length, 0);
        });

        test('Should not error when only end is specified', async () => {
            const content = `
task dev "Development" {
    end 2024-06-15
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateDateLogic(doc);

            assert.strictEqual(diagnostics.length, 0);
        });
    });

    suite('Min/Max Constraint Logic', () => {
        test('Should warn when maxstart is before minstart', async () => {
            const content = `
task dev "Development" {
    minstart 2024-06-01
    maxstart 2024-05-01
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateDateLogic(doc);

            assert.strictEqual(diagnostics.length, 1);
            assert.ok(diagnostics[0].message.includes('maxstart'));
            assert.ok(diagnostics[0].message.includes('must be after minstart'));
            assert.strictEqual(diagnostics[0].severity, vscode.DiagnosticSeverity.Warning);
        });

        test('Should warn when maxend is before minend', async () => {
            const content = `
task dev "Development" {
    minend 2024-06-15
    maxend 2024-06-01
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateDateLogic(doc);

            assert.strictEqual(diagnostics.length, 1);
            assert.ok(diagnostics[0].message.includes('maxend'));
            assert.ok(diagnostics[0].message.includes('must be after minend'));
        });

        test('Should not error with valid min/max constraints', async () => {
            const content = `
task dev "Development" {
    minstart 2024-06-01
    maxstart 2024-06-15
    minend 2024-07-01
    maxend 2024-07-15
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateDateLogic(doc);

            assert.strictEqual(diagnostics.length, 0);
        });
    });

    suite('Multiple Tasks', () => {
        test('Should validate dates in multiple tasks', async () => {
            const content = `
task task1 "Task 1" {
    start 2024-06-01
    end 2024-05-01
}
task task2 "Task 2" {
    start 2024-07-01
    end 2024-08-01
}
task task3 "Task 3" {
    start 2024-09-01
    end 2024-08-01
}
            `;
            const doc = await createDocument(content);
            const diagnostics = validator.validateDateLogic(doc);

            // Should detect errors in task1 and task3
            assert.strictEqual(diagnostics.length, 2);
        });
    });
});

async function createDocument(content: string): Promise<vscode.TextDocument> {
    return await vscode.workspace.openTextDocument({
        content,
        language: 'taskjuggler'
    });
}
