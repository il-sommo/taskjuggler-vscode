# TaskJuggler VS Code Extension - Deployment Guide

**Author**: Fabrizio Vacca (fabrizio.vacca@gmail.com)
**Version**: 0.0.1
**Build Date**: 2026-01-28

## Pre-Deployment Checklist

### Code Quality
- [x] All JSON files validated (`make validate`)
- [x] Extension installs successfully (`make install`)
- [x] Test project compiles (`make compile-test`)
- [x] Syntax highlighting works
- [x] All snippets functional
- [x] Code folding works
- [x] No console errors

### Documentation
- [x] README.md complete
- [x] QUICKSTART.md clear
- [x] CHANGELOG.md updated
- [x] CONTRIBUTING.md present
- [x] LICENSE file included
- [x] All docs have author info

### Repository
- [x] .gitignore configured
- [x] GitHub issue templates added
- [x] Project structure clean
- [x] No duplicate examples
- [x] Test project only

### Version
- [x] Version set to 0.0.1
- [x] Build date: 2026-01-28
- [x] Author info in package.json

## Deployment Steps

### 1. Create Repository

```bash
# Initialize git (if not already done)
git init

# Add remote repository
git remote add origin https://github.com/il-sommo/taskjuggler-vscode.git

# Add all files
git add .

# Initial commit
git commit -m "feat: initial release v0.0.1

- Complete syntax highlighting for TaskJuggler
- 40+ intelligent code snippets
- Code folding and indentation
- IntelliSense integration
- Modular test project
- Comprehensive documentation

Author: Fabrizio Vacca <fabrizio.vacca@gmail.com>"

# Push to GitHub
git push -u origin main
```

### 2. Create GitHub Release

1. Go to: https://github.com/il-sommo/taskjuggler-vscode/releases
2. Click "Create a new release"
3. Tag version: `v0.0.1`
4. Release title: `TaskJuggler Language Support v0.0.1`
5. Description:

```markdown
## TaskJuggler Language Support v0.0.1

First public release of the TaskJuggler extension for VS Code.

### Features
- 🎨 Complete syntax highlighting for all TaskJuggler constructs
- ⚡ 40+ smart code snippets with tab-stop navigation
- 📁 Support for .tjp and .tji files
- 🔧 IntelliSense integration
- 🤖 AI extension compatible (GitHub Copilot, etc.)
- 📐 Code folding and smart indentation
- 📦 Modular test project included

### Installation

Download and install:
```bash
code --install-extension taskjuggler-syntax-0.0.1.vsix
```

Or clone and build:
```bash
git clone https://github.com/il-sommo/taskjuggler-vscode.git
cd taskjuggler-vscode
make install
```

### Requirements
- VS Code 1.60+
- TaskJuggler 3.x (for compiling projects)

### Documentation
- [Quick Start Guide](QUICKSTART.md)
- [Complete Documentation](README.md)
- [Best Practices](docs/BEST-PRACTICES.md)

**Author**: Fabrizio Vacca (fabrizio.vacca@gmail.com)
```

6. Attach VSIX file (create with `make package`)

### 3. Create VSIX Package

```bash
# Install vsce
make deps

# Create package
make package

# This creates: taskjuggler-syntax-0.0.1.vsix
```

Upload this file to the GitHub release.

### 4. Publish to VS Code Marketplace (Optional)

#### Prerequisites
1. Create Publisher account: https://marketplace.visualstudio.com/manage
2. Create Personal Access Token in Azure DevOps
3. Login with vsce:

```bash
vsce login fabrizio-vacca
```

#### Publish

```bash
# From project root
vsce publish

# Or manually upload VSIX to:
# https://marketplace.visualstudio.com/manage/publishers/fabrizio-vacca
```

### 5. Update Repository Settings

**Topics** (GitHub):
- taskjuggler
- vscode-extension
- syntax-highlighting
- project-management
- code-completion
- snippets

**Description**:
> Complete language support for TaskJuggler in VS Code: syntax highlighting, snippets, folding, and IntelliSense

**Website**: https://taskjuggler.org

**README badges** (already in README.md):
- Version
- License
- VS Code
- TaskJuggler

## Post-Deployment

### Announce

1. **Reddit**: r/vscode, r/projectmanagement
2. **TaskJuggler Mailing List**
3. **Twitter/X**
4. **LinkedIn**

### Monitor

- GitHub issues
- VS Code Marketplace reviews
- Download statistics

### Maintain

- Respond to issues
- Accept pull requests
- Plan future versions

## Version History

### v0.0.1 (2026-01-28) - Initial Release
- First public release
- Complete syntax highlighting
- 40+ snippets
- Modular test project
- Full documentation

---

**Ready to deploy!** ✅
