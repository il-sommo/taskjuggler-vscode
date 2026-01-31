# Changelog

All notable changes to the TaskJuggler extension.

## [0.3.1] - 2026-01-31

### Added

**4 New Interactive Snippets**
- `Insert Allocate (Interactive)` - Resource allocation with % limits or specific effort
- `Insert Dependencies (Interactive)` - Task dependencies with gap duration support
- `Insert Vacation (Interactive)` - Vacation periods with date range or duration
- `Insert Shift (Interactive)` - Work shifts with custom hours or predefined templates

**Test Coverage Improvements**
- New test suite: `interactiveSnippets.test.ts` (15 tests)
- Total tests: 64 (up from 49)
- Coverage: 79.7% (up from 73.5%)
- All interactive snippet tests passing

### Changed

- Total interactive commands: 8 (4 structure + 4 attributes)
- Enhanced helper methods: `getTodayDate()`, `addDays()`

---

## [0.3.0] - 2026-01-31

### 🎉 Major Release: Context-Aware Intelligence

#### Added

**Context-Aware Completions**
- Smart filtering based on current block type (task, resource, project, report)
- Only relevant attributes shown in each context
- Automatic exclusion of already-used attributes
- Top-level shows only property declarations

**Signature Help (Parameter Hints)**
- Real-time syntax help for 15+ key attributes
- Displays while typing: `effort <value>[h|d|w|m|y]`
- Triggered by space and dash characters
- Complete parameter documentation

**Smart Date Completion**
- Intelligent date suggestions: today, tomorrow, next week, next month
- Auto-formatted to YYYY-MM-DD
- Macro support: `${now}`

**Quick Start Templates**
- Auto-prompt for empty `.tjp` files
- "Full Project Template" - Complete structure with resources, tasks, report
- "Simple Task" - Basic task snippet
- Non-intrusive, dismissible

**Dynamic Dates in Snippets**
- All 16 date-related snippets now use VS Code variables
- Dates update automatically every day
- Examples: `$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE`
- No more hardcoded dates like "2024-01-01"

**Enhanced Documentation**
- 150+ keywords with hover tooltips
- Syntax examples and usage patterns
- Context-specific help

### Changed

- Improved completion relevance (reduced noise)
- Enhanced user experience with smart suggestions
- Optimized activation with `onStartupFinished` event

### Technical

- New: `TaskJugglerParser.getContextAtPosition()` method
- New: `SignatureHelpProvider` for parameter hints
- New: `QuickStart` module for empty file handling
- Enhanced: Context-specific attribute filters
- Test Suite: 49 tests, 73.5% passing

---

## [0.2.2] - 2026-01-29

### Added

**Complete TaskJuggler 3.x Coverage**
- 150+ keywords (expanded from 15)
- All keywords from official TaskJuggler repository
- Comprehensive hover documentation

**88 Intelligent Snippets**
- 48 new advanced snippets
- Categories: reports, scheduling, resources, constraints
- All snippets include tab stops and proper syntax

**Enhanced Keyword Database**
- Properties: project, task, resource, account, shift, scenario
- Reports: taskreport, resourcereport, accountreport, textreport, timesheetreport
- Attributes: allocate, depends, effort, duration, limits (90+)
- Functions: isleaf(), istask(), ismilestone(), hasalert()
- Complete documentation with examples

### Changed

- Unified keyword definitions for multi-context keywords
- Better categorization (properties, attributes, functions, columns)
- Enhanced syntax information with practical examples

---

## [0.2.1] - 2026-01-28

### Added

**AI-Powered Features**
- Go-to-definition for task and resource references
- Hover documentation for 15 core keywords
- Basic IntelliSense completions

**Language Support**
- Syntax highlighting for all TaskJuggler constructs
- 40 code snippets for rapid development
- Code folding support

### Changed

- Improved syntax highlighting accuracy
- Better snippet organization

---

## [0.2.0] - 2026-01-27

### Added

- Initial public release
- Basic syntax highlighting
- Essential snippets
- Language configuration

---

## [0.1.0] - 2026-01-26

### Added

- Initial development version
- TextMate grammar
- Basic snippet support

---

## Roadmap

### [0.4.0] - Validation & Diagnostics (Planned)
- Real-time syntax validation
- Semantic checks (undefined references, circular dependencies)
- Date logic validation
- Problems panel integration

### [0.5.0] - Navigation & Refactoring (Planned)
- Document symbols (outline view)
- Rename refactoring
- Find all references
- Workspace symbol search

### [0.6.0] - Code Actions (Planned)
- Quick fixes for common errors
- Code formatting
- Auto-import

### [1.0.0] - Full Integration (Planned)
- tj3 compiler integration
- Live preview
- Build tasks
- 90%+ test coverage

---

**Version Format**: MAJOR.MINOR.PATCH
**Author**: Fabrizio Vacca (fabrizio.vacca@gmail.com)
**Repository**: https://github.com/il-sommo/taskjuggler-vscode
