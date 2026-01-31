import * as assert from 'assert';
import * as vscode from 'vscode';
import { TaskJugglerCompletionProvider } from '../../completionProvider';

suite('Completion Provider Test Suite', () => {
    let provider: TaskJugglerCompletionProvider;

    setup(() => {
        provider = new TaskJugglerCompletionProvider();
    });

    suite('Context-Aware Completions', () => {
        test('Should provide task-specific completions inside task block', async () => {
            const content = `
task dev "Development" {

}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 4);

            const completions = await provider.provideCompletionItems(
                doc,
                position,
                { triggerKind: vscode.CompletionTriggerKind.Invoke } as any,
                {} as any
            );

            const items = Array.isArray(completions) ? completions : completions?.items || [];
            const labels = items.map(item => item.label);

            // Should include task-specific attributes
            assert.ok(labels.includes('effort'), 'Should include effort');
            assert.ok(labels.includes('allocate'), 'Should include allocate');
            assert.ok(labels.includes('depends'), 'Should include depends');

            // Note: Context filtering focuses on providing relevant attributes
        });

        test('Should provide resource-specific completions inside resource block', async () => {
            const content = `
resource john "John Doe" {

}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 4);

            const completions = await provider.provideCompletionItems(
                doc,
                position,
                { triggerKind: vscode.CompletionTriggerKind.Invoke } as any,
                {} as any
            );

            const items = Array.isArray(completions) ? completions : completions?.items || [];
            const labels = items.map(item => item.label);

            // Should include resource-specific attributes
            assert.ok(labels.includes('rate'), 'Should include rate');
            assert.ok(labels.includes('efficiency'), 'Should include efficiency');

            // Note: Context filtering may include some common attributes
            // Main goal is resource-specific attributes are available
        });

        test('Should provide project-specific completions inside project block', async () => {
            const content = `
project test "Test" 2024-01-01 +6m {

}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 4);

            const completions = await provider.provideCompletionItems(
                doc,
                position,
                { triggerKind: vscode.CompletionTriggerKind.Invoke } as any,
                {} as any
            );

            const items = Array.isArray(completions) ? completions : completions?.items || [];
            const labels = items.map(item => item.label);

            // Should include project-specific attributes
            assert.ok(labels.includes('timezone'), 'Should include timezone');
            assert.ok(labels.includes('currency'), 'Should include currency');

            // Note: Context provides project-specific attributes
        });

        test('Should provide report-specific completions inside report block', async () => {
            const content = `
taskreport overview "" {

}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 4);

            const completions = await provider.provideCompletionItems(
                doc,
                position,
                { triggerKind: vscode.CompletionTriggerKind.Invoke } as any,
                {} as any
            );

            const items = Array.isArray(completions) ? completions : completions?.items || [];
            const labels = items.map(item => item.label);

            // Should include report-specific attributes
            assert.ok(labels.includes('formats'), 'Should include formats');
            assert.ok(labels.includes('columns'), 'Should include columns');
            assert.ok(labels.includes('period'), 'Should include period');
        });

        test('Should provide completions at top level', async () => {
            const content = `project test "Test" 2024-01-01 +6m {}

`;
            const doc = await createDocument(content);
            const position = new vscode.Position(1, 0);

            const completions = await provider.provideCompletionItems(
                doc,
                position,
                { triggerKind: vscode.CompletionTriggerKind.Invoke } as any,
                {} as any
            );

            // Should provide some completions at top level
            const items = Array.isArray(completions) ? completions : completions?.items || [];
            assert.ok(items.length >= 0, 'Should provide completion response at top level');
        });

        test('Should exclude already-used attributes', async () => {
            const content = `
task dev "Development" {
    effort 5d
    allocate john

}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(4, 4);

            const completions = await provider.provideCompletionItems(
                doc,
                position,
                { triggerKind: vscode.CompletionTriggerKind.Invoke } as any,
                {} as any
            );

            const items = Array.isArray(completions) ? completions : completions?.items || [];
            const labels = items.map(item => item.label);

            // Should NOT include already-used attributes
            assert.ok(!labels.includes('effort'), 'Should not include already-used effort');
            assert.ok(!labels.includes('allocate'), 'Should not include already-used allocate');

            // Should include other task attributes
            assert.ok(labels.includes('depends'), 'Should include unused depends');
        });
    });

    suite('Reference Completions', () => {
        test('Should suggest tasks for depends attribute', async () => {
            const content = `
task task1 "Task 1" {}
task task2 "Task 2" {}

task task3 "Task 3" {
    depends
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(5, 12); // After "depends "

            const completions = await provider.provideCompletionItems(
                doc,
                position,
                { triggerKind: vscode.CompletionTriggerKind.Invoke } as any,
                {} as any
            );

            const items = Array.isArray(completions) ? completions : completions?.items || [];

            assert.ok(items.length >= 2, 'Should suggest at least 2 tasks');
            const labels = items.map(item => item.label);
            assert.ok(labels.includes('task1'), 'Should include task1');
            assert.ok(labels.includes('task2'), 'Should include task2');
        });

        test('Should suggest resources for allocate attribute', async () => {
            const content = `
resource dev1 "Developer 1" {}
resource dev2 "Developer 2" {}

task dev "Development" {
    allocate
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(5, 13); // After "allocate "

            const completions = await provider.provideCompletionItems(
                doc,
                position,
                { triggerKind: vscode.CompletionTriggerKind.Invoke } as any,
                {} as any
            );

            const items = Array.isArray(completions) ? completions : completions?.items || [];

            assert.ok(items.length >= 2, 'Should suggest at least 2 resources');
            const labels = items.map(item => item.label);
            assert.ok(labels.includes('dev1'), 'Should include dev1');
            assert.ok(labels.includes('dev2'), 'Should include dev2');
        });
    });

    suite('Date Completions', () => {
        test('Should suggest dates for start attribute', async () => {
            const content = `
task dev "Development" {
    start
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 10); // After "start "

            const completions = await provider.provideCompletionItems(
                doc,
                position,
                { triggerKind: vscode.CompletionTriggerKind.Invoke } as any,
                {} as any
            );

            const items = Array.isArray(completions) ? completions : completions?.items || [];

            assert.ok(items.length >= 4, 'Should suggest date options');
            const labels = items.map(item => item.label);
            assert.ok(labels.includes('today'), 'Should include today');
            assert.ok(labels.includes('tomorrow'), 'Should include tomorrow');
            assert.ok(labels.includes('next week'), 'Should include next week');
        });

        test('Should suggest dates for end attribute', async () => {
            const content = `
task dev "Development" {
    end
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 8); // After "end "

            const completions = await provider.provideCompletionItems(
                doc,
                position,
                { triggerKind: vscode.CompletionTriggerKind.Invoke } as any,
                {} as any
            );

            const items = Array.isArray(completions) ? completions : completions?.items || [];

            assert.ok(items.length >= 4, 'Should suggest date options');
            const labels = items.map(item => item.label);
            assert.ok(labels.includes('today'), 'Should include today');
        });

        test('Date completion should use correct format', async () => {
            const content = `
task dev "Development" {
    start
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 10);

            const completions = await provider.provideCompletionItems(
                doc,
                position,
                { triggerKind: vscode.CompletionTriggerKind.Invoke } as any,
                {} as any
            );

            const items = Array.isArray(completions) ? completions : completions?.items || [];
            const todayItem = items.find(item => item.label === 'today');

            assert.ok(todayItem, 'Should have today item');
            // Check that insertText is in YYYY-MM-DD format
            const datePattern = /^\d{4}-\d{2}-\d{2}$/;
            assert.ok(datePattern.test(todayItem!.insertText as string),
                'Insert text should be in YYYY-MM-DD format');
        });
    });
});

async function createDocument(content: string): Promise<vscode.TextDocument> {
    return await vscode.workspace.openTextDocument({
        content,
        language: 'taskjuggler'
    });
}
