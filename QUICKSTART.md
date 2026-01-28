# TaskJuggler VS Code Extension - Quick Start Guide

> **Author**: Fabrizio Vacca (fabrizio.vacca@gmail.com)

Get up and running with TaskJuggler in VS Code in just a few minutes!

## Installation

### Method 1: Clone and Install
```bash
git clone https://github.com/fabriziovacca/taskjuggler-vscode.git
cd taskjuggler-vscode
make install
```

### Method 2: Install Script
```bash
# macOS/Linux
./scripts/install.sh

# Windows PowerShell
.\scripts\install.ps1
```

Then **restart VS Code**.

## Your First TaskJuggler Project

### Step 1: Create a New File

1. Create a new file called `myproject.tjp`
2. VS Code will automatically recognize it as a TaskJuggler file

### Step 2: Start with a Project Template

Type `project` and press **Tab**. You'll see:

```taskjuggler
project project_id "Project Name" 2024-01-01 +6m {
	timezone "UTC"
	timeformat "%Y-%m-%d"
	numberformat "-" "" "," "." 1
	currencyformat "(" ")" "," "." 0
	currency "USD"

	scenario plan "Plan" {
		scenario actual "Actual"
	}
	█  # cursor here
}
```

Press **Tab** to navigate between fields. Fill in:
- `project_id` → your project identifier (e.g., `myapp`)
- `"Project Name"` → descriptive name (e.g., `"My Application"`)
- Date → project start date
- Duration → project duration (e.g., `+6m` for 6 months)

### Step 3: Add Resources

Below the project block, type `resource-team` and press **Tab**:

```taskjuggler
resource team_id "Team Name" {
	resource member1 "Member 1" {
		rate 400.0
	}
	resource member2 "Member 2" {
		rate 450.0
	}
	█
}
```

### Step 4: Add Tasks

Type `task-effort` and press **Tab**:

```taskjuggler
task task_id "Task Name" {
	effort 5d
	allocate resource
	█
}
```

### Step 5: Add a Report

Type `taskreport` and press **Tab**:

```taskjuggler
taskreport report_id "Report Title" {
	formats html
	columns bsi { title 'WBS' },
	        name,
	        start,
	        end,
	        effort { title "Work" },
	        chart { scale day width 500 }

	loadunit days
	caption 'Report description'
	█
}
```

## Essential Snippets Cheat Sheet

| Type this | Press Tab | You get |
|-----------|-----------|---------|
| `project` | ⇥ | Full project template |
| `task` | ⇥ | Simple task |
| `task-effort` | ⇥ | Task with effort |
| `milestone` | ⇥ | Milestone task |
| `resource` | ⇥ | Single resource |
| `resource-team` | ⇥ | Resource team |
| `taskreport` | ⇥ | Task report |
| `depends` | ⇥ | Task dependency |
| `allocate` | ⇥ | Resource allocation |
| `shift` | ⇥ | Work shift |

## Complete Example

Here's a minimal working project:

```taskjuggler
project app "Mobile App" 2024-01-15 +3m {
  timezone "UTC"
}

# Resources
resource dev "John Doe" {
  email "john@example.com"
  rate 500.0
}

# Tasks
task design "Design Phase" {
  effort 5d
  allocate dev
}

task development "Development" {
  effort 20d
  depends !design
  allocate dev
}

task testing "Testing" {
  effort 10d
  depends !development
  allocate dev
}

# Report
taskreport overview "" {
  formats html
  columns name, start, end, effort, chart
}
```

Save this as `quickstart.tjp` and compile with:
```bash
tj3 quickstart.tjp
```

## Tips & Tricks

### 1. Comments
```taskjuggler
# Single line comment
/* Multi-line
   comment */
```

### 2. Code Folding
Click the arrows in the gutter or use:
- **Fold**: Ctrl/Cmd + Shift + [
- **Unfold**: Ctrl/Cmd + Shift + ]

### 3. Navigate Snippets
- **Tab** → Next placeholder
- **Shift + Tab** → Previous placeholder
- **Escape** → Exit snippet mode

### 4. Quick Comment Toggle
Select lines and press **Ctrl/Cmd + /**

### 5. IntelliSense
Press **Ctrl + Space** to see all available snippets

## Common Patterns

### Task with Dependencies
```taskjuggler
task backend "Backend" {
  effort 15d
  allocate dev1
}

task frontend "Frontend" {
  effort 12d
  depends !backend  # Wait for backend
  allocate dev2
}
```

### Resource Limits
```taskjuggler
resource dev "Developer" {
  rate 400.0
  limits {
    dailymax 8h
    weeklymax 40h
  }
}
```

### Milestone
```taskjuggler
task launch "Product Launch" {
  milestone
  start 2024-06-01
}
```

### Nested Tasks
```taskjuggler
task phase1 "Phase 1" {
  task subtask1 "Subtask 1" {
    effort 5d
  }
  task subtask2 "Subtask 2" {
    effort 3d
    depends !subtask1
  }
}
```

## Next Steps

- Check out the `test-project/` directory for a comprehensive modular example
- Read the full [README.md](README.md) for all features
- Visit [TaskJuggler.org](https://taskjuggler.org) for documentation
- Try the [TaskJuggler Tutorial](https://taskjuggler.org/tj3/manual/Tutorial.html)

## Getting Help

- **VS Code Command Palette**: Ctrl/Cmd + Shift + P
- **Show All Snippets**: Type snippet prefix + Ctrl + Space
- **TaskJuggler Syntax**: Use `tj3man <keyword>` in terminal

Happy project planning! 🚀
