# TaskJuggler Test Project - Accounting Software

A modular TaskJuggler project based on the official tutorial, demonstrating best practices with include files.

## Project Structure

```
test-project/
├── project.tjp              # Main project file
├── includes/
│   ├── config.tji           # Global configuration and macros
│   ├── resources.tji        # Resource definitions
│   ├── tasks.tji            # Task hierarchy and WBS
│   └── reports.tji          # Report definitions
└── reports/                 # Generated HTML/CSV reports
```

## Features Demonstrated

### Modular Architecture
- **Separated concerns**: Configuration, resources, tasks, and reports in distinct files
- **Include directives**: Uses `include` to compose the project
- **Reusable macros**: Macro definitions for common patterns

### TaskJuggler Syntax
- **Project setup**: Timezone, scenarios, formats
- **Resources**: Hierarchical team structure with rates and limits
- **Tasks**: Complete work breakdown structure with dependencies
- **Reports**: Multiple report types (HTML, CSV)

### File Types
- `.tjp` - Main project file
- `.tji` - Include files (config, resources, tasks, reports)

## Compiling

### Prerequisites
TaskJuggler 3.x must be installed:
```bash
# macOS
brew install taskjuggler

# Or via RubyGems
gem install taskjuggler
```

### Build
```bash
# From test-project directory
tj3 project.tjp

# Or from project root using Make
make compile-test
```

### Output
Reports are generated as:
- `Overview.html` - Project Gantt chart
- `Milestones.html` - Milestone list
- `Development.html` - Development tasks
- `Resources.html` - Resource allocation
- `ResourceGraph.html` - Resource graph
- `Status.html` - Complete status report
- `Tasks CSV.csv` - CSV export

### View Reports
```bash
# macOS
open reports/Status.html

# Linux
xdg-open reports/Status.html

# Or using Make
make view-reports
```

## Project Details

- **Name**: Accounting Software (acso)
- **Duration**: 4 months
- **Start**: 2024-01-16
- **Team**: 1 manager + 3 developers + 2 specialists
- **Scenarios**: Plan and Delayed

### Tasks
1. Specification (20 days)
2. Software Development
   - Database coupling (20 days)
   - GUI (35 days)
   - Back-end (30 days)
3. Testing (Alpha + Beta)
4. Manual (10 weeks)
5. Deliveries (5 milestones)

## VS Code Integration

This project demonstrates the TaskJuggler VS Code extension features:

### Syntax Highlighting
- All keywords are color-coded
- Comments, strings, numbers highlighted
- Macros and variables recognized

### Code Folding
- Fold resource groups
- Fold task hierarchies
- Fold report definitions

### Snippets
Try these in a new .tjp file:
- `project` + Tab
- `task` + Tab
- `resource` + Tab
- `taskreport` + Tab

## Customization

Feel free to modify:
- Add more resources in `includes/resources.tji`
- Extend tasks in `includes/tasks.tji`
- Create new reports in `includes/reports.tji`
- Add macros in `includes/config.tji`

## Troubleshooting

### Compilation Errors
- Check all braces `{}` match
- Verify date formats (YYYY-MM-DD)
- Ensure task dependencies exist
- Check resource allocations

### Missing Reports
- Verify formats are specified
- Check report names are unique
- Ensure no syntax errors

## Resources

- [TaskJuggler Official Tutorial](https://taskjuggler.org/tj3/manual/Tutorial.html)
- [Syntax Reference](https://taskjuggler.org/manual/The_TaskJuggler_Syntax.html)
- [VS Code Extension](../README.md)

## Credits

**Modularized by**: Fabrizio Vacca (fabrizio.vacca@gmail.com)

This project is **inspired by and based on** the official TaskJuggler tutorial:
- **Source**: https://github.com/taskjuggler/TaskJuggler/tree/master/examples/Tutorial
- **Adapted**: Modularized with include files for VS Code extension demonstration
- **License**: Same as TaskJuggler (GPL v2)

---

**This project compiles successfully with TaskJuggler 3.8.4**
