import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

suite('Integration Test Suite', () => {
    suite('Extension Activation', () => {
        test('Extension should be present', () => {
            const extension = vscode.extensions.getExtension('fabrizio-vacca.taskjuggler-syntax');
            assert.ok(extension, 'Extension should be installed');
        });

        test('Extension should activate', async () => {
            const extension = vscode.extensions.getExtension('fabrizio-vacca.taskjuggler-syntax');
            if (extension && !extension.isActive) {
                await extension.activate();
            }
            assert.ok(extension?.isActive, 'Extension should be active');
        });
    });

    suite('Language Features', () => {
        test('Should provide completions for TaskJuggler files', async () => {
            const doc = await vscode.workspace.openTextDocument({
                content: 'task dev "Development" {\n    \n}',
                language: 'taskjuggler'
            });

            const editor = await vscode.window.showTextDocument(doc);
            const position = new vscode.Position(1, 4);

            const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
                'vscode.executeCompletionItemProvider',
                doc.uri,
                position
            );

            assert.ok(completions, 'Should provide completions');
            assert.ok(completions.items.length > 0, 'Should have completion items');
        });

        test.skip('Should provide hover information (unstable in CI)', async () => {
            const doc = await vscode.workspace.openTextDocument({
                content: 'task dev "Development" {\n    effort 5d\n}',
                language: 'taskjuggler'
            });

            const position = new vscode.Position(1, 6); // On "effort"

            const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
                'vscode.executeHoverProvider',
                doc.uri,
                position
            );

            assert.ok(hovers, 'Should provide hover information');
            assert.ok(hovers.length > 0, 'Should have hover items');
        });

        test.skip('Should provide definition for task references (unstable in CI)', async () => {
            const doc = await vscode.workspace.openTextDocument({
                content: `
task spec "Specification" {}
task dev "Development" {
    depends !spec
}
                `,
                language: 'taskjuggler'
            });

            const position = new vscode.Position(3, 14); // On "spec" in depends

            const definitions = await vscode.commands.executeCommand<vscode.Location[]>(
                'vscode.executeDefinitionProvider',
                doc.uri,
                position
            );

            assert.ok(definitions, 'Should provide definitions');
            assert.ok(definitions.length > 0, 'Should find definition');
        });

        test.skip('Should provide signature help (unstable in CI)', async () => {
            const doc = await vscode.workspace.openTextDocument({
                content: 'task dev "Development" {\n    effort \n}',
                language: 'taskjuggler'
            });

            const position = new vscode.Position(1, 11); // After "effort "

            const signatureHelp = await vscode.commands.executeCommand<vscode.SignatureHelp>(
                'vscode.executeSignatureHelpProvider',
                doc.uri,
                position,
                ' '
            );

            assert.ok(signatureHelp, 'Should provide signature help');
            assert.ok(signatureHelp.signatures.length > 0, 'Should have signatures');
        });
    });

    suite('Real File Testing', () => {
        test('Should parse sample.tjp fixture', async () => {
            const fixturePath = path.join(__dirname, '..', 'fixtures', 'sample.tjp');
            const doc = await vscode.workspace.openTextDocument(fixturePath);

            assert.strictEqual(doc.languageId, 'taskjuggler', 'File should be recognized as TaskJuggler');

            // Test completions work in real file
            const position = new vscode.Position(5, 0); // Inside resource block

            const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
                'vscode.executeCompletionItemProvider',
                doc.uri,
                position
            );

            assert.ok(completions, 'Should provide completions in real file');
        });
    });

    suite('Context-Aware Behavior', () => {
        test.skip('Should show different completions in different contexts (unstable in CI)', async () => {
            const doc = await vscode.workspace.openTextDocument({
                content: `
task dev "Development" {

}

resource john "John" {

}
                `,
                language: 'taskjuggler'
            });

            // Get completions inside task block
            const taskPosition = new vscode.Position(2, 4);
            const taskCompletions = await vscode.commands.executeCommand<vscode.CompletionList>(
                'vscode.executeCompletionItemProvider',
                doc.uri,
                taskPosition
            );

            // Get completions inside resource block
            const resourcePosition = new vscode.Position(6, 4);
            const resourceCompletions = await vscode.commands.executeCommand<vscode.CompletionList>(
                'vscode.executeCompletionItemProvider',
                doc.uri,
                resourcePosition
            );

            // Compare - they should be different
            const taskLabels = taskCompletions.items.map(i => i.label).sort();
            const resourceLabels = resourceCompletions.items.map(i => i.label).sort();

            // Task completions should include effort, resource should not
            const taskHasEffort = taskLabels.includes('effort');
            const resourceHasEffort = resourceLabels.includes('effort');

            assert.ok(taskHasEffort, 'Task block should have effort');
            assert.ok(!resourceHasEffort, 'Resource block should not have effort');

            // Resource completions should include rate, task should not
            const taskHasRate = taskLabels.includes('rate');
            const resourceHasRate = resourceLabels.includes('rate');

            assert.ok(!taskHasRate, 'Task block should not have rate');
            assert.ok(resourceHasRate, 'Resource block should have rate');
        });
    });

    suite('Date Completion Integration', () => {
        test.skip('Should provide date completions in real scenarios (unstable in CI)', async () => {
            const doc = await vscode.workspace.openTextDocument({
                content: `
task dev "Development" {
    start
}
                `,
                language: 'taskjuggler'
            });

            const position = new vscode.Position(2, 10); // After "start "

            const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
                'vscode.executeCompletionItemProvider',
                doc.uri,
                position
            );

            assert.ok(completions, 'Should provide completions');

            const labels = completions.items.map(i => i.label);
            assert.ok(labels.includes('today'), 'Should include today');
            assert.ok(labels.includes('tomorrow'), 'Should include tomorrow');
        });
    });

    suite('Reference Completion Integration', () => {
        test('Should complete task references in depends', async () => {
            const doc = await vscode.workspace.openTextDocument({
                content: `
task spec "Specification" {}
task design "Design" {}

task dev "Development" {
    depends
}
                `,
                language: 'taskjuggler'
            });

            const position = new vscode.Position(5, 12); // After "depends "

            const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
                'vscode.executeCompletionItemProvider',
                doc.uri,
                position
            );

            assert.ok(completions, 'Should provide completions');

            const labels = completions.items.map(i => i.label);
            assert.ok(labels.includes('spec'), 'Should include spec task');
            assert.ok(labels.includes('design'), 'Should include design task');
        });

        test('Should complete resource references in allocate', async () => {
            const doc = await vscode.workspace.openTextDocument({
                content: `
resource dev1 "Developer 1" {}
resource dev2 "Developer 2" {}

task dev "Development" {
    allocate
}
                `,
                language: 'taskjuggler'
            });

            const position = new vscode.Position(5, 13); // After "allocate "

            const completions = await vscode.commands.executeCommand<vscode.CompletionList>(
                'vscode.executeCompletionItemProvider',
                doc.uri,
                position
            );

            assert.ok(completions, 'Should provide completions');

            const labels = completions.items.map(i => i.label);
            assert.ok(labels.includes('dev1'), 'Should include dev1 resource');
            assert.ok(labels.includes('dev2'), 'Should include dev2 resource');
        });
    });
});
