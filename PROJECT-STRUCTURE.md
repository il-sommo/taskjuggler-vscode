# TaskJuggler VS Code Extension - Project Structure

**Author**: Fabrizio Vacca (fabrizio.vacca@gmail.com)

```
taskjuggler-vscode/
│
├── .github/                      # GitHub configuration
│   └── ISSUE_TEMPLATE/           # Issue templates
│       ├── bug_report.md         # Bug report template
│       └── feature_request.md    # Feature request template
│
├── .vscode/                      # VS Code workspace settings
│   ├── settings.json.example     # Recommended settings
│   ├── tasks.json.example        # Build tasks
│   └── keybindings.json.example  # Keyboard shortcuts
│
├── docs/                         # Documentation
│   ├── BEST-PRACTICES.md         # Best practices guide
│   ├── FEATURES.md               # Complete feature list
│   ├── INSTALL.md                # Installation guide
│   └── TESTING.md                # Testing checklist
│
├── images/                       # Visual assets
│   ├── icon.png                  # Extension icon (128x128)
│   ├── icon.png.svg              # Icon source
│   └── file-icon.svg             # File type icon
│
├── scripts/                      # Installation scripts
│   ├── install.sh                # macOS/Linux installer
│   └── install.ps1               # Windows PowerShell installer
│
├── snippets/                     # Code snippets
│   └── taskjuggler.json          # 40+ TaskJuggler snippets
│
├── syntaxes/                     # Syntax highlighting
│   └── taskjuggler.tmLanguage.json  # TextMate grammar
│
├── test-project/                 # Complete example project
│   ├── includes/                 # Modular project files
│   │   ├── config.tji            # Configuration & macros
│   │   ├── resources.tji         # Team structure
│   │   ├── tasks.tji             # Work breakdown
│   │   └── reports.tji           # Report definitions
│   ├── reports/                  # Generated reports (HTML/CSV)
│   ├── project.tjp               # Main project file
│   └── README.md                 # Project documentation
│
├── .editorconfig                 # Editor configuration
├── .gitignore                    # Git ignore patterns
├── .vscodeignore                 # VSIX package exclusions
│
├── CHANGELOG.md                  # Version history
├── CONTRIBUTING.md               # Contribution guidelines
├── DEPLOYMENT.md                 # Deployment guide
├── language-configuration.json   # Language features config
├── LICENSE                       # MIT License
├── Makefile                      # Build system
├── package.json                  # Extension manifest
├── PROJECT-STRUCTURE.md          # This file
├── QUICKSTART.md                 # Quick start guide
└── README.md                     # Main documentation
```

## Directory Purposes

### Core Extension Files
- `syntaxes/` - TextMate grammar for syntax highlighting
- `snippets/` - Code completion snippets
- `images/` - Extension and file icons
- `language-configuration.json` - Brackets, comments, folding
- `package.json` - Extension manifest

### Development & Build
- `Makefile` - Build system (install, test, package, clean)
- `scripts/` - Installation automation
- `.vscode/` - Workspace configuration examples

### Documentation
- `README.md` - Main user guide
- `QUICKSTART.md` - 5-minute getting started
- `CHANGELOG.md` - Version history
- `CONTRIBUTING.md` - Contribution guidelines
- `docs/` - Detailed documentation

### Testing
- `test-project/` - Complete modular project
  - Demonstrates all features
  - Compiles with TaskJuggler 3.x
  - Generates HTML/CSV reports

### GitHub
- `.github/ISSUE_TEMPLATE/` - Issue templates
  - Bug reports
  - Feature requests

## File Count by Type

- **Core extension**: 4 files (grammar, snippets, config, manifest)
- **Documentation**: 8 files (README, QUICKSTART, CHANGELOG, CONTRIBUTING, DEPLOYMENT, PROJECT-STRUCTURE, + docs/)
- **Build system**: 1 Makefile + 2 install scripts
- **Test project**: 6 files (.tjp + .tji includes)
- **Configuration**: 6 files (editor, git, vscode)
- **GitHub**: 2 templates

**Total**: ~28 files (excluding generated reports)

## Clean Structure Principles

1. **Separation of concerns**: Each directory has a clear purpose
2. **Documentation**: Well-documented with examples
3. **Build automation**: Makefile for all operations
4. **Test project**: Real-world modular example
5. **GitHub-ready**: Issue templates, contribution guide
6. **No redundancy**: Only `test-project/`, no duplicate examples

---

**Last Updated**: 2026-01-28
**Version**: 0.0.1
