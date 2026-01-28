# TaskJuggler VS Code Extension - Installation Guide

**Author**: Fabrizio Vacca (fabrizio.vacca@gmail.com)
**Version**: 0.0.1

## Installation Methods

### Method 1: Clone and Install (Recommended)

```bash
# Clone the repository
git clone https://github.com/il-sommo/taskjuggler-vscode.git
cd taskjuggler-vscode

# Install using Makefile
make install

# Or use the install script
# macOS/Linux:
./scripts/install.sh

# Windows PowerShell:
.\scripts\install.ps1
```

Then **restart VS Code**.

### Method 2: Install from VSIX

1. Download the latest `.vsix` file from [Releases](https://github.com/il-sommo/taskjuggler-vscode/releases)

2. Install via command line:
   ```bash
   code --install-extension taskjuggler-syntax-0.0.1.vsix
   ```

3. Or install via VS Code UI:
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
   - Click the three dots (...) at the top right
   - Select "Install from VSIX..."
   - Select the downloaded `.vsix` file

4. **Restart VS Code**

### Method 3: Manual Installation

**macOS/Linux:**
```bash
mkdir -p ~/.vscode/extensions/taskjuggler-syntax-0.0.1
cp -r * ~/.vscode/extensions/taskjuggler-syntax-0.0.1/
```

**Windows:**
```powershell
New-Item -ItemType Directory -Force -Path "$env:USERPROFILE\.vscode\extensions\taskjuggler-syntax-0.0.1"
Copy-Item -Recurse -Force * "$env:USERPROFILE\.vscode\extensions\taskjuggler-syntax-0.0.1\"
```

Then **restart VS Code**.

## Verification

### Step 1: Check Extension is Loaded

1. Open VS Code
2. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
3. Search for "TaskJuggler"
4. Verify it appears in the list

### Step 2: Test Syntax Highlighting

1. Open the test project:
   ```bash
   code test-project/project.tjp
   ```

2. Verify that:
   - Keywords (`project`, `task`, `resource`) are colored
   - Comments (`#` and `/* */`) are highlighted
   - Strings are colored
   - Dates and numbers have distinct colors
   - Macros (`${...}`) are recognized

3. Check the language mode in the bottom-right status bar shows "TaskJuggler"

### Step 3: Test Snippets

1. Create a new file: `test.tjp`
2. Type `project` and press **Tab**
3. A project template should appear
4. Try other snippets: `task`, `resource`, `taskreport`

### Step 4: Test Code Folding

1. Open `test-project/project.tjp`
2. Look for fold indicators (arrows) in the gutter
3. Click to fold/unfold blocks

## Uninstallation

### Via Command Line
```bash
code --uninstall-extension fabrizio-vacca.taskjuggler-syntax
```

### Via VS Code UI
1. Go to Extensions (Ctrl+Shift+X / Cmd+Shift+X)
2. Search for "TaskJuggler"
3. Click "Uninstall"

## Troubleshooting

### Extension Not Loading

1. **Verify installation directory:**
   - macOS/Linux: `~/.vscode/extensions/taskjuggler-syntax-0.0.1/`
   - Windows: `%USERPROFILE%\.vscode\extensions\taskjuggler-syntax-0.0.1\`

2. **Check package.json is valid:**
   ```bash
   cd ~/.vscode/extensions/taskjuggler-syntax-0.0.1
   python3 -m json.tool package.json
   ```

3. **Check Developer Console:**
   - Help > Toggle Developer Tools
   - Look for errors in the Console tab

### Syntax Highlighting Not Working

1. **Verify file extension** is `.tjp` or `.tji`

2. **Manually set language:**
   - Click on language indicator in bottom-right status bar
   - Select "TaskJuggler" from the list

3. **Reload VS Code window:**
   - Ctrl/Cmd + Shift + P
   - Type "Reload Window"
   - Press Enter

### Snippets Not Appearing

1. **Verify snippets file exists:**
   ```bash
   ls ~/.vscode/extensions/taskjuggler-syntax-0.0.1/snippets/taskjuggler.json
   ```

2. **Check IntelliSense is enabled:**
   - File > Preferences > Settings
   - Search for "suggest"
   - Ensure "Editor: Quick Suggestions" is enabled

3. **Try manual trigger:**
   - Type snippet prefix (e.g., `project`)
   - Press Ctrl + Space
   - Select snippet from list

### Changes Not Visible After Update

After modifying extension files:

1. **Reload window:**
   - Ctrl/Cmd + Shift + P
   - Type "Reload Window"

2. **Or restart VS Code completely**

3. **Clear VS Code cache (if needed):**
   ```bash
   rm -rf ~/.vscode/extensions/.obsolete
   ```

## Development Setup

If you want to develop and test the extension:

### Prerequisites
- VS Code 1.60+
- Node.js and npm (for packaging)
- TaskJuggler 3.x (for testing)

### Setup
```bash
# Clone repository
git clone https://github.com/il-sommo/taskjuggler-vscode.git
cd taskjuggler-vscode

# Install development dependencies
make deps

# Make changes to files
# - syntaxes/taskjuggler.tmLanguage.json
# - snippets/taskjuggler.json
# - language-configuration.json

# Validate JSON files
make validate

# Reinstall extension
make reinstall

# Test with example project
make compile-test
```

### Testing Changes

1. Make changes to extension files
2. Run `make reinstall`
3. Reload VS Code window (Ctrl/Cmd + Shift + P > "Reload Window")
4. Test your changes

## Creating VSIX Package

### Prerequisites
```bash
npm install -g @vscode/vsce
```

### Create Package
```bash
make package
```

This creates `taskjuggler-syntax-0.0.1.vsix` in the project root.

### Test Package
```bash
code --install-extension taskjuggler-syntax-0.0.1.vsix
```

## Publishing to VS Code Marketplace

### Prerequisites

1. Create a publisher account: https://marketplace.visualstudio.com/manage
2. Create Personal Access Token in Azure DevOps
3. Update `publisher` in package.json

### Publish

```bash
# Login
vsce login fabrizio-vacca

# Publish
vsce publish
```

Or manually upload the `.vsix` file to the marketplace website.

## Support

- **Issues**: [GitHub Issues](https://github.com/il-sommo/taskjuggler-vscode/issues)
- **Email**: fabrizio.vacca@gmail.com
- **Documentation**: [README.md](../README.md)

---

**Installation complete!** Open a `.tjp` file and start coding. 🚀
