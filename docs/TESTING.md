# TaskJuggler VS Code Extension - Testing Guide

**Author**: Fabrizio Vacca (fabrizio.vacca@gmail.com)

This document provides a comprehensive testing checklist for verifying the extension functionality.

## Pre-Testing Setup

1. **Install Extension:**
   ```bash
   make install
   # OR
   ./scripts/install.sh
   ```

2. **Restart VS Code:**
   Close all VS Code windows and reopen.

3. **Open Test Project:**
   ```bash
   code test-project/project.tjp
   ```

## Test Checklist

### ✅ 1. File Recognition

- [ ] Status bar shows "TaskJuggler" (bottom right)
- [ ] File icon is visible in explorer (custom TJ icon)
- [ ] Opening `.tjp` file auto-activates extension
- [ ] Opening `.tji` file auto-activates extension

### ✅ 2. Syntax Highlighting

Open `example-complete.tjp` and verify colors for:

- [ ] **Comments** are gray/green
  - Test: `# This is a comment`
  - Test: `/* Multi-line comment */`

- [ ] **Properties** are highlighted (purple/blue)
  - Test: `project`, `task`, `resource`, `account`

- [ ] **Attributes** have distinct color (yellow/orange)
  - Test: `allocate`, `depends`, `effort`, `start`, `end`

- [ ] **Strings** are colored (green/red)
  - Test: `"double quotes"`
  - Test: `'single quotes'`
  - Test heredoc: `-8<-` ... `->8-`

- [ ] **Numbers** are highlighted
  - Test: `500`, `3.14`, `75%`

- [ ] **Dates** have special color
  - Test: `2024-01-28`, `2024-01-28-09:00`

- [ ] **Durations** are recognized
  - Test: `5d`, `2.5w`, `40h`, `30min`

- [ ] **Macros** are highlighted
  - Test: `${projectstart}`, `${macro_name}`
  - Test: `$(ENV_VAR)`

- [ ] **Functions** are colored
  - Test: `isleaf()`, `istask()`, `ismilestone()`

- [ ] **Operators** are visible
  - Test: `&`, `|`, `~`, `!`
  - Test: `<`, `>`, `=`, `<=`, `>=`

- [ ] **Constants** are highlighted
  - Test: `on`, `off`, `true`, `false`
  - Test: `mon`, `tue`, `wed`, weekdays

