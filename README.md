# TaskJuggler Language Support for VS Code

> Complete language support for TaskJuggler project management files

[![Version](https://img.shields.io/badge/version-0.0.1-blue.svg)](https://github.com/il-sommo/taskjuggler-vscode)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.60%2B-blue.svg)](https://code.visualstudio.com/)
[![TaskJuggler](https://img.shields.io/badge/TaskJuggler-3.x-orange.svg)](https://taskjuggler.org)

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Syntax Highlighting](#syntax-highlighting)
- [Code Snippets](#code-snippets)
- [IntelliSense & AI](#intellisense--ai)
- [Example Project](#example-project)
- [Build System](#build-system)
- [Documentation](#documentation)
- [Requirements](#requirements)
- [Extension Settings](#extension-settings)
- [Keyboard Shortcuts](#keyboard-shortcuts)
- [Contributing](#contributing)
- [License](#license)
- [Support](#support)

## Features

🎨 **Comprehensive Syntax Highlighting** - Full color-coding for all TaskJuggler language constructs

⚡ **40+ Smart Snippets** - Rapid development with intelligent code completion

📁 **Multi-file Projects** - Support for `.tjp` main files and `.tji` includes

🔧 **IntelliSense Integration** - Context-aware suggestions and completions

🤖 **AI Extension Compatible** - Works with GitHub Copilot and other AI assistants

📐 **Code Folding** - Visual block folding and region markers

---

## Quick Start

### Installation

#### Via Git Clone
```bash
git clone https://github.com/il-sommo/taskjuggler-vscode.git
cd taskjuggler-vscode
make install
```

#### Via Install Script
```bash
# macOS/Linux
./scripts/install.sh

# Windows (PowerShell)
.\scripts\install.ps1
```

### Usage

1. **Restart VS Code** after installation
2. **Open** any `.tjp` or `.tji` file
3. **Start typing** - syntax highlighting is automatic
4. **Try snippets** - type `project` + Tab

---

## Syntax Highlighting

The extension provides complete color-coding for:

- **Properties**: `project`, `task`, `resource`, `account`, `shift`, `scenario`
- **Reports**: `taskreport`, `resourcereport`, `accountreport`, `textreport`
- **Attributes**: `allocate`, `depends`, `effort`, `start`, `end`, `priority` (90+)
- **Functions**: `isleaf()`, `istask()`, `ismilestone()`, `hasalert()`
- **Operators**: Logical (`&`, `|`, `~`), comparison, arithmetic
- **Constants**: `projectstart`, `projectend`, weekdays, formats
- **Data Types**: Dates, durations, numbers, percentages, colors
- **Comments**: Line (`#`) and block (`/* */`)
- **Macros**: `${...}` and `$(...)` variables

---

## Code Snippets

Type a prefix and press **Tab** to insert:

### Project Structure
- `project` - Complete project template
- `scenario` - Scenario definition
- `macro` - Reusable macro

### Tasks
- `task` - Simple task
- `task-effort` - Task with effort
- `task-full` - Complete task with subtasks
- `milestone` - Milestone task

### Resources
- `resource` - Resource definition
- `resource-team` - Team structure
- `shift` - Work shift

### Reports
- `taskreport` - Task report
- `resourcereport` - Resource report
- `textreport` - Text/HTML report

[View all 40+ snippets →](docs/FEATURES.md#snippets)

---

## IntelliSense & AI

The extension integrates seamlessly with VS Code's IntelliSense:

- **Auto-completion**: Ctrl/Cmd + Space for suggestions
- **Parameter navigation**: Tab through snippet placeholders
- **Context-aware**: Snippets appear in appropriate contexts

**AI Extension Compatibility:**
- ✅ GitHub Copilot
- ✅ TabNine
- ✅ IntelliCode

---

## Example Project

A complete, modular TaskJuggler project is included in `test-project/`:

```
test-project/
├── project.tjp              # Main project file
├── includes/
│   ├── config.tji           # Configuration & macros
│   ├── resources.tji        # Team structure
│   ├── tasks.tji            # Work breakdown
│   └── reports.tji          # Report definitions
└── reports/                 # Generated HTML/CSV
```

**Compile the example:**
```bash
make compile-test
make view-reports
```

---

## Build System

Comprehensive Makefile for development:

```bash
make help           # Show all commands
make install        # Install extension
make test           # Test with example
make compile-test   # Compile test project
make package        # Create VSIX package
make clean          # Remove artifacts
```

---

## Documentation

- **[Quick Start](QUICKSTART.md)** - Get started in 5 minutes
- **[Features](docs/FEATURES.md)** - Complete feature list
- **[Best Practices](docs/BEST-PRACTICES.md)** - Advanced tips
- **[Testing Guide](docs/TESTING.md)** - Testing checklist
- **[Installation](docs/INSTALL.md)** - Detailed installation
- **[Changelog](CHANGELOG.md)** - Version history

---

## Requirements

- **VS Code**: 1.60 or higher
- **TaskJuggler**: 3.x (for compiling projects)

### Installing TaskJuggler

```bash
# macOS
brew install taskjuggler

# Or via RubyGems
gem install taskjuggler
```

---

## Extension Settings

Recommended VS Code settings for TaskJuggler files:

```json
{
  "[taskjuggler]": {
    "editor.tabSize": 4,
    "editor.insertSpaces": false,
    "editor.formatOnSave": false
  }
}
```

[View complete settings →](.vscode/settings.json.example)

---

## Keyboard Shortcuts

Suggested shortcuts (add to your `keybindings.json`):

- **Compile**: Ctrl+Shift+B
- **Check syntax**: Ctrl+Shift+C
- **Insert task**: Ctrl+Alt+T
- **Insert resource**: Ctrl+Alt+R

[View all shortcuts →](.vscode/keybindings.json.example)

---

## Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development

```bash
# Clone repository
git clone https://github.com/il-sommo/taskjuggler-vscode.git
cd taskjuggler-vscode

# Install dependencies
make deps

# Make changes to:
# - syntaxes/taskjuggler.tmLanguage.json (syntax)
# - snippets/taskjuggler.json (snippets)
# - language-configuration.json (language features)

# Validate changes
make validate

# Test locally
make reinstall

# Create package
make package
```

---

## License

[MIT License](LICENSE) - Copyright (c) 2026 Fabrizio Vacca

---

## Credits

**Developer**: Fabrizio Vacca
**Email**: fabrizio.vacca@gmail.com

**Inspired by:**
- [TaskJuggler Official Tutorial](https://github.com/taskjuggler/TaskJuggler/tree/master/examples/Tutorial)
- [vim-taskjuggler](https://github.com/kalafut/vim-taskjuggler)
- [taskjuggler-mode.el](https://github.com/ska2342/taskjuggler-mode.el)

**TaskJuggler**: [taskjuggler.org](https://taskjuggler.org)

---

## Support

- 🐛 **Bug reports**: [GitHub Issues](https://github.com/il-sommo/taskjuggler-vscode/issues)
- 💡 **Feature requests**: [GitHub Issues](https://github.com/il-sommo/taskjuggler-vscode/issues)
- 📚 **Documentation**: [Wiki](https://github.com/il-sommo/taskjuggler-vscode/wiki)

---

**Made with ❤️ for the TaskJuggler community**
