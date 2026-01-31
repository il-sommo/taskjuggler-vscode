import * as vscode from 'vscode';

interface SignatureInfo {
    label: string;
    parameters: { label: string; documentation: string }[];
    documentation: string;
}

const signatures: Record<string, SignatureInfo> = {
    'effort': {
        label: 'effort <value>[h|d|w|m|y]',
        parameters: [
            { label: 'value', documentation: 'Numeric value representing work amount' },
            { label: 'unit', documentation: 'Time unit: h=hours, d=days, w=weeks, m=months, y=years (default: d)' }
        ],
        documentation: 'Specifies the effort required to complete a task'
    },
    'duration': {
        label: 'duration <value>[h|d|w|m|y]',
        parameters: [
            { label: 'value', documentation: 'Numeric value representing calendar time' },
            { label: 'unit', documentation: 'Time unit: h=hours, d=days, w=weeks, m=months, y=years (default: d)' }
        ],
        documentation: 'Specifies the calendar duration of a task'
    },
    'length': {
        label: 'length <value>[h|d|w|m|y]',
        parameters: [
            { label: 'value', documentation: 'Numeric value representing working time' },
            { label: 'unit', documentation: 'Time unit: h=hours, d=days, w=weeks, m=months, y=years (default: d)' }
        ],
        documentation: 'Specifies the working time length of a task'
    },
    'allocate': {
        label: 'allocate <resource_id> [{ <attributes> }]',
        parameters: [
            { label: 'resource_id', documentation: 'ID of the resource to allocate' },
            { label: 'attributes', documentation: 'Optional allocation attributes (alternative, limits, etc.)' }
        ],
        documentation: 'Allocates one or more resources to a task'
    },
    'depends': {
        label: 'depends !<task_id> [{ <attributes> }]',
        parameters: [
            { label: 'task_id', documentation: 'ID of the task that must be completed first (use ! prefix)' },
            { label: 'attributes', documentation: 'Optional dependency attributes (gapduration, gaplength, etc.)' }
        ],
        documentation: 'Creates a dependency on another task'
    },
    'limits': {
        label: 'limits { <attribute> <min> - <max> }',
        parameters: [
            { label: 'attribute', documentation: 'Attribute to limit (dailymax, weeklymax, etc.)' },
            { label: 'min', documentation: 'Minimum value' },
            { label: 'max', documentation: 'Maximum value' }
        ],
        documentation: 'Sets resource allocation or task scheduling limits'
    },
    'start': {
        label: 'start <date>',
        parameters: [
            { label: 'date', documentation: 'Date in YYYY-MM-DD format or relative (e.g., ${now})' }
        ],
        documentation: 'Specifies the start date of a task or project'
    },
    'end': {
        label: 'end <date>',
        parameters: [
            { label: 'date', documentation: 'Date in YYYY-MM-DD format or relative' }
        ],
        documentation: 'Specifies the end date of a task or project'
    },
    'complete': {
        label: 'complete <percentage>',
        parameters: [
            { label: 'percentage', documentation: 'Completion percentage (0-100)' }
        ],
        documentation: 'Specifies the completion percentage of a task'
    },
    'priority': {
        label: 'priority <value>',
        parameters: [
            { label: 'value', documentation: 'Priority value (0-1000, default: 500)' }
        ],
        documentation: 'Sets the scheduling priority of a task'
    },
    'rate': {
        label: 'rate <value> [<currency>]',
        parameters: [
            { label: 'value', documentation: 'Hourly rate as a numeric value' },
            { label: 'currency', documentation: 'Optional currency code (default: project currency)' }
        ],
        documentation: 'Specifies the hourly rate for a resource'
    },
    'workinghours': {
        label: 'workinghours <weekday> <start>-<end>',
        parameters: [
            { label: 'weekday', documentation: 'Day of week (mon, tue, wed, thu, fri, sat, sun) or range' },
            { label: 'start', documentation: 'Start time in HH:MM format' },
            { label: 'end', documentation: 'End time in HH:MM format' }
        ],
        documentation: 'Defines working hours for a specific day or range'
    },
    'efficiency': {
        label: 'efficiency <value>',
        parameters: [
            { label: 'value', documentation: 'Efficiency factor (0.0-n, default: 1.0)' }
        ],
        documentation: 'Sets the efficiency multiplier for a resource'
    },
    'charge': {
        label: 'charge <amount> [<account_id>]',
        parameters: [
            { label: 'amount', documentation: 'Amount to charge (flat rate or percentage)' },
            { label: 'account_id', documentation: 'Optional target account ID' }
        ],
        documentation: 'Assigns a charge to an account'
    }
};

export class TaskJugglerSignatureHelpProvider implements vscode.SignatureHelpProvider {
    public provideSignatureHelp(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken,
        context: vscode.SignatureHelpContext
    ): vscode.ProviderResult<vscode.SignatureHelp> {
        const line = document.lineAt(position).text;
        const linePrefix = line.substring(0, position.character);

        // Extract the keyword at the start of the line
        const keyword = this.extractKeyword(linePrefix);

        if (keyword && signatures[keyword]) {
            return this.buildSignatureHelp(signatures[keyword]);
        }

        return null;
    }

    private extractKeyword(linePrefix: string): string | null {
        // Match the first word on the line (after whitespace)
        const match = linePrefix.trim().match(/^([a-zA-Z_][a-zA-Z0-9_]*)/);
        return match ? match[1] : null;
    }

    private buildSignatureHelp(signatureInfo: SignatureInfo): vscode.SignatureHelp {
        const signature = new vscode.SignatureInformation(
            signatureInfo.label,
            new vscode.MarkdownString(signatureInfo.documentation)
        );

        signature.parameters = signatureInfo.parameters.map(param =>
            new vscode.ParameterInformation(
                param.label,
                new vscode.MarkdownString(param.documentation)
            )
        );

        const result = new vscode.SignatureHelp();
        result.signatures = [signature];
        result.activeSignature = 0;
        result.activeParameter = 0;

        return result;
    }
}
