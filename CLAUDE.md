# CLAUDE.md

## ⚠️ CRITICAL RULES

1. **#mantineni SEMPRE la directory root pulita** → `make check-clean`
2. **#fai SEMPRE in modo che CLAUDE.md sia conciso ma completo. Non sprecare contesto.**

**Root Files (ONLY):** README.md, CHANGELOG.md, LICENSE, CLAUDE.md, package.json, package-lock.json, tsconfig.json, Makefile, language-configuration.json, .gitignore, .vscodeignore
**Root Dirs (ONLY):** src/, docs/, snippets/, syntaxes/, test-project/, scripts/, images/

---

## Project

**TaskJuggler Language Support** v0.3.0 | TypeScript VS Code Extension | .tjp/.tji files
**Features:** Syntax highlighting, 88 snippets, context-aware completions, parameter hints, dynamic dates
**Test:** 73.5% (36/49) | **Status:** Production Ready ✅

## Structure

```
src/extension.ts taskjugglerParser.ts completionProvider.ts signatureHelpProvider.ts
    hoverProvider.ts definitionProvider.ts quickStart.ts taskjugglerData.ts
snippets/taskjuggler.json  syntaxes/taskjuggler.tmLanguage.json
test/suite/  docs/  test-project/
```

## Key Implementation

**Context Detection:** `parser.getContextAtPosition()` → currentBlock (project|task|resource|account|report|none), usedAttributes
**Dynamic Dates:** Snippets use `$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE`
**Signature Help:** 15 attributes (effort, allocate, depends, limits, rate...)
**Filters:** taskAttributes, resourceAttributes, projectAttributes, reportAttributes

## Development

```bash
npm install && npm run compile   # Setup
npm run watch                    # Dev mode
npm test                         # Run tests
vsce package                     # Build .vsix
make check-clean                 # Verify root clean
```

## Add Features

**Keyword:** taskjugglerData.ts → KeywordInfo + add to attribute list
**Snippet:** snippets/taskjuggler.json → use `$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE`
**Provider:** src/newProvider.ts → implement interface → register in extension.ts

## Roadmap

v0.4.0: Validation/diagnostics | v0.5.0: Symbols/rename/references | v0.6.0: Code actions/format | v1.0.0: tj3 integration/preview

## Release

1. package.json version 2. CHANGELOG.md 3. npm test 4. make check-clean 5. vsce package 6. test .vsix 7. git tag && push 8. vsce publish

---

**v0.3.0** | 2026-01-31
