# TaskJuggler Best Practices in VS Code

**Author**: Fabrizio Vacca (fabrizio.vacca@gmail.com)

This guide covers recommended practices for writing maintainable TaskJuggler projects using the VS Code extension.

## Project Organization

### File Structure

Organize large projects with includes:

```taskjuggler
# main.tjp
project myproject "My Project" 2024-01-01 +6m

include "resources.tji"
include "tasks.tji"
include "reports.tji"
```

```taskjuggler
# resources.tji
resource team "Development Team" {
  include "team-backend.tji"
  include "team-frontend.tji"
}
```

**Benefits:**
- Easier to navigate in VS Code explorer
- Better code folding organization
- Team collaboration friendly (less merge conflicts)
- Reusable components

### Naming Conventions

Use consistent, meaningful IDs:

```taskjuggler
# Good
task backend_api "Backend API Development"
task frontend_ui "Frontend UI Development"
resource dev_john "John Smith"

# Avoid
task t1 "Task 1"
task thing "Some thing"
resource r1 "Resource"
```

**Tip:** Use the snippet tab-stops to enforce naming patterns in your team.

## Code Style

### Indentation

Use **tabs** for indentation (default in extension):

```taskjuggler
task parent "Parent Task" {
	task child "Child Task" {
		effort 5d
		allocate resource1
	}
}
```

**VS Code Setting:**
```json
"[taskjuggler]": {
  "editor.insertSpaces": false,
  "editor.tabSize": 4
}
```

### Comments

Use comments liberally:

```taskjuggler
# === PHASE 1: Requirements ===
# Duration: 2 weeks
# Owner: Product Team
task requirements "Requirements Phase" {
	# Gather initial requirements from stakeholders
	task gathering "Requirements Gathering" {
		effort 5d
		allocate po, pm
	}

	# Document and validate requirements
	task documentation "Requirements Documentation" {
		effort 3d
		depends !gathering
	}
}
```

### Spacing

Add blank lines between major sections:

```taskjuggler
# Good
task phase1 "Phase 1" {
	effort 10d
}

task phase2 "Phase 2" {
	effort 15d
}


# Cramped
task phase1 "Phase 1" {
	effort 10d
}
task phase2 "Phase 2" {
	effort 15d
}
```

## Effective Use of Snippets

### Custom Workflow

Create project-specific snippets for your team:

1. Open User Snippets: Cmd/Ctrl + Shift + P → "Configure User Snippets" → "taskjuggler"
2. Add your team's patterns:

```json
{
  "Company Task": {
    "prefix": "ctask",
    "body": [
      "task ${1:id} \"${2:name}\" {",
      "\tpriority ${3:500}",
      "\teffort ${4:5}d",
      "\tallocate ${5:resource}",
      "\taccount dev.${6:backend}",
      "\tflags ${7:critical}",
      "\t$0",
      "}"
    ]
  }
}
```

### Snippet Chaining

Use snippets inside snippets:

1. Type `task-full` → Tab
2. Inside the task, type `allocate` → Tab
3. Type `depends` → Tab

## Code Folding Strategies

### Region Markers

Use region markers for logical sections:

```taskjuggler
# #region Resources
resource backend_team "Backend Team" {
	# ...
}

resource frontend_team "Frontend Team" {
	# ...
}
# #endregion

# #region Tasks - Phase 1
task phase1 "Phase 1" {
	# ...
}
# #endregion
```

Fold/unfold with Cmd/Ctrl + K, Cmd/Ctrl + 0-9

### Natural Folding

The extension automatically folds on `{...}` blocks:

```taskjuggler
task project "Project" {          # ← Click arrow to fold
	task phase1 "Phase 1" {        # ← Nested folds
		task task1 "Task 1" {
			effort 5d
		}
	}
}
```

## Macros Best Practices

### Reusable Allocations

```taskjuggler
# Define once
macro allocate_core_team [
	allocate dev1, dev2, dev3
]

# Use everywhere
task backend {
	${allocate_core_team}
	effort 20d
}

task frontend {
	${allocate_core_team}
	effort 15d
}
```

