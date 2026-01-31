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
     * Insert interactive allocate snippet
     */
    public async insertAllocate(editor: vscode.TextEditor): Promise<void> {
        const resourceId = await vscode.window.showInputBox({
            prompt: 'Resource ID to allocate',
            placeHolder: 'john',
            validateInput: (value) => {
                if (!value || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
                    return 'Resource ID must be valid';
                }
                return null;
            }
        });
        if (!resourceId) return;

        const allocationType = await vscode.window.showQuickPick(
            [
                { label: 'Full allocation (100%)', value: 'full' },
                { label: 'Partial allocation (%)', value: 'percent' },
                { label: 'Specific effort', value: 'effort' }
            ],
            { placeHolder: 'Select allocation type' }
        );
        if (!allocationType) return;

        const snippet = new vscode.SnippetString();

        if (allocationType.value === 'full') {
            snippet.appendText(`allocate ${resourceId}`);
        } else if (allocationType.value === 'percent') {
            const percent = await vscode.window.showInputBox({
                prompt: 'Allocation percentage',
                placeHolder: '50',
                validateInput: (value) => {
                    const num = parseInt(value);
                    if (isNaN(num) || num < 1 || num > 100) {
                        return 'Percentage must be 1-100';
                    }
                    return null;
                }
            });
            if (!percent) return;
            snippet.appendText(`allocate ${resourceId} { limits { dailymax ${percent}% } }`);
        } else if (allocationType.value === 'effort') {
            const effortValue = await vscode.window.showInputBox({
                prompt: 'Effort',
                placeHolder: '2'
            });
            if (!effortValue) return;

            const effortUnit = await vscode.window.showQuickPick(
                ['hours', 'days', 'weeks'],
                { placeHolder: 'Select effort unit' }
            );
            if (!effortUnit) return;

            const unitMap: Record<string, string> = {
                'hours': 'h',
                'days': 'd',
                'weeks': 'w'
            };

            snippet.appendText(`allocate ${resourceId} { alternative ${effortValue}${unitMap[effortUnit]} }`);
        }

        await editor.insertSnippet(snippet);
    }

    /**
     * Insert interactive dependencies snippet
     */
    public async insertDependencies(editor: vscode.TextEditor): Promise<void> {
        const taskId = await vscode.window.showInputBox({
            prompt: 'Task ID that this depends on',
            placeHolder: 'design',
            validateInput: (value) => {
                if (!value || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
                    return 'Task ID must be valid';
                }
                return null;
            }
        });
        if (!taskId) return;

        const dependencyType = await vscode.window.showQuickPick(
            [
                { label: 'Standard dependency (gapduration 0)', value: 'standard' },
                { label: 'With gap duration', value: 'gap' },
                { label: 'With end-to-start constraint', value: 'constraint' }
            ],
            { placeHolder: 'Select dependency type' }
        );
        if (!dependencyType) return;

        const snippet = new vscode.SnippetString();

        if (dependencyType.value === 'standard') {
            snippet.appendText(`depends ${taskId}`);
        } else if (dependencyType.value === 'gap') {
            const gapValue = await vscode.window.showInputBox({
                prompt: 'Gap duration',
                placeHolder: '2'
            });
            if (!gapValue) return;

            const gapUnit = await vscode.window.showQuickPick(
                ['days', 'weeks', 'hours'],
                { placeHolder: 'Select gap unit' }
            );
            if (!gapUnit) return;

            const unitMap: Record<string, string> = {
                'days': 'd',
                'weeks': 'w',
                'hours': 'h'
            };

            snippet.appendText(`depends ${taskId} { gapduration ${gapValue}${unitMap[gapUnit]} }`);
        } else if (dependencyType.value === 'constraint') {
            const constraintType = await vscode.window.showQuickPick(
                ['end-to-start (default)', 'start-to-start', 'end-to-end', 'start-to-end'],
                { placeHolder: 'Select constraint type' }
            );
            if (!constraintType) return;

            const typeMap: Record<string, string> = {
                'end-to-start (default)': 'onend',
                'start-to-start': 'onstart',
                'end-to-end': 'onend',
                'start-to-end': 'onstart'
            };

            snippet.appendText(`depends !${taskId}`);
        }

        await editor.insertSnippet(snippet);
    }

    /**
     * Insert interactive vacation snippet
     */
    public async insertVacation(editor: vscode.TextEditor): Promise<void> {
        const startDate = await vscode.window.showInputBox({
            prompt: 'Vacation start date (YYYY-MM-DD)',
            value: this.getTodayDate(),
            validateInput: (value) => {
                if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                    return 'Date must be in YYYY-MM-DD format';
                }
                return null;
            }
        });
        if (!startDate) return;

        const durationType = await vscode.window.showQuickPick(
            [
                { label: 'Specify end date', value: 'date' },
                { label: 'Specify duration', value: 'duration' }
            ],
            { placeHolder: 'How to define vacation period?' }
        );
        if (!durationType) return;

        const snippet = new vscode.SnippetString();

        if (durationType.value === 'date') {
            const endDate = await vscode.window.showInputBox({
                prompt: 'Vacation end date (YYYY-MM-DD)',
                value: this.addDays(startDate, 7),
                validateInput: (value) => {
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
                        return 'Date must be in YYYY-MM-DD format';
                    }
                    return null;
                }
            });
            if (!endDate) return;

            snippet.appendText(`vacation ${startDate} - ${endDate}`);
        } else {
            const durationValue = await vscode.window.showInputBox({
                prompt: 'Vacation duration',
                placeHolder: '7'
            });
            if (!durationValue) return;

            const durationUnit = await vscode.window.showQuickPick(
                ['days', 'weeks'],
                { placeHolder: 'Select duration unit' }
            );
            if (!durationUnit) return;

            const unitMap: Record<string, string> = {
                'days': 'd',
                'weeks': 'w'
            };

            snippet.appendText(`vacation ${startDate} +${durationValue}${unitMap[durationUnit]}`);
        }

        await editor.insertSnippet(snippet);
    }

    /**
     * Insert interactive shift definition snippet
     */
    public async insertShift(editor: vscode.TextEditor): Promise<void> {
        const id = await vscode.window.showInputBox({
            prompt: 'Shift ID',
            placeHolder: 'morning_shift',
            validateInput: (value) => {
                if (!value || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(value)) {
                    return 'ID must start with letter/underscore';
                }
                return null;
            }
        });
        if (!id) return;

        const name = await vscode.window.showInputBox({
            prompt: 'Shift Name',
            placeHolder: 'Morning Shift'
        });
        if (!name) return;

        const shiftType = await vscode.window.showQuickPick(
            [
                { label: 'Standard workweek (Mon-Fri 9-18)', value: 'standard' },
                { label: 'Custom hours', value: 'custom' },
                { label: 'Shifts (morning/afternoon/night)', value: 'shifts' }
            ],
            { placeHolder: 'Select shift type' }
        );
        if (!shiftType) return;

        const snippet = new vscode.SnippetString();
        snippet.appendText(`shift ${id} "${name}" {\n`);

        if (shiftType.value === 'standard') {
            snippet.appendText('\tworkinghours mon - fri 09:00 - 12:00, 13:00 - 18:00\n');
            snippet.appendText('\tworkinghours sat, sun off\n');
        } else if (shiftType.value === 'custom') {
            const startTime = await vscode.window.showInputBox({
                prompt: 'Start time (HH:MM)',
                placeHolder: '08:00',
                validateInput: (value) => {
                    if (!/^\d{2}:\d{2}$/.test(value)) {
                        return 'Time must be in HH:MM format';
                    }
                    return null;
                }
            });
            if (!startTime) return;

            const endTime = await vscode.window.showInputBox({
                prompt: 'End time (HH:MM)',
                placeHolder: '17:00',
                validateInput: (value) => {
                    if (!/^\d{2}:\d{2}$/.test(value)) {
                        return 'Time must be in HH:MM format';
                    }
                    return null;
                }
            });
            if (!endTime) return;

            const days = await vscode.window.showQuickPick(
                ['mon - fri', 'mon - sat', 'mon - sun', 'Custom'],
                { placeHolder: 'Working days' }
            );
            if (!days) return;

            if (days === 'Custom') {
                snippet.appendText('\tworkinghours ${1:mon, tue, wed} ${2:' + startTime + ' - ' + endTime + '}\n');
            } else {
                snippet.appendText(`\tworkinghours ${days} ${startTime} - ${endTime}\n`);
                if (days !== 'mon - sun') {
                    snippet.appendText('\tworkinghours sat, sun off\n');
                }
            }
        } else if (shiftType.value === 'shifts') {
            const shiftPeriod = await vscode.window.showQuickPick(
                ['Morning (06:00-14:00)', 'Afternoon (14:00-22:00)', 'Night (22:00-06:00)'],
                { placeHolder: 'Select shift period' }
            );

            const periodMap: Record<string, string> = {
                'Morning (06:00-14:00)': '06:00 - 14:00',
                'Afternoon (14:00-22:00)': '14:00 - 22:00',
                'Night (22:00-06:00)': '22:00 - 06:00'
            };

            if (shiftPeriod) {
                snippet.appendText(`\tworkinghours mon - sun ${periodMap[shiftPeriod]}\n`);
            }
        }

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

    /**
     * Add days to a date string
     */
    private addDays(dateStr: string, days: number): string {
        const date = new Date(dateStr);
        date.setDate(date.getDate() + days);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}
