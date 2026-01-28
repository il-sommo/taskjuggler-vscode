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
    'formats': {
        name: 'formats',
        category: 'attribute',
        description: 'Specifies output formats for reports (html, csv, xml, etc.).',
        syntax: 'formats <format> [, <format>, ...]',
        example: 'formats html, csv'
    },
    'html': {
        name: 'html',
        category: 'attribute',
        description: 'HTML output format for reports.',
        syntax: 'formats html',
        example: 'taskreport overview "" {\n  formats html\n}'
    },
    'csv': {
        name: 'csv',
        category: 'attribute',
        description: 'CSV (Comma-Separated Values) output format for reports.',
        syntax: 'formats csv',
        example: 'taskreport data "" {\n  formats csv\n}'
    },
    'loadunit': {
        name: 'loadunit',
        category: 'attribute',
        description: 'Specifies the unit for displaying resource load (hours, days, weeks, months, years).',
        syntax: 'loadunit <unit>',
        example: 'loadunit days'
    },
    'columns': {
        name: 'columns',
        category: 'attribute',
        description: 'Defines which columns to display in a report.',
        syntax: 'columns <column_id> [, <column_id>, ...]',
        example: 'columns bsi, name, start, end, effort, chart'
    },
    'bsi': {
        name: 'bsi',
        category: 'attribute',
        description: 'Work Breakdown Structure index column.',
        syntax: 'columns bsi { title "WBS" }',
        example: 'columns bsi, name, start'
    },
    'name': {
        name: 'name',
        category: 'attribute',
        description: 'Name column showing task/resource names.',
        syntax: 'columns name',
        example: 'columns name, start, end'
    },
    'chart': {
        name: 'chart',
        category: 'attribute',
        description: 'Gantt chart column showing task timeline visualization.',
        syntax: 'columns chart { scale <unit> width <pixels> }',
        example: 'columns chart { scale day width 500 }'
    },
    'caption': {
        name: 'caption',
        category: 'attribute',
        description: 'Adds a caption/description to a report.',
        syntax: 'caption "<text>"',
        example: 'caption "Project Overview Report"'
    },
    'timezone': {
        name: 'timezone',
        category: 'attribute',
        description: 'Sets the timezone for the project.',
        syntax: 'timezone "<timezone>"',
        example: 'timezone "UTC"'
    },
    'workinghours': {
        name: 'workinghours',
        category: 'attribute',
        description: 'Defines working hours for a resource or globally.',
        syntax: 'workinghours <day> <start>-<end>',
        example: 'workinghours mon-fri 9:00-17:00'
    },
    'limits': {
        name: 'limits',
        category: 'attribute',
        description: 'Sets resource allocation limits.',
        syntax: 'limits { dailymax <duration> }',
        example: 'limits {\n  dailymax 8h\n  weeklymax 40h\n}'
    },
    'flags': {
        name: 'flags',
        category: 'attribute',
        description: 'Defines or assigns flags to tasks/resources for filtering.',
        syntax: 'flags <flag_name>',
        example: 'flags important, team'
    },
    'scheduling': {
        name: 'scheduling',
        category: 'attribute',
        description: 'Sets the scheduling direction (asap or alap).',
        syntax: 'scheduling <direction>',
        example: 'scheduling asap'
    },
    'asap': {
        name: 'asap',
        category: 'attribute',
        description: 'As Soon As Possible scheduling.',
        syntax: 'scheduling asap',
        example: 'scheduling asap'
    },
    'alap': {
        name: 'alap',
        category: 'attribute',
        description: 'As Late As Possible scheduling.',
        syntax: 'scheduling alap',
        example: 'scheduling alap'
    },
    'projectstart': {
        name: 'projectstart',
        category: 'attribute',
        description: 'Built-in macro referring to project start date.',
        syntax: '${projectstart}',
        example: 'start ${projectstart}'
    },
    'projectend': {
        name: 'projectend',
        category: 'attribute',
        description: 'Built-in macro referring to project end date.',
        syntax: '${projectend}',
        example: 'end ${projectend}'
    },
    'now': {
        name: 'now',
        category: 'attribute',
        description: 'Built-in macro referring to current date/time.',
        syntax: '${now}',
        example: 'start ${now}'
    },
    'today': {
        name: 'today',
        category: 'attribute',
        description: 'Built-in macro referring to today\'s date.',
        syntax: '${today}',
        example: 'start ${today}'
    },
    'period': {
        name: 'period',
        category: 'attribute',
        description: 'Defines the time period for a report.',
        syntax: 'period <start_date> - <end_date>',
        example: 'period 2024-01-01 - 2024-12-31'
    },
    'include': {
        name: 'include',
        category: 'property',
        description: 'Includes another TaskJuggler file.',
        syntax: 'include "<file.tji>"',
        example: 'include "resources.tji"'
    },
    'booking': {
        name: 'booking',
        category: 'attribute',
        description: 'Books a resource for specific time periods.',
        syntax: 'booking <resource_id> <start_date> [+<duration>]',
        example: 'booking dev1 2024-02-01 +5d { overtime 2 }'
    },
    'supplement': {
        name: 'supplement',
        category: 'property',
        description: 'Supplements/extends an existing task or resource definition.',
        syntax: 'supplement <type> <id> { ... }',
        example: 'supplement task dev.backend {\n  effort 10d\n}'
    },
    'purge': {
        name: 'purge',
        category: 'attribute',
        description: 'Removes attributes from inherited scenarios.',
        syntax: 'purge <attribute>',
        example: 'purge allocate'
    },
    'select': {
        name: 'select',
        category: 'attribute',
        description: 'Filters tasks or resources in reports.',
        syntax: 'select <expression>',
        example: 'select isleaf()'
    },
    'sorttasks': {
        name: 'sorttasks',
        category: 'attribute',
        description: 'Defines how to sort tasks in reports.',
        syntax: 'sorttasks <criteria>',
        example: 'sorttasks tree, start.up'
    },
    'sortresources': {
        name: 'sortresources',
        category: 'attribute',
        description: 'Defines how to sort resources in reports.',
        syntax: 'sortresources <criteria>',
        example: 'sortresources name.up'
    },
    'hidetask': {
        name: 'hidetask',
        category: 'attribute',
        description: 'Hides tasks matching criteria from reports.',
        syntax: 'hidetask <expression>',
        example: 'hidetask ~isleaf()'
    },
    'hideresource': {
        name: 'hideresource',
        category: 'attribute',
        description: 'Hides resources matching criteria from reports.',
        syntax: 'hideresource <expression>',
        example: 'hideresource ~isleaf()'
    },
    'rollupresource': {
        name: 'rollupresource',
        category: 'attribute',
        description: 'Rolls up resource data to parent level.',
        syntax: 'rollupresource <expression>',
        example: 'rollupresource name = "Team"'
    },
    'rolluptask': {
        name: 'rolluptask',
        category: 'attribute',
        description: 'Rolls up task data to parent level.',
        syntax: 'rolluptask <expression>',
        example: 'rolluptask isleaf_() = 0'
    },
    'managers': {
        name: 'managers',
        category: 'attribute',
        description: 'Assigns managers to a resource.',
        syntax: 'managers <resource_id> [, <resource_id>, ...]',
        example: 'managers boss'
    },
    'leaves': {
        name: 'leaves',
        category: 'attribute',
        description: 'Defines vacation/leave periods for a resource.',
        syntax: 'leaves vacation <start_date> [+<duration>]',
        example: 'leaves vacation 2024-08-01 +2w'
    },
    'shift': {
        name: 'shift',
        category: 'property',
        description: 'Defines a work shift pattern.',
        syntax: 'shift <id> "<name>" { ... }',
        example: 'shift morning "Morning Shift" {\n  workinghours mon-fri 8:00-16:00\n}'
    },
    'vacation': {
        name: 'vacation',
        category: 'attribute',
        description: 'Defines vacation periods for resources.',
        syntax: 'vacation <start_date> [+<duration>]',
        example: 'vacation 2024-12-20 +2w'
    },
    'journalentry': {
        name: 'journalentry',
        category: 'attribute',
        description: 'Adds a journal entry to document task progress or issues.',
        syntax: 'journalentry <date> "<headline>" { ... }',
        example: 'journalentry 2024-01-15 "Status Update" {\n  author "John"\n  summary "Completed milestone"\n}'
    },
    'author': {
        name: 'author',
        category: 'attribute',
        description: 'Specifies the author of a journal entry.',
        syntax: 'author "<name>"',
        example: 'author "John Smith"'
    },
    'summary': {
        name: 'summary',
        category: 'attribute',
        description: 'Provides a summary text for journal entries.',
        syntax: 'summary "<text>"',
        example: 'summary "Task completed successfully"'
    },
    'details': {
        name: 'details',
        category: 'attribute',
        description: 'Provides detailed text for journal entries.',
        syntax: 'details "<text>"',
        example: 'details "All deliverables met quality standards"'
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
    'hasalert': {
        name: 'hasalert',
        category: 'function',
        description: 'Returns true if the task has alerts.',
        syntax: 'hasalert([<level>])',
        example: 'select hasalert(0)'
    },
    'isresource': {
        name: 'isresource',
        category: 'function',
        description: 'Returns true if the entity is a resource.',
        syntax: 'isresource()',
        example: 'select isresource()'
    },
    'isactive': {
        name: 'isactive',
        category: 'function',
        description: 'Returns true if the task is active in the given scenario.',
        syntax: 'isactive([<level>], [<scenario>])',
        example: 'select isactive()'
    },
    'isdutyof': {
        name: 'isdutyof',
        category: 'function',
        description: 'Returns true if the resource is responsible for the task.',
        syntax: 'isdutyof(<resource_id>)',
        example: 'select isdutyof(dev1)'
    },
    'treelevel': {
        name: 'treelevel',
        category: 'function',
        description: 'Returns the nesting level in the tree structure.',
        syntax: 'treelevel()',
        example: 'select treelevel() > 1'
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
    },
    'textreport': {
        name: 'textreport',
        category: 'report',
        description: 'Generates a text-based report with custom formatting.',
        syntax: 'textreport <id> "<name>" { ... }',
        example: 'textreport status "" {\n  formats html\n  center "Project Status"\n}'
    },
    'accountreport': {
        name: 'accountreport',
        category: 'report',
        description: 'Generates a financial account report.',
        syntax: 'accountreport <id> "<name>" { ... }',
        example: 'accountreport budget "" {\n  formats html\n  columns name, total\n}'
    },
    'timesheetreport': {
        name: 'timesheetreport',
        category: 'report',
        description: 'Generates a timesheet report for resources.',
        syntax: 'timesheetreport <id> "<name>" { ... }',
        example: 'timesheetreport weekly "" {\n  formats html\n}'
    },
    'tracereport': {
        name: 'tracereport',
        category: 'report',
        description: 'Generates a detailed trace report for debugging.',
        syntax: 'tracereport <id> "<name>" { ... }',
        example: 'tracereport debug "" {\n  formats html\n}'
    },
    'export': {
        name: 'export',
        category: 'property',
        description: 'Exports project data to various formats.',
        syntax: 'export <format> "<filename>"',
        example: 'export csv "project.csv"'
    },
    'navigator': {
        name: 'navigator',
        category: 'report',
        description: 'Generates a navigation bar for HTML reports.',
        syntax: 'navigator <id> { ... }',
        example: 'navigator navbar {\n  hidereport 0\n}'
    },
    'nikureport': {
        name: 'nikureport',
        category: 'report',
        description: 'Generates a Niku (Clarity) compatible export.',
        syntax: 'nikureport <id> "<name>" { ... }',
        example: 'nikureport clarity "" {\n  timeformat "%Y-%m-%d"\n}'
    },
    'icalreport': {
        name: 'icalreport',
        category: 'report',
        description: 'Generates an iCalendar format export.',
        syntax: 'icalreport <id> "<name>" { ... }',
        example: 'icalreport calendar "" {\n  tasks all\n}'
    },
    'xmlreport': {
        name: 'xmlreport',
        category: 'report',
        description: 'Generates an XML format report.',
        syntax: 'xmlreport <id> "<name>" { ... }',
        example: 'xmlreport data "" {\n  version 0.4\n}'
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
