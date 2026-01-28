# Change Log

All notable changes to the "taskjuggler-syntax" extension will be documented in this file.

**Author**: Fabrizio Vacca (fabrizio.vacca@gmail.com)

## [0.0.1] - 2026-01-28

### Added

#### Syntax Highlighting
- Complete syntax highlighting for TaskJuggler files (.tjp, .tji)
- Support for all TaskJuggler keywords and properties
- Highlighting for:
  - Properties (project, task, resource, account, shift, scenario, etc.)
  - Reports (taskreport, resourcereport, accountreport, etc.)
  - Attributes (allocate, depends, effort, duration, start, end, etc.)
  - Functions (isleaf, istask, ismilestone, hasalert, etc.)
  - Operators (logical, comparison, arithmetic)
  - Constants (projectstart, projectend, now, today, weekdays, etc.)
  - Dates and time formats
  - Numbers, percentages, and durations
  - Macros and environment variables
  - Comments (# and /* */)
  - Strings (double quotes, single quotes, and heredoc)

#### Snippets
- 40+ code snippets for rapid development:
  - **project** - Complete project template
  - **task** - Simple task definition
  - **task-effort** - Task with effort and allocation
  - **task-duration** - Task with duration
  - **task-full** - Complete task structure with subtasks
  - **milestone** - Milestone definition
  - **resource** - Resource definition
  - **resource-team** - Team of resources
  - **account** - Account definition
  - **account-full** - Complete account structure
  - **taskreport** - Task report template
  - **resourcereport** - Resource report template
  - **textreport** - Text report template
  - **export-csv** - CSV export configuration
  - **shift** - Work shift definition
  - **macro** - Macro definition
  - **journalentry** - Journal entry template
  - **booking** - Resource booking
  - **workinghours** - Working hours definition
  - **limits** - Resource limits
  - And many more single-line snippets (allocate, depends, flags, etc.)

#### Language Features
- Auto-closing brackets and quotes
- Smart indentation with increase/decrease rules
- Code folding support for:
  - Blocks delimited by { }
  - Custom region markers (#region / #endregion)
- Comment toggling (Ctrl/Cmd + /)
- Block comment support (/* ... */)
- Bracket matching and highlighting

#### File Support
- `.tjp` files (TaskJuggler Project)
- `.tji` files (TaskJuggler Include)
- Custom file icon for better visual recognition

### Features Compared to Vim/Emacs Modes

This VS Code extension provides a more user-friendly experience compared to traditional Vim and Emacs modes:

- **IntelliSense-ready**: Full integration with VS Code's autocomplete system
- **Visual snippets**: Tab-stop navigation through snippet placeholders
- **Modern UI**: Syntax highlighting with modern themes and color schemes
- **Better folding**: Visual fold indicators in the gutter
- **Integrated**: Works seamlessly with VS Code features (minimap, breadcrumbs, outline view)
- **Cross-platform**: Consistent experience on Windows, macOS, and Linux

## Future Enhancements

Planned features for future releases:
- Hover documentation for keywords and functions
- Go to definition for tasks, resources, and accounts
- Validation and error checking
- Task/resource outline view
- Integration with tj3 compiler
- Live preview of reports
