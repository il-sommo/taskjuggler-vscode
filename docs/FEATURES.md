# TaskJuggler VS Code Extension - Complete Feature List

## 📦 Package Contents

### Core Files
- **package.json** - Extension manifest with complete configuration
- **language-configuration.json** - Language features (comments, brackets, folding)
- **LICENSE** - MIT License
- **.editorconfig** - Editor configuration for consistent formatting
- **.gitignore** - Git ignore patterns
- **.vscodeignore** - Files to exclude from VSIX package

### Syntax & Highlighting
- **syntaxes/taskjuggler.tmLanguage.json** - Complete TextMate grammar with:
  - 100+ keywords and properties
  - All report types
  - Built-in functions
  - Operators (logical, comparison, arithmetic, dependency)
  - Constants (dates, numbers, colors, weekdays, etc.)
  - String support (quotes and heredoc)
  - Comment highlighting (# and /* */)
  - Macro and environment variable recognition

### Code Snippets
- **snippets/taskjuggler.json** - 40+ intelligent snippets:
  - Project templates
  - Task variations (simple, effort, duration, full, milestone)
  - Resource definitions (single, team)
  - Account structures
  - Report templates (task, resource, account, text)
  - Shift and schedule definitions
  - Journal entries
  - All common attributes

### Visual Assets
- **images/icon.png** - Extension icon (128x128)
- **images/file-icon.svg** - File type icon (for .tjp files)
- **images/icon.png.svg** - Source SVG for icon

### Documentation
- **README.md** - Comprehensive user guide
- **CHANGELOG.md** - Version history and features
- **QUICKSTART.md** - Quick start guide for beginners
- **INSTALL.md** - Detailed installation instructions
- **BEST-PRACTICES.md** - Best practices and advanced tips
- **FEATURES.md** - This file (complete feature list)

### Test Project
- **test-project/** - Comprehensive modular project showcasing all features:
  - Complete project structure with includes
  - Macros and configuration
  - Resource hierarchy with teams
  - Shift definitions
  - Complex task dependencies
  - Multiple report types (HTML and CSV)
  - Based on official TaskJuggler tutorial
  - Successfully compiles with tj3

### Installation Scripts
- **scripts/install.sh** - Automated installation for macOS/Linux
- **scripts/install.ps1** - Automated installation for Windows PowerShell

### Configuration Examples
- **.vscode/settings.json.example** - Recommended VS Code settings
- **.vscode/tasks.json.example** - Build tasks for tj3 compiler
- **.vscode/keybindings.json.example** - Suggested keyboard shortcuts

## 🎨 Syntax Highlighting Features

### Properties (Main Declarations)
- `project`, `task`, `resource`, `account`, `shift`, `scenario`
- `macro`, `include`, `supplement`, `extend`, `export`
- `flags`, `copyright`, `timezone`, `trackingscenario`

### Report Types
- `taskreport`, `resourcereport`, `accountreport`
- `textreport`, `csvtaskreport`, `htmltaskreport`
- `icalreport`, `timesheetreport`, `tracereport`
- `xmlreport`, `navigator`, `nikureport`

### Attributes (90+ keywords)
- **Temporal**: `start`, `end`, `duration`, `period`, `interval`
- **Allocation**: `allocate`, `alternative`, `mandatory`, `persistent`
- **Dependencies**: `depends`, `precedes`, `follows`
- **Effort**: `effort`, `length`, `complete`, `efficiency`
- **Resource**: `rate`, `limits`, `managers`, `vacation`, `workinghours`
- **Report**: `columns`, `formats`, `caption`, `headline`, `loadunit`
- **Filtering**: `hidetask`, `hideresource`, `hideaccount`
- **Sorting**: `sorttasks`, `sortresources`, `sortaccounts`
- And many more...

### Functions
- **Type checks**: `isleaf()`, `istask()`, `isresource()`, `ismilestone()`
- **State checks**: `isactive()`, `isongoing()`, `isplannedallocate()`
- **Hierarchy**: `ischildof()`, `hierarchup()`, `hierarchdown()`
- **Queries**: `hasalert()`, `hasresource()`, `treelevel()`
- **Logic**: `and`, `or`, `not`, `before`, `containssubstring()`

### Operators
- **Logical**: `&` (AND), `|` (OR), `~` (NOT), `!` (dependency prefix)
- **Comparison**: `=`, `<`, `>`, `<=`, `>=`, `!=`, `==`
- **Arithmetic**: `+`, `-`, `*`, `/`, `%`

### Constants
- **Macros**: `${projectstart}`, `${projectend}`, `${now}`, `${today}`
- **Booleans**: `on`, `off`, `yes`, `no`, `true`, `false`
- **Formats**: `CSV`, `HTML`, `XML`, `MSP`, `TJP`, `TJSP`
- **Scheduling**: `asap`, `alap`, `length`, `duration`
- **Selectors**: `maxloaded`, `minloaded`, `minallocated`, `order`, `random`
- **Weekdays**: `mon`, `tue`, `wed`, `thu`, `fri`, `sat`, `sun` (and full names)

### Data Types
- **Dates**: `2024-01-28`, `2024-01-28-09:00`, `2024-01-28-09:00:00-UTC`
- **Durations**: `5d`, `2.5w`, `40h`, `30min`, `3m`, `1y`
- **Numbers**: Integers, floats, percentages (`75%`)
- **Colors**: `#FF0000`, `#F00`
- **Strings**: `"double quotes"`, `'single quotes'`, heredoc `-8<-` ... `->8-`

## ⚡ Code Editing Features

### Auto-Completion
- Bracket auto-closing: `{`, `[`, `(`
- Quote auto-closing: `"`, `'`
- Smart bracket matching with color highlighting

### Indentation
- Auto-indent on new line
- Increase indent after `{`
- Decrease indent after `}`
- Tab size: 4 (configurable)
- Use tabs by default (TaskJuggler convention)

### Code Folding
- Fold blocks delimited by `{...}`
- Custom region markers: `#region` / `#endregion`
- Visual fold indicators in gutter
- Keyboard shortcuts: Cmd/Ctrl + Shift + [ / ]

### Comments
- Line comments: `#`
- Block comments: `/* ... */`
- Toggle comment: Cmd/Ctrl + /
- Automatic comment continuation

### Navigation
- Go to Symbol (Cmd/Ctrl + Shift + O)
- Breadcrumbs support
- Outline view in sidebar
- Minimap integration

## 📝 Snippet System

### Snippet Categories

#### Project & Structure (5 snippets)
- `project` - Complete project template
- `scenario` - Scenario definition
- `macro` - Macro definition
- `flags` - Flag declaration
- `copyright` - Copyright notice

#### Tasks (7 snippets)
- `task` - Simple task
- `task-effort` - Task with effort
- `task-duration` - Task with duration
- `task-full` - Complete task with subtasks
- `milestone` - Milestone task
- `depends` - Task dependency
- `priority` - Priority setting

#### Resources (5 snippets)
- `resource` - Single resource
- `resource-team` - Resource team
- `shift` - Work shift definition
- `workinghours` - Working hours
- `limits` - Resource limits

#### Accounts (2 snippets)
- `account` - Account definition
- `account-full` - Complete account structure

#### Reports (6 snippets)
- `taskreport` - Task report
- `resourcereport` - Resource report
- `textreport` - Text/HTML report
- `export-csv` - CSV export
- `navigator` - Navigation bar

#### Attributes (15+ snippets)
- `allocate` - Allocate resources
- `start` - Start date
- `end` - End date
- `complete` - Completion percentage
- `rate` - Resource rate
- `efficiency` - Efficiency factor
- `email` - Email address
- `booking` - Resource booking
- `journalentry` - Journal entry
- `leave` - Leave/holiday
- And more...

### Snippet Features
- **Tab-stop navigation**: Tab through placeholders
- **Default values**: Pre-filled common values
- **Nested snippets**: Use snippets within snippets
- **Smart formatting**: Maintains indentation
- **Context-aware**: Works with IntelliSense

## 🎯 File Support

### File Types
- `.tjp` - TaskJuggler Project files
- `.tji` - TaskJuggler Include files

### Features
- Automatic language detection
- Custom file icon in explorer
- Syntax highlighting activation
- Snippet availability

## 🔧 Integration Features

### VS Code Built-in
- **Problems Panel**: Ready for error reporting (with problem matcher)
- **Minimap**: Code overview with syntax colors
- **Breadcrumbs**: Navigation context
- **Outline**: Document structure
- **Search**: Full-text search with regex
- **Multi-cursor**: Edit multiple locations
- **Format Document**: Structure preservation

### Build Tasks (via tasks.json)
- Compile project with `tj3`
- Check syntax
- Generate reports
- Open HTML reports
- Clean report directory

### Keyboard Shortcuts (suggested)
- Compile: Ctrl+Shift+B
- Check syntax: Ctrl+Shift+C
- Insert task: Ctrl+Alt+T
- Insert resource: Ctrl+Alt+R
- Insert milestone: Ctrl+Alt+M

## 📊 Comparison with Vim/Emacs

| Feature | VS Code Extension | Vim | Emacs |
|---------|------------------|-----|-------|
| Syntax Highlighting | ✅ Full RGB colors | ✅ 16 colors | ✅ Full colors |
| Code Snippets | ✅ 40+ with tab-stops | ⚠️ Limited | ⚠️ Skeletons |
| IntelliSense | ✅ Native | ❌ | ❌ |
| Visual Folding | ✅ Gutter indicators | ✅ Text-based | ✅ Text-based |
| Auto-completion | ✅ Context-aware | ⚠️ Basic | ⚠️ Basic |
| Minimap | ✅ | ❌ | ❌ |
| Multi-cursor | ✅ Full support | ⚠️ Limited | ⚠️ Multiple cursors |
| Built-in Terminal | ✅ Integrated | ✅ Terminal emulation | ✅ Shell mode |
| Cross-platform UI | ✅ Identical | ⚠️ Config varies | ⚠️ Config varies |
| Learning Curve | ✅ Gentle | ⚠️ Steep | ⚠️ Steep |
| Extension System | ✅ Marketplace | ✅ Vimscript/Lua | ✅ Elisp |

## 🚀 User Experience Enhancements

### Beginner-Friendly
- Visual snippet placeholders
- Inline documentation hints
- Color-coded syntax
- Clear error indicators
- Quick start guide

### Power User Features
- Custom keybindings
- Configurable tasks
- Workspace settings
- Git integration
- Terminal integration

### Team Collaboration
- Consistent formatting (.editorconfig)
- Version control integration
- Code review friendly
- Shared snippets
- Style guide examples

## 📦 Installation Options

### Method 1: Manual Copy
Copy extension to `~/.vscode/extensions/`

### Method 2: Install Script
Run `install.sh` (Unix) or `install.ps1` (Windows)

### Method 3: VSIX Package
Create with `vsce package` and install via GUI

## 🎓 Learning Resources

### Included Documentation
- Quick start guide (5 min read)
- Complete README (15 min read)
- Best practices guide (advanced users)
- Example files (basic and complete)

### External Resources
- TaskJuggler official website
- TaskJuggler manual
- Syntax reference
- Tutorial examples

## 🔮 Future Enhancements

Potential additions:
- Hover documentation for keywords
- Go to definition for tasks/resources
- Real-time syntax validation
- Outline view customization
- Report preview integration
- tj3 wrapper commands
- Dependency graph visualization

## 📄 License

MIT License - Free for personal and commercial use

---

**Extension Version**: 0.0.1
**Last Updated**: 2026-01-28
**TaskJuggler Version**: 3.x compatible
**Author**: Fabrizio Vacca (fabrizio.vacca@gmail.com)