- [ ] **Colors** (#RGB) are recognized
  - Test: `#FF0000`, `#F00`

### ✅ 3. Code Snippets

Create a new file `test.tjp` and try these snippets:

#### Basic Snippets
- [ ] Type `project` + Tab
  - Verify: Project template appears
  - Verify: Tab navigates between placeholders
  - Verify: Cursor positions are correct

- [ ] Type `task` + Tab
  - Verify: Simple task template
  - Verify: Placeholders work

- [ ] Type `resource` + Tab
  - Verify: Resource template with email and rate

- [ ] Type `taskreport` + Tab
  - Verify: Complete report template
  - Verify: Proper indentation

#### Advanced Snippets
- [ ] Type `task-effort` + Tab
  - Verify: Task with effort and allocate

- [ ] Type `task-full` + Tab
  - Verify: Complete task with subtasks

- [ ] Type `resource-team` + Tab
  - Verify: Team structure with members

- [ ] Type `account-full` + Tab
  - Verify: Complete account hierarchy

#### Attribute Snippets
- [ ] Type `allocate` + Tab
- [ ] Type `depends` + Tab
- [ ] Type `workinghours` + Tab
- [ ] Type `journalentry` + Tab

**Snippet Navigation Test:**
- [ ] Tab moves forward through placeholders
- [ ] Shift+Tab moves backward
- [ ] Escape exits snippet mode
- [ ] Default values are pre-filled

### ✅ 4. Code Editing Features

#### Auto-Closing
- [ ] Type `{` → automatically adds `}`
- [ ] Type `[` → automatically adds `]`
- [ ] Type `(` → automatically adds `)`
- [ ] Type `"` → automatically adds `"`
- [ ] Type `'` → automatically adds `'`

#### Indentation
- [ ] After `{` and Enter, cursor indents
- [ ] After `}`, line un-indents
- [ ] Tab indents by 4 spaces (or tab character)
- [ ] Shift+Tab un-indents

#### Comments
- [ ] Cmd/Ctrl + / toggles line comment
- [ ] Works on single line
- [ ] Works on multiple selected lines
- [ ] Shift+Alt+A adds block comment

#### Bracket Matching
- [ ] Cursor on `{` highlights matching `}`
- [ ] Cursor on `[` highlights matching `]`
- [ ] Cursor on `(` highlights matching `)`
- [ ] Matching brackets have visual indicator

### ✅ 5. Code Folding

Open `example-complete.tjp`:

- [ ] Fold indicators appear in gutter (arrows)
- [ ] Click arrow to fold `project {...}` block
- [ ] Click arrow to unfold
- [ ] Fold nested `task {...}` blocks
- [ ] Fold `resource {...}` sections

**Keyboard Shortcuts:**
- [ ] Cmd/Ctrl + Shift + [ folds at cursor
- [ ] Cmd/Ctrl + Shift + ] unfolds at cursor
- [ ] Cmd/Ctrl + K, Cmd/Ctrl + 0 folds all
- [ ] Cmd/Ctrl + K, Cmd/Ctrl + J unfolds all

**Region Markers:**
Add to test file:
```taskjuggler
# #region Test Region
task test "Test" {
  effort 5d
}
# #endregion
```
- [ ] Region can be folded
- [ ] Shows "Test Region" label when folded

### ✅ 6. IntelliSense

Create new file and test:

- [ ] Ctrl+Space shows available snippets
- [ ] Typing `proj` filters to `project`
- [ ] Typing `task` shows task-related snippets
- [ ] Snippet descriptions are visible
- [ ] Up/Down arrows navigate suggestions
- [ ] Enter/Tab accepts suggestion

### ✅ 7. Navigation Features

Open `example-complete.tjp`:

#### Outline View
- [ ] Outline appears in sidebar (Explorer panel)
- [ ] Shows document structure
- [ ] Click outline item jumps to location

#### Breadcrumbs
- [ ] Breadcrumbs visible at top of editor
- [ ] Shows current context/location
- [ ] Click breadcrumb navigates

#### Minimap
- [ ] Minimap visible on right side
- [ ] Syntax colors reflected in minimap
- [ ] Click minimap scrolls to location
- [ ] Current viewport highlighted

#### Go to Symbol
- [ ] Cmd/Ctrl + Shift + O opens symbol picker
- [ ] Tasks/resources appear in list
- [ ] Typing filters symbols
- [ ] Enter jumps to selected symbol

### ✅ 8. Search & Replace

- [ ] Cmd/Ctrl + F opens find
- [ ] Find highlights matches
- [ ] Cmd/Ctrl + H opens replace
- [ ] Replace works correctly
- [ ] Regex search works (test: `effort \d+d`)

### ✅ 9. Multi-Cursor

- [ ] Alt+Click adds cursor
- [ ] Cmd/Ctrl + D selects next occurrence
- [ ] Cmd/Ctrl + Shift + L selects all occurrences
- [ ] Edits apply to all cursors

### ✅ 10. File Operations

- [ ] Save file (Cmd/Ctrl + S)
- [ ] File remains syntax-highlighted after save
- [ ] Reopen file maintains highlighting
- [ ] Create new `.tjp` file → auto-detected

### ✅ 11. Makefile Integration

Test Makefile commands:

```bash
# Basic commands
make help          # Shows help
make check         # Validates structure
make validate      # Validates JSON
make info          # Shows info

# Installation
make install       # Installs extension
make uninstall     # Removes extension
make reinstall     # Reinstall

# Testing
make test          # Opens example file

# Cleanup
make clean         # Removes artifacts
```

- [ ] `make help` shows all commands
- [ ] `make check` validates files
- [ ] `make validate` checks JSON
- [ ] `make info` shows extension status
- [ ] `make install` installs successfully
- [ ] `make test` opens VS Code with example

### ✅ 12. Documentation

Verify all documentation files exist and are readable:

- [ ] README.md is comprehensive
- [ ] QUICKSTART.md is beginner-friendly
- [ ] CHANGELOG.md lists features
- [ ] INSTALL.md has install instructions
- [ ] BEST-PRACTICES.md has useful tips
- [ ] FEATURES.md lists all features
- [ ] SUMMARY.md summarizes project
- [ ] TESTING.md (this file) is complete

### ✅ 13. Example Files

- [ ] `example.tjp` opens and is syntax-highlighted
- [ ] `example-complete.tjp` demonstrates all features
- [ ] Both files compile with tj3 (if installed)

### ✅ 14. Configuration Files

Verify example configs exist:

- [ ] `.vscode/settings.json.example`
- [ ] `.vscode/tasks.json.example`
- [ ] `.vscode/keybindings.json.example`
- [ ] `.editorconfig` exists

### ✅ 15. Performance

- [ ] Extension loads quickly
- [ ] Syntax highlighting is responsive
- [ ] No lag when typing
- [ ] Folding is instant
- [ ] IntelliSense appears quickly

### ✅ 16. Integration with tj3

If TaskJuggler is installed:

```bash
# Compile example
tj3 example-complete.tjp
```

- [ ] Compiles without errors
- [ ] Generates HTML reports
- [ ] Reports can be opened in browser

### ✅ 17. Edge Cases

Test unusual scenarios:

- [ ] Very long file (1000+ lines)
- [ ] Deeply nested tasks (5+ levels)
- [ ] File with only comments
- [ ] Empty `.tjp` file
- [ ] File with syntax errors (should still highlight)
- [ ] Unicode characters in strings
- [ ] Very long strings
- [ ] Many macros in one file

## Test Results Template

Copy and fill out:

```
Date: ___________
Tester: ___________
VS Code Version: ___________
OS: ___________

✅ File Recognition:       PASS / FAIL
✅ Syntax Highlighting:    PASS / FAIL
✅ Code Snippets:          PASS / FAIL
✅ Code Editing:           PASS / FAIL
✅ Code Folding:           PASS / FAIL
✅ IntelliSense:           PASS / FAIL
✅ Navigation:             PASS / FAIL
✅ Search & Replace:       PASS / FAIL
✅ Multi-Cursor:           PASS / FAIL
✅ Makefile:               PASS / FAIL
✅ Documentation:          PASS / FAIL
✅ Performance:            PASS / FAIL

Notes:
___________________________________________
___________________________________________
```

## Automated Testing

The extension includes a comprehensive automated test suite using the VS Code Extension Testing API.

### Test Statistics

**Current Test Coverage:** 121/121 tests passing (100%) ✅

**Test Breakdown:**
- v0.5.5 - Comprehensive Improvements: 17 tests
- v0.5.1 - Quick Fixes: 9 tests
- Signature Help Provider: 12 tests
- Semantic Validator: 10 tests
- TaskJuggler Parser: 12 tests
- Navigation Providers: 10 tests
- Interactive Snippets: 15 tests
- Integration Tests: 11 tests
- Formatter: 2 tests
- Date Logic Validator: 9 tests
- Completion Provider: 11 tests

### Running Tests

```bash
# Run all tests
npm test

# Compile and run tests
npm run compile && npm test

# Watch mode (for development)
npm run watch
```

### Test Framework

- **Framework:** Mocha
- **VS Code API:** @vscode/test-electron
- **TypeScript:** Full type checking
- **CI/CD:** Automated testing on commits

### Test Files

Located in `src/test/suite/`:
- `v0.5.5.test.ts` - Comprehensive improvements tests
- `v0.5.1.test.ts` - Account & nested task tests
- `signatureHelpProvider.test.ts` - Parameter hints tests
- `semanticValidator.test.ts` - Semantic validation tests
- `parser.test.ts` - Parser tests
- `navigationProviders.test.ts` - Navigation features tests
- `interactiveSnippets.test.ts` - Interactive snippet tests
- `integration.test.ts` - Full integration tests
- `formatter.test.ts` - Formatting tests
- `dateLogicValidator.test.ts` - Date logic tests
- `completionProvider.test.ts` - Completion tests

### Contributing Tests

When adding new features, include tests in the appropriate suite. Maintain 100% test pass rate.

## Reporting Issues

If you find bugs during testing:

1. Note the exact steps to reproduce
2. Check VS Code Developer Tools (Help > Toggle Developer Tools)
3. Look for errors in Console
4. Document expected vs actual behavior

## Success Criteria

All tests should PASS for release readiness.

---

**Last Updated**: 2026-01-31
**Extension Version**: 0.5.5
**Test Coverage**: 121/121 tests passing (100%)
