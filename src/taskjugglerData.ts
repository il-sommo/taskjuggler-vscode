/**
 * TaskJuggler keyword documentation and metadata
 */

import * as vscode from 'vscode';

export interface KeywordInfo {
    name: string;
    description: string;
    syntax?: string;
    example?: string;
    category: 'property' | 'attribute' | 'function' | 'report';
}

export const taskjugglerKeywords: Record<string, KeywordInfo> = {
    // Properties
    'project': {
        name: 'project',
        category: 'property',
        description: 'Defines the root element of a project. All other properties are defined within the project scope.',
        syntax: 'project <id> "<name>" <start_date> <duration|end_date> { ... }',
        example: 'project acme "ACME Project" 2024-01-01 +6m {\n  timezone "UTC"\n}'
    },
    'task': {
        name: 'task',
        category: 'property',
        description: 'Defines a task in the project. Tasks can be nested to create a work breakdown structure.',
        syntax: 'task <id> "<name>" { ... }',
        example: 'task development "Development Phase" {\n  effort 40d\n  allocate dev1\n}'
    },
    'resource': {
        name: 'resource',
        category: 'property',
        description: 'Defines a resource that can be allocated to tasks. Resources can be people, equipment, or any limited capacity.',
        syntax: 'resource <id> "<name>" { ... }',
        example: 'resource dev1 "John Doe" {\n  rate 500.0\n  email "john@example.com"\n}'
    },
    'macro': {
        name: 'macro',
        category: 'property',
        description: 'Defines a reusable text macro that can be referenced using ${macro_name}.',
        syntax: 'macro <name> [ <text> ]',
        example: 'macro allocate_developers [\n  allocate dev1, dev2\n]'
    },
    'scenario': {
        name: 'scenario',
        category: 'property',
        description: 'Defines a scenario for what-if analysis. Scenarios can inherit from other scenarios.',
        syntax: 'scenario <id> "<name>" { ... }',
        example: 'scenario plan "Plan" {\n  scenario delayed "Delayed" {\n    shift 10d\n  }\n}'
    },

    // Attributes
    'allocate': {
        name: 'allocate',
        category: 'attribute',
        description: 'Allocates one or more resources to a task.',
        syntax: 'allocate <resource_id> [, <resource_id>, ...]',
        example: 'allocate dev1, dev2'
    },
    'depends': {
        name: 'depends',
        category: 'attribute',
        description: 'Creates a dependency between tasks. Use ! prefix for parent-level dependencies.',
        syntax: 'depends <task_id> [{ <attributes> }]',
        example: 'depends !spec, database { gapduration 2d }'
    },
    'effort': {
        name: 'effort',
        category: 'attribute',
        description: 'Specifies the amount of work required to complete a task (in person-time).',
        syntax: 'effort <duration>',
        example: 'effort 20d  # 20 person-days'
    },
    'duration': {
        name: 'duration',
        category: 'attribute',
        description: 'Specifies the elapsed time for a task (calendar time, not person-time).',
        syntax: 'duration <duration>',
        example: 'duration 5d  # 5 calendar days'
    },
    'start': {
        name: 'start',
        category: 'attribute',
        description: 'Fixes the start date of a task.',
        syntax: 'start <date>',
        example: 'start 2024-03-01'
    },
    'end': {
        name: 'end',
        category: 'attribute',
        description: 'Fixes the end date of a task.',
        syntax: 'end <date>',
        example: 'end 2024-03-31'
    },
    'complete': {
        name: 'complete',
        category: 'attribute',
        description: 'Specifies the completion percentage of a task.',
        syntax: 'complete <percentage>',
        example: 'complete 75'
    },
    'priority': {
        name: 'priority',
        category: 'attribute',
        description: 'Sets the scheduling priority of a task (0-1000, default 500).',
        syntax: 'priority <number>',
        example: 'priority 800'
    },
    'rate': {
        name: 'rate',
        category: 'attribute',
        description: 'Defines the cost rate per day for a resource.',
        syntax: 'rate <number>',
        example: 'rate 500.0  # $500/day'
    },
    'milestone': {
        name: 'milestone',
        category: 'attribute',
        description: 'Marks a task as a milestone (zero duration).',
        syntax: 'milestone',
        example: 'task launch "Product Launch" {\n  milestone\n  start 2024-06-01\n}'
    },

    // Functions
    'isleaf': {
        name: 'isleaf',
        category: 'function',
        description: 'Returns true if the task/resource has no children.',
        syntax: 'isleaf([<level>])',
        example: 'hidetask ~isleaf(0)'
    },
    'istask': {
        name: 'istask',
        category: 'function',
        description: 'Returns true if the entity is a task.',
        syntax: 'istask([<level>])',
        example: 'istask()'
    },
    'ismilestone': {
        name: 'ismilestone',
        category: 'function',
        description: 'Returns true if the task is a milestone.',
        syntax: 'ismilestone([<level>])',
        example: 'hidetask ~ismilestone(0)'
    },

    // Reports
    'taskreport': {
        name: 'taskreport',
        category: 'report',
        description: 'Generates a report listing tasks and their properties.',
        syntax: 'taskreport <id> "<name>" { ... }',
        example: 'taskreport overview "" {\n  formats html\n  columns name, start, end, effort, chart\n}'
    },
    'resourcereport': {
        name: 'resourcereport',
        category: 'report',
        description: 'Generates a report listing resources and their allocations.',
        syntax: 'resourcereport <id> "<name>" { ... }',
        example: 'resourcereport team "" {\n  formats html\n  columns name, rate, effort, chart\n}'
    }
};

export const completionItems: vscode.CompletionItem[] = Object.values(taskjugglerKeywords).map(keyword => {
    const item = new vscode.CompletionItem(keyword.name,
        keyword.category === 'property' ? vscode.CompletionItemKind.Class :
        keyword.category === 'attribute' ? vscode.CompletionItemKind.Property :
        keyword.category === 'function' ? vscode.CompletionItemKind.Function :
        vscode.CompletionItemKind.Module
    );
    item.detail = keyword.description;
    if (keyword.example) {
        item.documentation = new vscode.MarkdownString(`**Example:**\n\`\`\`taskjuggler\n${keyword.example}\n\`\`\``);
    }
    return item;
});
