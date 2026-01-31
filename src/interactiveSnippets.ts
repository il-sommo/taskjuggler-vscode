import * as vscode from 'vscode';

/**
 * Interactive snippet system - prompts user for each field
 */
export class InteractiveSnippets {

    /**
     * Insert interactive project snippet
     */
    public async insertProject(editor: vscode.TextEditor): Promise<void> {
        // Collect inputs
        const id = await vscode.window.showInputBox({
            prompt: 'Project ID',
            placeHolder: 'my_project',
            validateInput: (value) => {
                if (!value || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
                    return 'ID must start with letter/underscore and contain only alphanumeric/underscore';
                }
                return null;
            }
        });
        if (!id) return;

        const name = await vscode.window.showInputBox({
            prompt: 'Project Name',
            placeHolder: 'My Project'
        });
        if (!name) return;

        const startDate = await vscode.window.showInputBox({
            prompt: 'Start Date (YYYY-MM-DD)',
            value: this.getTodayDate(),
            validateInput: (value) => {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    return 'Date must be in YYYY-MM-DD format';
                }
                return null;
            }
        });
        if (!startDate) return;

        const durationValue = await vscode.window.showInputBox({
            prompt: 'Project Duration',
            placeHolder: '6',
            value: '6'
        });
        if (!durationValue) return;

        const durationUnit = await vscode.window.showQuickPick(
            ['months', 'weeks', 'days', 'years'],
            { placeHolder: 'Select duration unit' }
        );
        if (!durationUnit) return;

        const unitMap: Record<string, string> = {
            'months': 'm',
            'weeks': 'w',
            'days': 'd',
            'years': 'y'
        };

        // Build snippet
        const snippet = new vscode.SnippetString();
        snippet.appendText(`project ${id} "${name}" ${startDate} +${durationValue}${unitMap[durationUnit]} {\n`);
        snippet.appendText('\ttimezone "UTC"\n');
        snippet.appendText('\tcurrency "USD"\n');
        snippet.appendText('\t\n');
        snippet.appendText('\t${1}\n');
        snippet.appendText('}\n');