### Parameterized Macros

```taskjuggler
macro sprint_task [
	effort ${1}d
	allocate ${2}
	flags sprint_${3}
]

task story1 {
	${sprint_task 5 dev1 1}
}

task story2 {
	${sprint_task 3 dev2 1}
}
```

## Dependencies Management

### Clear Dependency Chains

```taskjuggler
# Good: Clear, traceable
task design "Design" {
	effort 5d
}

task backend "Backend" {
	depends !design
	effort 15d
}

task frontend "Frontend" {
	depends !design
	effort 12d
}

task integration "Integration" {
	depends !backend, !frontend
	effort 5d
}
```

### Avoid Circular Dependencies

Use VS Code's problem matcher (if configured) to catch these.

## Performance Tips

### Large Projects

For projects with 100+ tasks:

1. Use includes to split files
2. Fold completed phases
3. Use search (Cmd/Ctrl + F) instead of scrolling
4. Filter reports with `hidetask` and `hideresource`

### Quick Navigation

- **Go to Symbol**: Cmd/Ctrl + Shift + O → Find tasks/resources
- **Go to Line**: Cmd/Ctrl + G → Jump to line number
- **Breadcrumbs**: Enable breadcrumbs to see context
- **Minimap**: Keep minimap enabled for overview

## Version Control

### Git Best Practices

`.gitignore`:
```
# Generated reports
*.html
*.csv
*.xml
reports/

# Backup files
*.tjp~
*.tji~
.*.swp

# OS files
.DS_Store
Thumbs.db
```

### Commit Messages

```bash
# Good commits
git commit -m "Add Q2 2024 tasks"
git commit -m "Update resource rates for 2024"
git commit -m "Fix dependency chain in Phase 2"

# Avoid
git commit -m "Update"
git commit -m "Changes"
```

## Validation Workflow

### Before Committing

1. **Check syntax**: Run `TaskJuggler: Check Syntax` task
2. **Compile**: Run `TaskJuggler: Compile Project` task
3. **Review reports**: Verify generated HTML/CSV reports
4. **Check warnings**: Address all warnings in output

### CI/CD Integration

Example GitHub Actions:

```yaml
# .github/workflows/validate.yml
name: Validate TaskJuggler

on: [push, pull_request]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install TaskJuggler
        run: sudo gem install taskjuggler
      - name: Validate syntax
        run: tj3 --check-syntax project.tjp
      - name: Generate reports
        run: tj3 project.tjp
```

## Team Collaboration

### Style Guide Document

Create a `STYLE.md` for your team:

```markdown
# TaskJuggler Style Guide

- Use tabs, not spaces
- Prefix all task IDs with phase name (e.g., `phase1_task1`)
- Always include effort or duration
- Document major decisions with journal entries
- Run syntax check before committing
```

### Code Reviews

In pull requests, review:
- [ ] Naming conventions followed
- [ ] Dependencies make sense
- [ ] Resource allocations realistic
- [ ] No syntax errors
- [ ] Reports generate successfully

## Keyboard Shortcuts Mastery

Recommended shortcuts (add to `keybindings.json`):

```json
{
  "key": "ctrl+alt+c",
  "command": "workbench.action.tasks.runTask",
  "args": "TaskJuggler: Compile Project"
}
```

See `.vscode/keybindings.json.example` for more.

## Advanced Features

### Multi-cursor Editing

Select multiple similar task IDs:
1. Select an ID
2. Press Cmd/Ctrl + D repeatedly to select next occurrence
3. Edit all at once

### Search and Replace

Use regex search (Cmd/Ctrl + Shift + F) to update patterns:

```regex
# Find: all 5-day tasks
effort 5d

# Replace with 3-day tasks
effort 3d
```

## Resources

- [TaskJuggler Manual](https://taskjuggler.org/tj3/manual/index.html)
- [VS Code Tips](https://code.visualstudio.com/docs/getstarted/tips-and-tricks)
- Extension [README](README.md) and [CHANGELOG](CHANGELOG.md)

---

**Happy TaskJuggling!** 🎯
