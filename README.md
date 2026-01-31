# TaskJuggler Language Support for VS Code

> Complete language support for TaskJuggler 3.x project management files

[![Version](https://img.shields.io/badge/version-0.3.0-blue.svg)](https://github.com/il-sommo/taskjuggler-vscode)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![VS Code](https://img.shields.io/badge/VS%20Code-1.108%2B-blue.svg)](https://code.visualstudio.com/)
[![TaskJuggler](https://img.shields.io/badge/TaskJuggler-3.x-orange.svg)](https://taskjuggler.org)

## Features

### Core Features
- 🎨 **Complete Syntax Highlighting** - Full color-coding for all TaskJuggler constructs
- ⚡ **88 Smart Snippets** - Rapid development with tab completion
- 🗓️ **Dynamic Dates** - Snippets auto-update with today's date
- 📐 **Code Folding** - Visual block folding and region markers

### IntelliSense (v0.3.0)
- 🔧 **Context-Aware Completions** - Only relevant attributes based on current block
- 💡 **Parameter Hints** - Signature help while typing (effort, allocate, depends, etc.)
- 📅 **Smart Date Suggestions** - Quick dates (today, tomorrow, next week)
- 🚀 **Quick Start Templates** - Auto-templates for empty files
- 🎯 **Go-to-Definition** - Navigate to task/resource definitions
- 150+ **Keyword Documentation** - Hover tooltips with syntax and examples

### Compatibility
- 📁 Multi-file projects (`.tjp`, `.tji`)
- 🤖 AI assistants (GitHub Copilot, etc.)

## Quick Start

### Installation

```bash
# From marketplace
ext install fabrizio-vacca.taskjuggler-syntax

# Or from source
git clone https://github.com/il-sommo/taskjuggler-vscode.git
cd taskjuggler-vscode
make install
```

### Usage

1. Open any `.tjp` or `.tji` file
2. Start typing - syntax highlighting automatic
3. Try `project` + Tab for a full template
4. Inside blocks, get context-aware completions

## Snippets

All snippets use **dynamic dates** - always current, never outdated.

**Project & Structure**:
- `project` - Complete project with resources, tasks, reports
- `task` - Task definition
- `resource` - Resource definition
- `milestone` - Milestone task

**Scheduling**:
- `effort` - Work effort (5d, 2w, etc.)
- `duration` - Calendar duration
- `depends` - Task dependencies
- `allocate` - Resource allocation

**Time Constraints**:
- `start`, `end` - Date constraints (auto-filled with today)
- `minstart`, `maxend` - Min/max constraints
- `vacation` - Vacation periods (defaults to August)

**Reports**:
- `taskreport`, `resourcereport` - HTML/CSV reports
- `period` - Report period (today → year-end)

[View all 88 snippets →](docs/FEATURES.md#snippets)

## Context-Aware IntelliSense

The extension understands **where you are** in the document:

```taskjuggler
task development "Development" {
    # Type here → get ONLY task attributes
    # effort, allocate, depends, start, end...
}

resource john "John Doe" {
    # Type here → get ONLY resource attributes
    # rate, efficiency, limits, email...
}
```

**Smart features**:
- ✅ Filters out already-used attributes
- ✅ Shows parameter hints while typing
- ✅ Suggests dates (today, tomorrow, etc.)
- ✅ Completes task/resource references

## Documentation

- **[Installation Guide](docs/INSTALL.md)** - Detailed setup instructions
- **[Features Overview](docs/FEATURES.md)** - Complete feature list
- **[Best Practices](docs/BEST-PRACTICES.md)** - TaskJuggler tips & patterns
- **[Testing Guide](docs/TESTING.md)** - Run tests and contribute
- **[Contributing](docs/CONTRIBUTING.md)** - Contribution guidelines
- **[Roadmap](docs/ROADMAP.md)** - Development roadmap to v1.0.0

## Example Project

A complete example project is included in `test-project/`:

```bash
cd test-project
make compile    # Compile with tj3
make view       # Open reports
make clean      # Remove generated files
```

## Requirements

- **VS Code**: 1.108.0 or higher
- **TaskJuggler** (optional): For compiling `.tjp` files
  ```bash
  # macOS
  brew install taskjuggler

  # Ubuntu/Debian
  sudo apt-get install taskjuggler3
  ```

## Extension Settings

Currently no configuration needed - works out of the box!

Future settings:
- `taskjuggler.compiler.path` - Path to tj3 compiler
- `taskjuggler.validation.enabled` - Enable real-time validation

## Keyboard Shortcuts

- `Ctrl+Space` - Trigger IntelliSense
- `Ctrl+Shift+Space` - Show parameter hints
- `F12` - Go to definition
- `Tab` - Complete snippet

## What's New in v0.3.0

🎉 **Major Update: Context-Aware Intelligence**

- ✅ Smart completions based on block type
- ✅ Parameter hints for all major attributes
- ✅ Date suggestions (today, tomorrow, next week)
- ✅ Quick start templates for empty files
- ✅ Dynamic dates in all snippets
- ✅ 150+ keywords documented

[Full Changelog →](CHANGELOG.md)

## Roadmap

- **v0.4.0** - Real-time validation & diagnostics
- **v0.5.0** - Rename refactoring, find references
- **v0.6.0** - Code actions, formatting
- **v1.0.0** - tj3 compiler integration, live preview

## Contributing

Contributions welcome! See [CONTRIBUTING.md](docs/CONTRIBUTING.md).

```bash
# Setup
git clone https://github.com/il-sommo/taskjuggler-vscode.git
cd taskjuggler-vscode
npm install

# Develop
npm run compile
npm run watch     # Watch mode
npm test          # Run tests

# Package
make package
```

## Support

- 🐛 **Issues**: [GitHub Issues](https://github.com/il-sommo/taskjuggler-vscode/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/il-sommo/taskjuggler-vscode/discussions)
- 📧 **Email**: fabrizio.vacca@gmail.com

## License

MIT © [Fabrizio Vacca](https://github.com/il-sommo)

## Acknowledgments

- **TaskJuggler** project for the excellent project management tool
- **VS Code** team for the extension API
- All contributors and users

---

**Made with ❤️ for project managers and developers**