        await editor.insertSnippet(snippet);
    }

    /**
     * Insert interactive task snippet
     */
    public async insertTask(editor: vscode.TextEditor): Promise<void> {
        const id = await vscode.window.showInputBox({
            prompt: 'Task ID',
            placeHolder: 'my_task',
            validateInput: (value) => {
                if (!value || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
                    return 'ID must start with letter/underscore';
                }
                return null;
            }
        });
        if (!id) return;

        const name = await vscode.window.showInputBox({
            prompt: 'Task Name',
            placeHolder: 'My Task'
        });
        if (!name) return;

        const taskType = await vscode.window.showQuickPick(
            [
                { label: 'Task with effort', value: 'effort' },
                { label: 'Task with duration', value: 'duration' },
                { label: 'Milestone', value: 'milestone' }
            ],
            { placeHolder: 'Select task type' }
        );
        if (!taskType) return;

        const snippet = new vscode.SnippetString();
        snippet.appendText(`task ${id} "${name}" {\n`);

        if (taskType.value === 'milestone') {
            snippet.appendText('\tmilestone\n');
            const startDate = await vscode.window.showInputBox({
                prompt: 'Milestone Date (YYYY-MM-DD)',
                value: this.getTodayDate()
            });
            if (startDate) {
                snippet.appendText(`\tstart ${startDate}\n`);
            }
        } else if (taskType.value === 'effort') {
            const effortValue = await vscode.window.showInputBox({
                prompt: 'Effort',
                placeHolder: '5'
            });
            if (!effortValue) return;

            const effortUnit = await vscode.window.showQuickPick(
                ['days', 'weeks', 'hours', 'months'],
                { placeHolder: 'Select effort unit' }
            );
            if (!effortUnit) return;

            const unitMap: Record<string, string> = {
                'days': 'd',
                'weeks': 'w',
                'hours': 'h',
                'months': 'm'
            };

            snippet.appendText(`\teffort ${effortValue}${unitMap[effortUnit]}\n`);
        } else if (taskType.value === 'duration') {
            const durationValue = await vscode.window.showInputBox({
                prompt: 'Duration',
                placeHolder: '5'
            });
            if (!durationValue) return;

            const durationUnit = await vscode.window.showQuickPick(
                ['days', 'weeks', 'hours', 'months'],
                { placeHolder: 'Select duration unit' }
            );
            if (!durationUnit) return;

            const unitMap: Record<string, string> = {
                'days': 'd',
                'weeks': 'w',
                'hours': 'h',
                'months': 'm'
            };

            snippet.appendText(`\tduration ${durationValue}${unitMap[durationUnit]}\n`);
        }

        snippet.appendText('\t${1}\n');
        snippet.appendText('}\n');

        await editor.insertSnippet(snippet);
    }

    /**
     * Insert interactive resource snippet
     */
    public async insertResource(editor: vscode.TextEditor): Promise<void> {
        const id = await vscode.window.showInputBox({
            prompt: 'Resource ID',
            placeHolder: 'john',
            validateInput: (value) => {
                if (!value || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
                    return 'ID must start with letter/underscore';
                }
                return null;
            }
        });
        if (!id) return;

        const name = await vscode.window.showInputBox({
            prompt: 'Resource Name',
            placeHolder: 'John Doe'
        });
        if (!name) return;

        const addEmail = await vscode.window.showQuickPick(
            ['Yes', 'No'],
            { placeHolder: 'Add email address?' }
        );

        const addRate = await vscode.window.showQuickPick(
            ['Yes', 'No'],
            { placeHolder: 'Add hourly rate?' }
        );

        const snippet = new vscode.SnippetString();
        snippet.appendText(`resource ${id} "${name}" {\n`);

        if (addEmail === 'Yes') {
            const email = await vscode.window.showInputBox({
                prompt: 'Email',
                placeHolder: 'john@example.com'
            });
            if (email) {
                snippet.appendText(`\temail "${email}"\n`);
            }
        }

        if (addRate === 'Yes') {
            const rate = await vscode.window.showInputBox({
                prompt: 'Hourly Rate',
                placeHolder: '100'
            });
            if (rate) {
                snippet.appendText(`\trate ${rate}\n`);
            }
        }

        snippet.appendText('\t${1}\n');
        snippet.appendText('}\n');

        await editor.insertSnippet(snippet);
    }

    /**
     * Insert interactive report snippet
     */
    public async insertReport(editor: vscode.TextEditor): Promise<void> {
        const reportType = await vscode.window.showQuickPick(
            [
                { label: 'Task Report', value: 'taskreport' },
                { label: 'Resource Report', value: 'resourcereport' },
                { label: 'Text Report', value: 'textreport' }
            ],
            { placeHolder: 'Select report type' }
        );
        if (!reportType) return;

        const id = await vscode.window.showInputBox({
            prompt: 'Report ID',
            placeHolder: 'overview'
        });
        if (!id) return;

        const title = await vscode.window.showInputBox({
            prompt: 'Report Title',
            placeHolder: 'Project Overview'
        });
        if (!title) return;

        const formats = await vscode.window.showQuickPick(
            [
                { label: 'HTML only', value: 'html' },
                { label: 'HTML and CSV', value: 'html, csv' },
                { label: 'HTML, CSV, and XML', value: 'html, csv, xml' }
            ],
            { placeHolder: 'Select output formats' }
        );
        if (!formats) return;

        const snippet = new vscode.SnippetString();
        snippet.appendText(`${reportType.value} ${id} "${title}" {\n`);
        snippet.appendText(`\tformats ${formats.value}\n`);
        snippet.appendText('\t${1}\n');
        snippet.appendText('}\n');

        await editor.insertSnippet(snippet);
    }

    /**
     * Get today's date in YYYY-MM-DD format
     */
    private getTodayDate(): string {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
