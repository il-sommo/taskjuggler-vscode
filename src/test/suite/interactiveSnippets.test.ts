import * as assert from 'assert';
import * as vscode from 'vscode';
import { InteractiveSnippets } from '../../interactiveSnippets';

suite('Interactive Snippets Test Suite', () => {

    let interactiveSnippets: InteractiveSnippets;

    setup(() => {
        interactiveSnippets = new InteractiveSnippets();
    });

    test('InteractiveSnippets class should be instantiable', () => {
        assert.ok(interactiveSnippets);
        assert.strictEqual(typeof interactiveSnippets, 'object');
    });

    test('Should have insertProject method', () => {
        assert.ok(interactiveSnippets.insertProject);
        assert.strictEqual(typeof interactiveSnippets.insertProject, 'function');
    });

    test('Should have insertTask method', () => {
        assert.ok(interactiveSnippets.insertTask);
        assert.strictEqual(typeof interactiveSnippets.insertTask, 'function');
    });

    test('Should have insertResource method', () => {
        assert.ok(interactiveSnippets.insertResource);
        assert.strictEqual(typeof interactiveSnippets.insertResource, 'function');
    });

    test('Should have insertReport method', () => {
        assert.ok(interactiveSnippets.insertReport);
        assert.strictEqual(typeof interactiveSnippets.insertReport, 'function');
    });

    test('Should have insertAllocate method', () => {
        assert.ok(interactiveSnippets.insertAllocate);
        assert.strictEqual(typeof interactiveSnippets.insertAllocate, 'function');
    });

    test('Should have insertDependencies method', () => {
        assert.ok(interactiveSnippets.insertDependencies);
        assert.strictEqual(typeof interactiveSnippets.insertDependencies, 'function');
    });

    test('Should have insertVacation method', () => {
        assert.ok(interactiveSnippets.insertVacation);
        assert.strictEqual(typeof interactiveSnippets.insertVacation, 'function');
    });

    test('Should have insertShift method', () => {
        assert.ok(interactiveSnippets.insertShift);
        assert.strictEqual(typeof interactiveSnippets.insertShift, 'function');
    });

    test('Commands should be registered', async () => {
        const commands = await vscode.commands.getCommands(true);

        assert.ok(commands.includes('taskjuggler.insertProject'),
            'insertProject command should be registered');
        assert.ok(commands.includes('taskjuggler.insertTask'),
            'insertTask command should be registered');
        assert.ok(commands.includes('taskjuggler.insertResource'),
            'insertResource command should be registered');
        assert.ok(commands.includes('taskjuggler.insertReport'),
            'insertReport command should be registered');
        assert.ok(commands.includes('taskjuggler.insertAllocate'),
            'insertAllocate command should be registered');
        assert.ok(commands.includes('taskjuggler.insertDependencies'),
            'insertDependencies command should be registered');
        assert.ok(commands.includes('taskjuggler.insertVacation'),
            'insertVacation command should be registered');
        assert.ok(commands.includes('taskjuggler.insertShift'),
            'insertShift command should be registered');
    });

    test('All 8 interactive snippet commands should be available', async () => {
        const commands = await vscode.commands.getCommands(true);
        const taskjugglerCommands = commands.filter(cmd => cmd.startsWith('taskjuggler.insert'));

        // Should have at least 8 insert commands
        assert.ok(taskjugglerCommands.length >= 8,
            `Expected at least 8 insert commands, found ${taskjugglerCommands.length}`);
    });

    test('getTodayDate helper should return current date in YYYY-MM-DD format', () => {
        // Access private method through any type assertion for testing
        const snippets: any = interactiveSnippets;
        const today = snippets.getTodayDate();

        // Should match YYYY-MM-DD format
        assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(today),
            `Date should be in YYYY-MM-DD format, got: ${today}`);

        // Should be today's date
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const expected = `${year}-${month}-${day}`;

        assert.strictEqual(today, expected);
    });

    test('addDays helper should add days correctly', () => {
        const snippets: any = interactiveSnippets;

        // Add 7 days to 2026-01-31
        const result = snippets.addDays('2026-01-31', 7);
        assert.strictEqual(result, '2026-02-07');

        // Add 1 day to 2026-01-31 (month boundary)
        const result2 = snippets.addDays('2026-01-31', 1);
        assert.strictEqual(result2, '2026-02-01');

        // Add 0 days
        const result3 = snippets.addDays('2026-01-15', 0);
        assert.strictEqual(result3, '2026-01-15');

        // Add negative days (subtract)
        const result4 = snippets.addDays('2026-02-01', -1);
        assert.strictEqual(result4, '2026-01-31');
    });

    test('addDays helper should handle year boundaries', () => {
        const snippets: any = interactiveSnippets;

        // Add 1 day to December 31
        const result = snippets.addDays('2025-12-31', 1);
        assert.strictEqual(result, '2026-01-01');

        // Add 365 days
        const result2 = snippets.addDays('2026-01-01', 365);
        assert.strictEqual(result2, '2027-01-01');
    });

    test('addDays helper should return YYYY-MM-DD format', () => {
        const snippets: any = interactiveSnippets;

        const result = snippets.addDays('2026-01-15', 10);
        assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(result),
            `Result should be in YYYY-MM-DD format, got: ${result}`);
    });
});
