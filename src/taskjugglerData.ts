/**
 * Complete TaskJuggler keyword documentation and metadata
 * Covers ALL TaskJuggler 3.x keywords for hover, completions, and navigation
 */

import * as vscode from 'vscode';

export interface KeywordInfo {
    name: string;
    description: string;
    syntax?: string;
    example?: string;
    category: 'property' | 'attribute' | 'function' | 'report' | 'column';
}

export const taskjugglerKeywords: Record<string, KeywordInfo> = {
    // ===== PROPERTIES (Main declarations) =====

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
        description: 'Defines a resource that can be allocated to tasks.',
        syntax: 'resource <id> "<name>" { ... }',
        example: 'resource dev1 "John Doe" {\n  rate 500.0\n}'
    },
    'account': {
        name: 'account',
        category: 'property',
        description: 'Defines an account for financial tracking and cost/revenue reporting.',
        syntax: 'account <id> "<name>" { ... }',
        example: 'account costs "Project Costs" {\n  account labor "Labor"\n}'
    },
    'shift': {
        name: 'shift',
        category: 'property',
        description: 'Defines a work shift pattern with specific working hours.',
        syntax: 'shift <id> "<name>" { ... }',
        example: 'shift morning "Morning Shift" {\n  workinghours mon-fri 8:00-16:00\n}'
    },
    'scenario': {
        name: 'scenario',
        category: 'property',
        description: 'Defines a scenario for what-if analysis. Scenarios can inherit from other scenarios.',
        syntax: 'scenario <id> "<name>" { ... }',
        example: 'scenario plan "Plan" {\n  scenario delayed "Delayed"\n}'
    },
    'macro': {
        name: 'macro',
        category: 'property',
        description: 'Defines a reusable text macro that can be referenced using ${macro_name}.',
        syntax: 'macro <name> [ <text> ]',
        example: 'macro allocate_developers [\n  allocate dev1, dev2\n]'
    },
    'include': {
        name: 'include',
        category: 'property',
        description: 'Includes another TaskJuggler file (.tji).',
        syntax: 'include "<file.tji>"',
        example: 'include "resources.tji"'
    },
    'export': {
        name: 'export',
        category: 'property',
        description: 'Exports project data to various formats.',
        syntax: 'export <format> "<filename>"',
        example: 'export csv "project.csv"'
    },
    'supplement': {
        name: 'supplement',
        category: 'property',
        description: 'Supplements/extends an existing task or resource definition.',
        syntax: 'supplement <type> <id> { ... }',
        example: 'supplement task dev.backend {\n  effort 10d\n}'
    },
    'extend': {
        name: 'extend',
        category: 'property',
        description: 'Extends the TaskJuggler syntax with custom attributes.',
        syntax: 'extend <property> { ... }',
        example: 'extend task {\n  text customfield "Custom Field"\n}'
    },
    'flags': {
        name: 'flags',
        category: 'property',
        description: 'Declares global flags that can be used for filtering.',
        syntax: 'flags <flag_name> [, ...]',
        example: 'flags important, team, milestone'
    },
    'copyright': {
        name: 'copyright',
        category: 'attribute',
        description: 'Specifies copyright information for the project.',
        syntax: 'copyright "<text>"',
        example: 'copyright "© 2024 ACME Corp"'
    },
    'currency': {
        name: 'currency',
        category: 'attribute',
        description: 'Sets the currency symbol for the project.',
        syntax: 'currency "<symbol>"',
        example: 'currency "USD"'
    },
    'trackingscenario': {
        name: 'trackingscenario',
        category: 'attribute',
        description: 'Specifies the scenario used for tracking actual progress.',
        syntax: 'trackingscenario <scenario_id>',
        example: 'trackingscenario actual'
    },

    // ===== REPORTS =====

    'taskreport': {
        name: 'taskreport',
        category: 'report',
        description: 'Generates a report listing tasks and their properties.',
        syntax: 'taskreport <id> "<name>" { ... }',
        example: 'taskreport overview "" {\n  formats html\n  columns name, start, end\n}'
    },
    'resourcereport': {
        name: 'resourcereport',
        category: 'report',
        description: 'Generates a report listing resources and their allocations.',
        syntax: 'resourcereport <id> "<name>" { ... }',
        example: 'resourcereport team "" {\n  formats html\n  columns name, effort\n}'
    },
    'accountreport': {
        name: 'accountreport',
        category: 'report',
        description: 'Generates a financial account report.',
        syntax: 'accountreport <id> "<name>" { ... }',
        example: 'accountreport budget "" {\n  formats html\n}'
    },
    'textreport': {
        name: 'textreport',
        category: 'report',
        description: 'Generates a text-based report with custom formatting.',
        syntax: 'textreport <id> "<name>" { ... }',
        example: 'textreport status "" {\n  formats html\n  center "Status"\n}'
    },
    'timesheetreport': {
        name: 'timesheetreport',
        category: 'report',
        description: 'Generates a timesheet report for resources.',
        syntax: 'timesheetreport <id> "<name>" { ... }',
        example: 'timesheetreport weekly "" {\n  formats html\n}'
    },
    'statussheetreport': {
        name: 'statussheetreport',
        category: 'report',
        description: 'Generates a status sheet report.',
        syntax: 'statussheetreport <id> "<name>" { ... }',
        example: 'statussheetreport status "" {\n  formats html\n}'
    },
    'tracereport': {
        name: 'tracereport',
        category: 'report',
        description: 'Generates a detailed trace report for debugging.',
        syntax: 'tracereport <id> "<name>" { ... }',
        example: 'tracereport debug "" {\n  formats html\n}'
    },
    'icalreport': {
        name: 'icalreport',
        category: 'report',
        description: 'Generates an iCalendar format export.',
        syntax: 'icalreport <id> "<name>" { ... }',
        example: 'icalreport calendar "" {\n  tasks all\n}'
    },
    'nikureport': {
        name: 'nikureport',
        category: 'report',
        description: 'Generates a Niku (Clarity) compatible export.',
        syntax: 'nikureport <id> "<name>" { ... }',
        example: 'nikureport clarity "" {\n  timeformat "%Y-%m-%d"\n}'
    },
    'xmlreport': {
        name: 'xmlreport',
        category: 'report',
        description: 'Generates an XML format report.',
        syntax: 'xmlreport <id> "<name>" { ... }',
        example: 'xmlreport data "" {\n  version 0.4\n}'
    },
    'navigator': {
        name: 'navigator',
        category: 'report',
        description: 'Generates a navigation bar for HTML reports.',
        syntax: 'navigator <id> { ... }',
        example: 'navigator navbar {\n  hidereport 0\n}'
    },

    // ===== TASK/RESOURCE ATTRIBUTES =====

    'allocate': {
        name: 'allocate',
        category: 'attribute',
        description: 'Allocates one or more resources to a task.',
        syntax: 'allocate <resource_id> [, <resource_id>, ...]',
        example: 'allocate dev1, dev2'
    },
    'alternative': {
        name: 'alternative',
        category: 'attribute',
        description: 'Provides alternative resource allocations.',
        syntax: 'alternative <resource_id> [, ...]',
        example: 'alternative dev2, dev3'
    },
    'chargeset': {
        name: 'chargeset',
        category: 'attribute',
        description: 'Defines a set of charges for cost distribution.',
        syntax: 'chargeset <id> { ... }',
        example: 'chargeset overhead {\n  charge 0.1 account admin\n}'
    },
    'charge': {
        name: 'charge',
        category: 'attribute',
        description: 'Assigns a charge to an account.',
        syntax: 'charge <amount> [<account_id>]',
        example: 'charge 100 costs.overhead'
    },
    'complete': {
        name: 'complete',
        category: 'attribute',
        description: 'Specifies the completion percentage of a task.',
        syntax: 'complete <percentage>',
        example: 'complete 75'
    },
    'depends': {
        name: 'depends',
        category: 'attribute',
        description: 'Creates a dependency between tasks.',
        syntax: 'depends <task_id> [{ <attributes> }]',
        example: 'depends !spec { gapduration 2d }'
    },
    'duration': {
        name: 'duration',
        category: 'attribute',
        description: 'Specifies the elapsed time for a task (calendar time).',
        syntax: 'duration <duration>',
        example: 'duration 5d'
    },
    'effort': {
        name: 'effort',
        category: 'attribute',
        description: 'Specifies the amount of work required (person-time).',
        syntax: 'effort <duration>',
        example: 'effort 20d'
    },
    'efficiency': {
        name: 'efficiency',
        category: 'attribute',
        description: 'Sets the efficiency factor for a resource (0.0 to unlimited).',
        syntax: 'efficiency <factor>',
        example: 'efficiency 1.5'
    },
    'email': {
        name: 'email',
        category: 'attribute',
        description: 'Specifies an email address for a resource.',
        syntax: 'email "<address>"',
        example: 'email "dev@example.com"'
    },
    'end': {
        name: 'end',
        category: 'attribute',
        description: 'Fixes the end date of a task.',
        syntax: 'end <date>',
        example: 'end 2024-03-31'
    },
    'fail': {
        name: 'fail',
        category: 'attribute',
        description: 'Causes the scheduling to fail with an error message.',
        syntax: 'fail <condition> "<message>"',
        example: 'fail plan.effort > 1000d "Too much effort"'
    },
    'gapduration': {
        name: 'gapduration',
        category: 'attribute',
        description: 'Specifies minimum gap between dependent tasks.',
        syntax: 'gapduration <duration>',
        example: 'depends !task1 { gapduration 5d }'
    },
    'gaplength': {
        name: 'gaplength',
        category: 'attribute',
        description: 'Specifies minimum working time gap between tasks.',
        syntax: 'gaplength <duration>',
        example: 'depends !task1 { gaplength 3d }'
    },
    'length': {
        name: 'length',
        category: 'attribute',
        description: 'Specifies the working time duration of a task.',
        syntax: 'length <duration>',
        example: 'length 10d'
    },
    'limits': {
        name: 'limits',
        category: 'attribute',
        description: 'Sets resource allocation limits.',
        syntax: 'limits { dailymax <duration> }',
        example: 'limits {\n  dailymax 8h\n  weeklymax 40h\n}'
    },
    'dailymax': {
        name: 'dailymax',
        category: 'attribute',
        description: 'Maximum daily resource allocation.',
        syntax: 'dailymax <duration>',
        example: 'dailymax 8h'
    },
    'dailymin': {
        name: 'dailymin',
        category: 'attribute',
        description: 'Minimum daily resource allocation.',
        syntax: 'dailymin <duration>',
        example: 'dailymin 4h'
    },
    'weeklymax': {
        name: 'weeklymax',
        category: 'attribute',
        description: 'Maximum weekly resource allocation.',
        syntax: 'weeklymax <duration>',
        example: 'weeklymax 40h'
    },
    'weeklymin': {
        name: 'weeklymin',
        category: 'attribute',
        description: 'Minimum weekly resource allocation.',
        syntax: 'weeklymin <duration>',
        example: 'weeklymin 20h'
    },
    'monthlymax': {
        name: 'monthlymax',
        category: 'attribute',
        description: 'Maximum monthly resource allocation.',
        syntax: 'monthlymax <duration>',
        example: 'monthlymax 160h'
    },
    'managers': {
        name: 'managers',
        category: 'attribute',
        description: 'Assigns managers to a resource.',
        syntax: 'managers <resource_id> [, ...]',
        example: 'managers boss'
    },
    'mandatory': {
        name: 'mandatory',
        category: 'attribute',
        description: 'Makes a resource allocation mandatory.',
        syntax: 'mandatory',
        example: 'allocate dev1 { mandatory }'
    },
    'maxend': {
        name: 'maxend',
        category: 'attribute',
        description: 'Sets the maximum allowed end date for a task (attribute), or displays the maximum end date in a report column.',
        syntax: 'maxend <date> | columns maxend',
        example: 'task foo {\n  maxend 2024-12-31\n}\n\ntaskreport {\n  columns name, maxend\n}'
    },
    'maxstart': {
        name: 'maxstart',
        category: 'attribute',
        description: 'Sets the maximum allowed start date for a task (attribute), or displays the maximum start date in a report column.',
        syntax: 'maxstart <date> | columns maxstart',
        example: 'task foo {\n  maxstart 2024-06-01\n}\n\ntaskreport {\n  columns name, maxstart\n}'
    },
    'minend': {
        name: 'minend',
        category: 'attribute',
        description: 'Sets the minimum required end date for a task (attribute), or displays the minimum end date in a report column.',
        syntax: 'minend <date> | columns minend',
        example: 'task foo {\n  minend 2024-03-01\n}\n\ntaskreport {\n  columns name, minend\n}'
    },
    'minstart': {
        name: 'minstart',
        category: 'attribute',
        description: 'Sets the minimum required start date for a task (attribute), or displays the minimum start date in a report column.',
        syntax: 'minstart <date> | columns minstart',
        example: 'task foo {\n  minstart 2024-01-01\n}\n\ntaskreport {\n  columns name, minstart\n}'
    },
    'milestone': {
        name: 'milestone',
        category: 'attribute',
        description: 'Marks a task as a milestone (zero duration).',
        syntax: 'milestone',
        example: 'task launch "Launch" {\n  milestone\n}'
    },
    'note': {
        name: 'note',
        category: 'attribute',
        description: 'Adds a note to a task or resource.',
        syntax: 'note "<text>"',
        example: 'note "Important deadline"'
    },
    'persistent': {
        name: 'persistent',
        category: 'attribute',
        description: 'Makes a resource allocation persistent across scheduling passes.',
        syntax: 'persistent',
        example: 'allocate dev1 { persistent }'
    },
    'priority': {
        name: 'priority',
        category: 'attribute',
        description: 'Sets the scheduling priority (0-1000, default 500).',
        syntax: 'priority <number>',
        example: 'priority 800'
    },
    'projectid': {
        name: 'projectid',
        category: 'attribute',
        description: 'Links a task to an external project ID.',
        syntax: 'projectid "<id>"',
        example: 'projectid "PRJ-001"'
    },
    'purge': {
        name: 'purge',
        category: 'attribute',
        description: 'Removes attributes from inherited scenarios.',
        syntax: 'purge <attribute>',
        example: 'purge allocate'
    },
    'rate': {
        name: 'rate',
        category: 'attribute',
        description: 'Defines the cost rate per day for a resource.',
        syntax: 'rate <number>',
        example: 'rate 500.0'
    },
    'responsible': {
        name: 'responsible',
        category: 'attribute',
        description: 'Assigns a responsible resource to a task.',
        syntax: 'responsible <resource_id>',
        example: 'responsible manager'
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
    'start': {
        name: 'start',
        category: 'attribute',
        description: 'Fixes the start date of a task.',
        syntax: 'start <date>',
        example: 'start 2024-03-01'
    },
    'vacation': {
        name: 'vacation',
        category: 'attribute',
        description: 'Defines vacation periods for resources.',
        syntax: 'vacation <start_date> [+<duration>]',
        example: 'vacation 2024-12-20 +2w'
    },
    'leaves': {
        name: 'leaves',
        category: 'attribute',
        description: 'Defines leave/vacation periods for a resource.',
        syntax: 'leaves vacation <start_date> [+<duration>]',
        example: 'leaves vacation 2024-08-01 +2w'
    },
    'workinghours': {
        name: 'workinghours',
        category: 'attribute',
        description: 'Defines working hours for a resource or globally.',
        syntax: 'workinghours <day> <start>-<end>',
        example: 'workinghours mon-fri 9:00-17:00'
    },
    'timezone': {
        name: 'timezone',
        category: 'attribute',
        description: 'Sets the timezone for the project.',
        syntax: 'timezone "<timezone>"',
        example: 'timezone "UTC"'
    },
    'booking': {
        name: 'booking',
        category: 'attribute',
        description: 'Books a resource for specific time periods.',
        syntax: 'booking <resource_id> <start_date> [+<duration>]',
        example: 'booking dev1 2024-02-01 +5d'
    },

    // ===== REPORT ATTRIBUTES =====

    'formats': {
        name: 'formats',
        category: 'attribute',
        description: 'Specifies output formats for reports.',
        syntax: 'formats <format> [, ...]',
        example: 'formats html, csv'
    },
    'html': {
        name: 'html',
        category: 'attribute',
        description: 'HTML output format.',
        syntax: 'formats html',
        example: 'formats html'
    },
    'csv': {
        name: 'csv',
        category: 'attribute',
        description: 'CSV output format.',
        syntax: 'formats csv',
        example: 'formats csv'
    },
    'xml': {
        name: 'xml',
        category: 'attribute',
        description: 'XML output format.',
        syntax: 'formats xml',
        example: 'formats xml'
    },
    'msp': {
        name: 'msp',
        category: 'attribute',
        description: 'Microsoft Project XML format.',
        syntax: 'formats msp',
        example: 'formats msp'
    },
    'tjp': {
        name: 'tjp',
        category: 'attribute',
        description: 'TaskJuggler project format.',
        syntax: 'formats tjp',
        example: 'formats tjp'
    },
    'columns': {
        name: 'columns',
        category: 'attribute',
        description: 'Defines which columns to display in a report.',
        syntax: 'columns <column_id> [, ...]',
        example: 'columns bsi, name, start, end'
    },
    'loadunit': {
        name: 'loadunit',
        category: 'attribute',
        description: 'Specifies the unit for displaying resource load.',
        syntax: 'loadunit <unit>',
        example: 'loadunit days'
    },
    'hours': {
        name: 'hours',
        category: 'attribute',
        description: 'Hours time unit.',
        syntax: 'loadunit hours',
        example: 'loadunit hours'
    },
    'days': {
        name: 'days',
        category: 'attribute',
        description: 'Days time unit.',
        syntax: 'loadunit days',
        example: 'loadunit days'
    },
    'weeks': {
        name: 'weeks',
        category: 'attribute',
        description: 'Weeks time unit.',
        syntax: 'loadunit weeks',
        example: 'loadunit weeks'
    },
    'months': {
        name: 'months',
        category: 'attribute',
        description: 'Months time unit.',
        syntax: 'loadunit months',
        example: 'loadunit months'
    },
    'years': {
        name: 'years',
        category: 'attribute',
        description: 'Years time unit.',
        syntax: 'loadunit years',
        example: 'loadunit years'
    },
    'caption': {
        name: 'caption',
        category: 'attribute',
        description: 'Adds a caption to a report.',
        syntax: 'caption "<text>"',
        example: 'caption "Project Overview"'
    },
    'center': {
        name: 'center',
        category: 'attribute',
        description: 'Centers text in a text report.',
        syntax: 'center "<text>"',
        example: 'center "Status Report"'
    },
    'headline': {
        name: 'headline',
        category: 'attribute',
        description: 'Sets the headline for a report.',
        syntax: 'headline "<text>"',
        example: 'headline "Monthly Report"'
    },
    'period': {
        name: 'period',
        category: 'attribute',
        description: 'Defines the time period for a report.',
        syntax: 'period <start_date> - <end_date>',
        example: 'period 2024-01-01 - 2024-12-31'
    },
    'timeformat': {
        name: 'timeformat',
        category: 'attribute',
        description: 'Sets the time format for date displays.',
        syntax: 'timeformat "<format>"',
        example: 'timeformat "%Y-%m-%d"'
    },
    'currencyformat': {
        name: 'currencyformat',
        category: 'attribute',
        description: 'Sets the format for currency displays.',
        syntax: 'currencyformat "<prefix>" "<suffix>" "<sep>" "<fracsep>" <digits>',
        example: 'currencyformat "(" ")" "," "." 2'
    },
    'numberformat': {
        name: 'numberformat',
        category: 'attribute',
        description: 'Sets the format for number displays.',
        syntax: 'numberformat "<prefix>" "<suffix>" "<sep>" "<fracsep>" <digits>',
        example: 'numberformat "-" "" "," "." 1'
    },
    'select': {
        name: 'select',
        category: 'attribute',
        description: 'Filters tasks or resources in reports using logical expressions.',
        syntax: 'select <expression>',
        example: 'select isleaf()'
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
    'hideaccount': {
        name: 'hideaccount',
        category: 'attribute',
        description: 'Hides accounts matching criteria from reports.',
        syntax: 'hideaccount <expression>',
        example: 'hideaccount ~isleaf()'
    },
    'hidejournalentry': {
        name: 'hidejournalentry',
        category: 'attribute',
        description: 'Hides journal entries matching criteria.',
        syntax: 'hidejournalentry <expression>',
        example: 'hidejournalentry author != "Manager"'
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
    'sortaccounts': {
        name: 'sortaccounts',
        category: 'attribute',
        description: 'Defines how to sort accounts in reports.',
        syntax: 'sortaccounts <criteria>',
        example: 'sortaccounts tree'
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
        example: 'rolluptask ~isleaf()'
    },
    'rollupaccount': {
        name: 'rollupaccount',
        category: 'attribute',
        description: 'Rolls up account data to parent level.',
        syntax: 'rollupaccount <expression>',
        example: 'rollupaccount ~isleaf()'
    },
    'taskroot': {
        name: 'taskroot',
        category: 'attribute',
        description: 'Sets the root task for a report.',
        syntax: 'taskroot <task_id>',
        example: 'taskroot development'
    },
    'resourceroot': {
        name: 'resourceroot',
        category: 'attribute',
        description: 'Sets the root resource for a report.',
        syntax: 'resourceroot <resource_id>',
        example: 'resourceroot team'
    },

    // ===== COLUMN TYPES =====

    'bsi': {
        name: 'bsi',
        category: 'column',
        description: 'Work Breakdown Structure index column.',
        syntax: 'columns bsi { title "WBS" }',
        example: 'columns bsi, name'
    },
    'name': {
        name: 'name',
        category: 'column',
        description: 'Name column.',
        syntax: 'columns name',
        example: 'columns name, start'
    },
    'chart': {
        name: 'chart',
        category: 'column',
        description: 'Gantt chart column.',
        syntax: 'columns chart { scale <unit> }',
        example: 'columns chart { scale day width 500 }'
    },
    'id': {
        name: 'id',
        category: 'column',
        description: 'ID column.',
        syntax: 'columns id',
        example: 'columns id, name'
    },
    'index': {
        name: 'index',
        category: 'column',
        description: 'Index number column.',
        syntax: 'columns index',
        example: 'columns index, name'
    },
    'no': {
        name: 'no',
        category: 'column',
        description: 'Number column.',
        syntax: 'columns no',
        example: 'columns no, name'
    },
    'hierarchindex': {
        name: 'hierarchindex',
        category: 'column',
        description: 'Hierarchical index column.',
        syntax: 'columns hierarchindex',
        example: 'columns hierarchindex, name'
    },
    'seqno': {
        name: 'seqno',
        category: 'column',
        description: 'Sequence number column.',
        syntax: 'columns seqno',
        example: 'columns seqno, name'
    },
    'status': {
        name: 'status',
        category: 'column',
        description: 'Status column.',
        syntax: 'columns status',
        example: 'columns name, status'
    },
    'statusnote': {
        name: 'statusnote',
        category: 'column',
        description: 'Status note column.',
        syntax: 'columns statusnote',
        example: 'columns name, statusnote'
    },
    'cost': {
        name: 'cost',
        category: 'column',
        description: 'Cost column.',
        syntax: 'columns cost',
        example: 'columns name, cost'
    },
    'revenue': {
        name: 'revenue',
        category: 'column',
        description: 'Revenue column.',
        syntax: 'columns revenue',
        example: 'columns name, revenue'
    },
    'profit': {
        name: 'profit',
        category: 'column',
        description: 'Profit column.',
        syntax: 'columns profit',
        example: 'columns name, profit'
    },

    // ===== FUNCTIONS =====

    'isleaf': {
        name: 'isleaf',
        category: 'function',
        description: 'Returns true if the entity has no children.',
        syntax: 'isleaf([<level>])',
        example: 'hidetask ~isleaf(0)'
    },
    'istask': {
        name: 'istask',
        category: 'function',
        description: 'Returns true if the entity is a task.',
        syntax: 'istask([<level>])',
        example: 'select istask()'
    },
    'ismilestone': {
        name: 'ismilestone',
        category: 'function',
        description: 'Returns true if the task is a milestone.',
        syntax: 'ismilestone([<level>])',
        example: 'select ismilestone(0)'
    },
    'isresource': {
        name: 'isresource',
        category: 'function',
        description: 'Returns true if the entity is a resource.',
        syntax: 'isresource()',
        example: 'select isresource()'
    },
    'isaccount': {
        name: 'isaccount',
        category: 'function',
        description: 'Returns true if the entity is an account.',
        syntax: 'isaccount()',
        example: 'select isaccount()'
    },
    'isactive': {
        name: 'isactive',
        category: 'function',
        description: 'Returns true if the task is active in the given scenario.',
        syntax: 'isactive([<level>], [<scenario>])',
        example: 'select isactive()'
    },
    'isongoing': {
        name: 'isongoing',
        category: 'function',
        description: 'Returns true if the task is ongoing at reference date.',
        syntax: 'isongoing([<level>], [<date>])',
        example: 'select isongoing()'
    },
    'hasalert': {
        name: 'hasalert',
        category: 'function',
        description: 'Returns true if the task has alerts.',
        syntax: 'hasalert([<level>])',
        example: 'select hasalert(0)'
    },
    'isdutyof': {
        name: 'isdutyof',
        category: 'function',
        description: 'Returns true if the resource is responsible for the task.',
        syntax: 'isdutyof(<resource_id>)',
        example: 'select isdutyof(manager)'
    },
    'isallocated': {
        name: 'isallocated',
        category: 'function',
        description: 'Returns true if a resource is allocated.',
        syntax: 'isallocated([<level>], <resource_id>)',
        example: 'select isallocated(0, dev1)'
    },
    'ischildof': {
        name: 'ischildof',
        category: 'function',
        description: 'Returns true if the entity is a child of the specified parent.',
        syntax: 'ischildof(<id>)',
        example: 'select ischildof(development)'
    },
    'treelevel': {
        name: 'treelevel',
        category: 'function',
        description: 'Returns the nesting level in the tree structure.',
        syntax: 'treelevel()',
        example: 'select treelevel() > 1'
    },
    'hasresource': {
        name: 'hasresource',
        category: 'function',
        description: 'Returns true if the task has resource allocations.',
        syntax: 'hasresource([<level>])',
        example: 'select hasresource()'
    },
    'contains': {
        name: 'contains',
        category: 'function',
        description: 'Returns true if a string contains a substring.',
        syntax: 'contains("<string>", "<substring>")',
        example: 'select contains(name, "Backend")'
    },
    'containssubstring': {
        name: 'containssubstring',
        category: 'function',
        description: 'Alias for contains function.',
        syntax: 'containssubstring("<string>", "<substring>")',
        example: 'select containssubstring(name, "Dev")'
    },

    // ===== JOURNAL & DOCUMENTATION =====

    'journalentry': {
        name: 'journalentry',
        category: 'attribute',
        description: 'Adds a journal entry to document progress.',
        syntax: 'journalentry <date> "<headline>" { ... }',
        example: 'journalentry 2024-01-15 "Status" {\n  author "John"\n}'
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
        description: 'Provides a summary text.',
        syntax: 'summary "<text>"',
        example: 'summary "Completed milestone"'
    },
    'details': {
        name: 'details',
        category: 'attribute',
        description: 'Provides detailed text.',
        syntax: 'details "<text>"',
        example: 'details "All deliverables met"'
    },
    'alert': {
        name: 'alert',
        category: 'attribute',
        description: 'Defines an alert for the journal entry.',
        syntax: 'alert <level>',
        example: 'alert red'
    },
    'alertlevel': {
        name: 'alertlevel',
        category: 'attribute',
        description: 'Defines custom alert levels.',
        syntax: 'alertlevel <id> "<name>" { color <color> }',
        example: 'alertlevel critical "Critical" { color red }'
    },
    'red': {
        name: 'red',
        category: 'attribute',
        description: 'Red alert level.',
        syntax: 'alert red',
        example: 'alert red'
    },
    'yellow': {
        name: 'yellow',
        category: 'attribute',
        description: 'Yellow alert level.',
        syntax: 'alert yellow',
        example: 'alert yellow'
    },
    'green': {
        name: 'green',
        category: 'attribute',
        description: 'Green alert level.',
        syntax: 'alert green',
        example: 'alert green'
    },

    // ===== MACROS & CONSTANTS =====

    'projectstart': {
        name: 'projectstart',
        category: 'attribute',
        description: 'Built-in macro for project start date.',
        syntax: '${projectstart}',
        example: 'start ${projectstart}'
    },
    'projectend': {
        name: 'projectend',
        category: 'attribute',
        description: 'Built-in macro for project end date.',
        syntax: '${projectend}',
        example: 'end ${projectend}'
    },
    'now': {
        name: 'now',
        category: 'attribute',
        description: 'Built-in macro for current date/time.',
        syntax: '${now}',
        example: 'start ${now}'
    },
    'today': {
        name: 'today',
        category: 'attribute',
        description: 'Built-in macro for today\'s date.',
        syntax: '${today}',
        example: 'start ${today}'
    },

    // ===== WEEKDAYS =====

    'mon': {
        name: 'mon',
        category: 'attribute',
        description: 'Monday.',
        syntax: 'workinghours mon <hours>',
        example: 'workinghours mon 9:00-17:00'
    },
    'tue': {
        name: 'tue',
        category: 'attribute',
        description: 'Tuesday.',
        syntax: 'workinghours tue <hours>',
        example: 'workinghours tue 9:00-17:00'
    },
    'wed': {
        name: 'wed',
        category: 'attribute',
        description: 'Wednesday.',
        syntax: 'workinghours wed <hours>',
        example: 'workinghours wed 9:00-17:00'
    },
    'thu': {
        name: 'thu',
        category: 'attribute',
        description: 'Thursday.',
        syntax: 'workinghours thu <hours>',
        example: 'workinghours thu 9:00-17:00'
    },
    'fri': {
        name: 'fri',
        category: 'attribute',
        description: 'Friday.',
        syntax: 'workinghours fri <hours>',
        example: 'workinghours fri 9:00-17:00'
    },
    'sat': {
        name: 'sat',
        category: 'attribute',
        description: 'Saturday.',
        syntax: 'workinghours sat <hours>',
        example: 'workinghours sat off'
    },
    'sun': {
        name: 'sun',
        category: 'attribute',
        description: 'Sunday.',
        syntax: 'workinghours sun <hours>',
        example: 'workinghours sun off'
    },
    'off': {
        name: 'off',
        category: 'attribute',
        description: 'Marks a day as non-working.',
        syntax: 'workinghours <day> off',
        example: 'workinghours sat off'
    },

    // ===== SELECTION & SORTING =====

    'tree': {
        name: 'tree',
        category: 'attribute',
        description: 'Tree sorting order.',
        syntax: 'sorttasks tree',
        example: 'sorttasks tree'
    },
    'up': {
        name: 'up',
        category: 'attribute',
        description: 'Ascending sort order.',
        syntax: 'sorttasks <field>.up',
        example: 'sorttasks start.up'
    },
    'down': {
        name: 'down',
        category: 'attribute',
        description: 'Descending sort order.',
        syntax: 'sorttasks <field>.down',
        example: 'sorttasks start.down'
    },

    // ===== LOGICAL OPERATORS =====

    'and': {
        name: 'and',
        category: 'function',
        description: 'Logical AND operator.',
        syntax: '<expr1> & <expr2>',
        example: 'select isleaf() & isactive()'
    },
    'or': {
        name: 'or',
        category: 'function',
        description: 'Logical OR operator.',
        syntax: '<expr1> | <expr2>',
        example: 'select ismilestone() | hasalert()'
    },
    'not': {
        name: 'not',
        category: 'function',
        description: 'Logical NOT operator.',
        syntax: '~<expr>',
        example: 'select ~isleaf()'
    },

    // ===== SCALE UNITS =====

    'minute': {
        name: 'minute',
        category: 'attribute',
        description: 'Minute scale unit.',
        syntax: 'scale minute',
        example: 'chart { scale minute }'
    },
    'hour': {
        name: 'hour',
        category: 'attribute',
        description: 'Hour scale unit.',
        syntax: 'scale hour',
        example: 'chart { scale hour }'
    },
    'day': {
        name: 'day',
        category: 'attribute',
        description: 'Day scale unit.',
        syntax: 'scale day',
        example: 'chart { scale day }'
    },
    'week': {
        name: 'week',
        category: 'attribute',
        description: 'Week scale unit.',
        syntax: 'scale week',
        example: 'chart { scale week }'
    },
    'month': {
        name: 'month',
        category: 'attribute',
        description: 'Month scale unit.',
        syntax: 'scale month',
        example: 'chart { scale month }'
    },
    'quarter': {
        name: 'quarter',
        category: 'attribute',
        description: 'Quarter scale unit.',
        syntax: 'scale quarter',
        example: 'chart { scale quarter }'
    },
    'year': {
        name: 'year',
        category: 'attribute',
        description: 'Year scale unit.',
        syntax: 'scale year',
        example: 'chart { scale year }'
    },

    // ===== REPORT FORMATTING =====

    'title': {
        name: 'title',
        category: 'attribute',
        description: 'Sets the title for a column or element.',
        syntax: 'title "<text>"',
        example: 'bsi { title "WBS" }'
    },
    'width': {
        name: 'width',
        category: 'attribute',
        description: 'Sets the width for a column or chart.',
        syntax: 'width <pixels>',
        example: 'chart { width 500 }'
    },
    'scale': {
        name: 'scale',
        category: 'attribute',
        description: 'Sets the time scale for a chart.',
        syntax: 'scale <unit>',
        example: 'chart { scale day }'
    },
    'balance': {
        name: 'balance',
        category: 'attribute',
        description: 'Computes balance for an account.',
        syntax: 'balance <account_id>',
        example: 'balance costs'
    },
    'aggregate': {
        name: 'aggregate',
        category: 'attribute',
        description: 'Specifies aggregation for values.',
        syntax: 'aggregate <method>',
        example: 'aggregate tasks'
    },
    'color': {
        name: 'color',
        category: 'attribute',
        description: 'Sets color for an element.',
        syntax: 'color "<color>"',
        example: 'color "#FF0000"'
    },
    'fontcolor': {
        name: 'fontcolor',
        category: 'attribute',
        description: 'Sets font color.',
        syntax: 'fontcolor "<color>"',
        example: 'fontcolor "#0000FF"'
    },
    'cellcolor': {
        name: 'cellcolor',
        category: 'attribute',
        description: 'Sets cell background color.',
        syntax: 'cellcolor <plan> "<color>"',
        example: 'cellcolor plan "#FFFF00"'
    },
    'celltext': {
        name: 'celltext',
        category: 'attribute',
        description: 'Sets cell text content.',
        syntax: 'celltext <plan> "<text>"',
        example: 'celltext plan "-"'
    },
    'halign': {
        name: 'halign',
        category: 'attribute',
        description: 'Sets horizontal alignment.',
        syntax: 'halign <alignment>',
        example: 'halign center'
    },
    'left': {
        name: 'left',
        category: 'attribute',
        description: 'Left alignment.',
        syntax: 'halign left',
        example: 'halign left'
    },
    'right': {
        name: 'right',
        category: 'attribute',
        description: 'Right alignment.',
        syntax: 'halign right',
        example: 'halign right'
    },
    'listtype': {
        name: 'listtype',
        category: 'attribute',
        description: 'Sets list formatting type.',
        syntax: 'listtype <type>',
        example: 'listtype bullets'
    },
    'bullets': {
        name: 'bullets',
        category: 'attribute',
        description: 'Bullet list type.',
        syntax: 'listtype bullets',
        example: 'listtype bullets'
    },
    'numbered': {
        name: 'numbered',
        category: 'attribute',
        description: 'Numbered list type.',
        syntax: 'listtype numbered',
        example: 'listtype numbered'
    },
    'comma': {
        name: 'comma',
        category: 'attribute',
        description: 'Comma-separated list type.',
        syntax: 'listtype comma',
        example: 'listtype comma'
    },
    'tooltip': {
        name: 'tooltip',
        category: 'attribute',
        description: 'Sets tooltip text.',
        syntax: 'tooltip "<text>"',
        example: 'tooltip "Click for details"'
    },

    // ===== INHERITANCE & REFERENCES =====

    'precedes': {
        name: 'precedes',
        category: 'attribute',
        description: 'Defines which tasks this task precedes.',
        syntax: 'precedes <task_id> [, ...]',
        example: 'precedes !implementation'
    },
    'follows': {
        name: 'follows',
        category: 'attribute',
        description: 'Defines which tasks this task follows.',
        syntax: 'follows <task_id> [, ...]',
        example: 'follows !design'
    },
    'inherit': {
        name: 'inherit',
        category: 'attribute',
        description: 'Inherits attributes from parent.',
        syntax: 'inherit <attribute>',
        example: 'inherit flags'
    }
};

export const completionItems: vscode.CompletionItem[] = Object.values(taskjugglerKeywords).map(keyword => {
    const item = new vscode.CompletionItem(keyword.name,
        keyword.category === 'property' ? vscode.CompletionItemKind.Class :
        keyword.category === 'attribute' ? vscode.CompletionItemKind.Property :
        keyword.category === 'function' ? vscode.CompletionItemKind.Function :
        keyword.category === 'column' ? vscode.CompletionItemKind.Field :
        vscode.CompletionItemKind.Module
    );

    // Add category prefix to detail to distinguish from snippets
    const categoryLabel =
        keyword.category === 'property' ? '[Property]' :
        keyword.category === 'attribute' ? '[Attribute]' :
        keyword.category === 'function' ? '[Function]' :
        keyword.category === 'column' ? '[Column]' :
        '[Keyword]';

    item.detail = `${categoryLabel} ${keyword.description}`;

    if (keyword.example) {
        item.documentation = new vscode.MarkdownString(`**Syntax:**\n\`\`\`taskjuggler\n${keyword.syntax || keyword.name}\n\`\`\`\n\n**Example:**\n\`\`\`taskjuggler\n${keyword.example}\n\`\`\``);
    }

    // Set sortText to make snippets appear first
    // Snippets have no sortText (implicitly ""), so we use "z" prefix to appear after them
    item.sortText = `z${keyword.name}`;

    // Insert only the keyword name (not a snippet)
    item.insertText = keyword.name;

    return item;
});
