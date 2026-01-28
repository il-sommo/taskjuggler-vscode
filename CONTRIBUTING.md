# Contributing to TaskJuggler VS Code Extension

Thank you for considering contributing to this project! Here's how you can help.

## Ways to Contribute

- 🐛 Report bugs
- 💡 Suggest new features
- 📝 Improve documentation
- 🔧 Fix issues
- ✨ Add new snippets or keywords

## Getting Started

### Prerequisites

- **VS Code** 1.60+
- **Node.js** and **npm** (for packaging)
- **TaskJuggler** 3.x (for testing)
- **Git**

### Setup

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/taskjuggler-vscode.git
cd taskjuggler-vscode

# Install dependencies (optional, for packaging)
make deps
```

## Development Workflow

### Making Changes

1. **Create a branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make changes:**
   - **Syntax**: Edit `syntaxes/taskjuggler.tmLanguage.json`
   - **Snippets**: Edit `snippets/taskjuggler.json`
   - **Language Config**: Edit `language-configuration.json`

3. **Validate:**
   ```bash
   make validate
   ```

4. **Test locally:**
   ```bash
   make reinstall
   ```

5. **Test thoroughly:**
   - Open a `.tjp` file
   - Verify syntax highlighting
   - Test new snippets
   - Check folding, indentation
   - Run `make compile-test`

### Adding a New Keyword

1. Open `syntaxes/taskjuggler.tmLanguage.json`
2. Find the appropriate section (properties, attributes, etc.)
3. Add the keyword to the regex pattern
4. Test with a sample file

Example:
```json
{
  "name": "storage.type.property.taskjuggler",
  "match": "\\b(project|task|resource|YOUR_KEYWORD)\\b"
}
```

### Adding a New Snippet

1. Open `snippets/taskjuggler.json`
2. Add a new entry:

```json
{
  "Your Snippet Name": {
    "prefix": "your-prefix",
    "body": [
      "your_keyword ${1:param1} \"${2:description}\" {",
      "\t$0",
      "}"
    ],
    "description": "Brief description"
  }
}
```

3. Test by typing `your-prefix` + Tab in a `.tjp` file

## Submitting Changes

### Before Submitting

- [ ] Run `make validate` - all checks pass
- [ ] Test in VS Code - syntax highlighting works
- [ ] Test snippets - all placeholders navigate correctly
- [ ] Update documentation if needed
- [ ] Add entry to CHANGELOG.md

### Pull Request Process

1. **Commit your changes:**
   ```bash
   git add .
   git commit -m "feat: add support for XYZ keyword"
   ```

2. **Push to your fork:**
   ```bash
   git push origin feature/your-feature-name
   ```

3. **Create Pull Request:**
   - Go to GitHub
   - Click "New Pull Request"
   - Provide clear description
   - Reference any related issues

### Commit Message Format

Use conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

Examples:
```
feat: add support for 'journalentry' keyword
fix: correct indentation after macro definition
docs: update installation instructions
```

## Testing

### Manual Testing

```bash
# Install extension
make install

# Restart VS Code

# Test features:
# 1. Open test-project/project.tjp
# 2. Verify syntax highlighting
# 3. Try snippets (project, task, resource)
# 4. Test folding (click arrows in gutter)
# 5. Compile project: make compile-test
```

### Test Checklist

- [ ] Syntax highlighting works
- [ ] All snippets function
- [ ] Code folding works
- [ ] Auto-closing brackets works
- [ ] Comment toggling works (Cmd+/)
- [ ] Test project compiles
- [ ] No console errors (Help > Toggle Developer Tools)

## Code Style

### JSON Files

- Use 2 spaces for indentation
- Validate JSON before committing: `make validate`
- Format with: `make format`

### Documentation

- Use clear, concise language
- Include code examples
- Keep line length under 120 characters
- Use markdown formatting consistently

## Project Structure

```
taskjuggler-vscode/
├── syntaxes/              # TextMate grammar
├── snippets/              # Code snippets
├── images/                # Icons
├── test-project/          # Complete example project
├── docs/                  # Documentation
├── scripts/               # Install scripts
└── README.md              # Main documentation
```

## Need Help?

- Check existing [issues](https://github.com/il-sommo/taskjuggler-vscode/issues)
- Review [documentation](docs/)
- Contact: fabrizio.vacca@gmail.com

## Code of Conduct

- Be respectful
- Be constructive
- Focus on what is best for the community

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing!** 🎉
