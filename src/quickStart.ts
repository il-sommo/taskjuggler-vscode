import * as vscode from 'vscode';

const projectTemplate = `project \${1:project_id} "\${2:Project Name}" \${3:$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE} +\${4:6m} {
	timezone "UTC"
	currency "USD"

	\${5:# Define resources
	resource dev1 "Developer 1" {
		rate 500.0
	\}

	# Define tasks
	task project "Project Tasks" {
		task planning "Planning Phase" {
			effort 5d
			allocate dev1
		\}

		task implementation "Implementation Phase" {
			depends !planning
			effort 20d
			allocate dev1
		\}
	\}

	# Generate report
	taskreport overview "" {
		formats html
		columns name, start, end, effort, chart
		loadunit days
		hideresource 0
	\}}
}
`;

const simpleTaskTemplate = `task \${1:task_id} "\${2:Task Name}" {
	\${3:effort 5d}
	\${4:# allocate resource_id}
	\${0}
}
`;

export async function showQuickStart(document: vscode.TextDocument): Promise<void> {
    // Only show for completely empty files
    if (document.getText().trim() !== '') {
        return;
    }

    const action = await vscode.window.showInformationMessage(
        'Start a new TaskJuggler project?',
        'Full Project Template',
        'Simple Task',
        'Dismiss'
    );

    if (!action || action === 'Dismiss') {
        return;
    }

    const editor = await vscode.window.showTextDocument(document);

    if (action === 'Full Project Template') {
        await editor.insertSnippet(new vscode.SnippetString(projectTemplate));
    } else if (action === 'Simple Task') {
        await editor.insertSnippet(new vscode.SnippetString(simpleTaskTemplate));
    }
}

export function registerQuickStart(context: vscode.ExtensionContext): void {
    // Listen for document opens
    context.subscriptions.push(
        vscode.workspace.onDidOpenTextDocument(async (doc) => {
            if (doc.languageId === 'taskjuggler') {
                await showQuickStart(doc);
            }
        })
    );

    // Also check active document on activation
    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor && activeEditor.document.languageId === 'taskjuggler') {
        showQuickStart(activeEditor.document);
    }
}
