import * as assert from 'assert';
import * as vscode from 'vscode';
import { TaskJugglerSignatureHelpProvider } from '../../signatureHelpProvider';

suite('Signature Help Provider Test Suite', () => {
    let provider: TaskJugglerSignatureHelpProvider;

    setup(() => {
        provider = new TaskJugglerSignatureHelpProvider();
    });

    suite('Parameter Hints', () => {
        test('Should provide signature help for effort', async () => {
            const content = `
task dev "Development" {
    effort
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 11); // After "effort "

            const help = await provider.provideSignatureHelp(
                doc,
                position,
                {} as any,
                {} as any
            );

            assert.ok(help, 'Should provide signature help');
            assert.ok(help!.signatures.length > 0, 'Should have at least one signature');
            assert.ok(help!.signatures[0].label.includes('effort'), 'Signature should mention effort');
            assert.ok(help!.signatures[0].label.includes('value'), 'Signature should mention value');
        });

        test('Should provide signature help for duration', async () => {
            const content = `
task dev "Development" {
    duration
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 13);

            const help = await provider.provideSignatureHelp(
                doc,
                position,
                {} as any,
                {} as any
            );

            assert.ok(help, 'Should provide signature help');
            assert.ok(help!.signatures[0].label.includes('duration'));
        });

        test('Should provide signature help for allocate', async () => {
            const content = `
task dev "Development" {
    allocate
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 13);

            const help = await provider.provideSignatureHelp(
                doc,
                position,
                {} as any,
                {} as any
            );

            assert.ok(help, 'Should provide signature help');
            assert.ok(help!.signatures[0].label.includes('allocate'));
            assert.ok(help!.signatures[0].label.includes('resource_id'));
        });

        test('Should provide signature help for depends', async () => {
            const content = `
task dev "Development" {
    depends
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 12);

            const help = await provider.provideSignatureHelp(
                doc,
                position,
                {} as any,
                {} as any
            );

            assert.ok(help, 'Should provide signature help');
            assert.ok(help!.signatures[0].label.includes('depends'));
            assert.ok(help!.signatures[0].label.includes('task_id'));
        });

        test('Should provide signature help for start', async () => {
            const content = `
task dev "Development" {
    start
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 10);

            const help = await provider.provideSignatureHelp(
                doc,
                position,
                {} as any,
                {} as any
            );

            assert.ok(help, 'Should provide signature help');
            assert.ok(help!.signatures[0].label.includes('start'));
            assert.ok(help!.signatures[0].label.includes('date'));
        });

        test('Should provide signature help for rate', async () => {
            const content = `
resource dev "Developer" {
    rate
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 9);

            const help = await provider.provideSignatureHelp(
                doc,
                position,
                {} as any,
                {} as any
            );

            assert.ok(help, 'Should provide signature help');
            assert.ok(help!.signatures[0].label.includes('rate'));
        });

        test('Should provide signature help for limits', async () => {
            const content = `
resource dev "Developer" {
    limits
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 11);

            const help = await provider.provideSignatureHelp(
                doc,
                position,
                {} as any,
                {} as any
            );

            assert.ok(help, 'Should provide signature help');
            assert.ok(help!.signatures[0].label.includes('limits'));
        });

        test('Should provide signature help for workinghours', async () => {
            const content = `
resource dev "Developer" {
    workinghours
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 17);

            const help = await provider.provideSignatureHelp(
                doc,
                position,
                {} as any,
                {} as any
            );

            assert.ok(help, 'Should provide signature help');
            assert.ok(help!.signatures[0].label.includes('workinghours'));
        });

        test('Should return null for unknown keywords', async () => {
            const content = `
task dev "Development" {
    unknownattr
}
            `;
            const doc = await createDocument(content);
            const position = new vscode.Position(2, 16);

            const help = await provider.provideSignatureHelp(
                doc,
                position,
                {} as any,
                {} as any
            );

            assert.strictEqual(help, null, 'Should return null for unknown keywords');
        });
    });

    suite('Signature Content', () => {
        test('Effort signature should have parameters', async () => {
            const content = 'task dev "Development" {\n    effort ';
            const doc = await createDocument(content);
            const position = new vscode.Position(1, 11);

            const help = await provider.provideSignatureHelp(
                doc,
                position,
                {} as any,
                {} as any
            );

            assert.ok(help);
            const signature = help!.signatures[0];
            assert.ok(signature.parameters, 'Should have parameters');
            assert.ok(signature.parameters.length >= 2, 'Should have at least 2 parameters');
        });

        test('Signatures should have documentation', async () => {
            const content = 'task dev "Development" {\n    effort ';
            const doc = await createDocument(content);
            const position = new vscode.Position(1, 11);

            const help = await provider.provideSignatureHelp(
                doc,
                position,
                {} as any,
                {} as any
            );

            assert.ok(help);
            const signature = help!.signatures[0];
            assert.ok(signature.documentation, 'Signature should have documentation');

            // Check if documentation is MarkdownString
            const docString = typeof signature.documentation === 'string'
                ? signature.documentation
                : (signature.documentation as vscode.MarkdownString).value;

            assert.ok(docString.length > 0, 'Documentation should not be empty');
        });

        test('Parameters should have documentation', async () => {
            const content = 'task dev "Development" {\n    allocate ';
            const doc = await createDocument(content);
            const position = new vscode.Position(1, 13);

            const help = await provider.provideSignatureHelp(
                doc,
                position,
                {} as any,
                {} as any
            );

            assert.ok(help);
            const signature = help!.signatures[0];
            assert.ok(signature.parameters.length > 0);

            const param = signature.parameters[0];
            assert.ok(param.documentation, 'Parameter should have documentation');
        });
    });
});

async function createDocument(content: string): Promise<vscode.TextDocument> {
    return await vscode.workspace.openTextDocument({
        content,
        language: 'taskjuggler'
    });
}
