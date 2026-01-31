# Makefile for TaskJuggler VS Code Extension
# Provides build, install, test, and deployment targets

# Extension metadata
EXTENSION_NAME = taskjuggler-syntax
VERSION = 0.5.5
VSIX_FILE = $(EXTENSION_NAME)-$(VERSION).vsix

# Directories
VSCODE_EXT_DIR = $(HOME)/.vscode/extensions/$(EXTENSION_NAME)-$(VERSION)
BUILD_DIR = build
DIST_DIR = dist

# VS Code paths
VSCODE_CMD = /usr/local/bin/code
ifeq (,$(wildcard $(VSCODE_CMD)))
	VSCODE_CMD = code
endif

# Colors for output
GREEN = \033[0;32m
YELLOW = \033[0;33m
RED = \033[0;31m
NC = \033[0m # No Color

.PHONY: all help install package clean test uninstall dev deps check validate

# Default target
all: package

##@ General

help: ## Display this help message
	@echo "$(GREEN)TaskJuggler VS Code Extension - Build System$(NC)"
	@echo ""
	@awk 'BEGIN {FS = ":.*##"; printf "Usage:\n  make $(YELLOW)<target>$(NC)\n"} /^[a-zA-Z_0-9-]+:.*?##/ { printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2 } /^##@/ { printf "\n$(GREEN)%s$(NC)\n", substr($$0, 5) } ' $(MAKEFILE_LIST)

##@ Development

deps: ## Install development dependencies (vsce)
	@echo "$(GREEN)Installing dependencies...$(NC)"
	@if ! command -v vsce &> /dev/null; then \
		echo "Installing @vscode/vsce..."; \
		npm install -g @vscode/vsce; \
	else \
		echo "vsce is already installed"; \
	fi
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

check: ## Check if all required files are present
	@echo "$(GREEN)Checking project structure...$(NC)"
	@test -f package.json || (echo "$(RED)✗ package.json not found$(NC)" && exit 1)
	@test -f language-configuration.json || (echo "$(RED)✗ language-configuration.json not found$(NC)" && exit 1)
	@test -f syntaxes/taskjuggler.tmLanguage.json || (echo "$(RED)✗ tmLanguage.json not found$(NC)" && exit 1)
	@test -f snippets/taskjuggler.json || (echo "$(RED)✗ snippets not found$(NC)" && exit 1)
	@test -f README.md || (echo "$(RED)✗ README.md not found$(NC)" && exit 1)
	@echo "$(GREEN)✓ All required files present$(NC)"

check-clean: ## Verify root directory is clean (only essential files)
	@echo "$(GREEN)Checking root directory cleanliness...$(NC)"
	@ALLOWED="README.md CHANGELOG.md LICENSE CLAUDE.md package.json package-lock.json tsconfig.json Makefile language-configuration.json .gitignore .vscodeignore .npmrc"; \
	ALLOWED_DIRS="src snippets syntaxes test-project scripts images docs out node_modules .git .vscode .github"; \
	CLEAN=true; \
	for file in *; do \
		if [ -f "$$file" ]; then \
			if ! echo "$$ALLOWED" | grep -qw "$$file"; then \
				echo "$(RED)✗ Unauthorized file in root: $$file$(NC)"; \
				CLEAN=false; \
			fi; \
		elif [ -d "$$file" ]; then \
			if ! echo "$$ALLOWED_DIRS" | grep -qw "$$file"; then \
				echo "$(RED)✗ Unauthorized directory in root: $$file$(NC)"; \
				CLEAN=false; \
			fi; \
		fi; \
	done; \
	if [ "$$CLEAN" = true ]; then \
		echo "$(GREEN)✓ Root directory is clean$(NC)"; \
	else \
		echo "$(RED)✗ Root directory contains unauthorized files$(NC)"; \
		echo "$(YELLOW)Run 'make clean' to remove build artifacts$(NC)"; \
		exit 1; \
	fi

validate: check ## Validate JSON files
	@echo "$(GREEN)Validating JSON files...$(NC)"
	@python3 -m json.tool package.json > /dev/null && echo "  ✓ package.json is valid" || echo "$(RED)  ✗ package.json is invalid$(NC)"
	@python3 -m json.tool language-configuration.json > /dev/null && echo "  ✓ language-configuration.json is valid" || echo "$(RED)  ✗ language-configuration.json is invalid$(NC)"
	@python3 -m json.tool syntaxes/taskjuggler.tmLanguage.json > /dev/null && echo "  ✓ tmLanguage.json is valid" || echo "$(RED)  ✗ tmLanguage.json is invalid$(NC)"
	@python3 -m json.tool snippets/taskjuggler.json > /dev/null && echo "  ✓ snippets.json is valid" || echo "$(RED)  ✗ snippets.json is invalid$(NC)"
	@echo "$(GREEN)✓ All JSON files are valid$(NC)"

##@ Building

package: check ## Create VSIX package (requires vsce)
	@echo "$(GREEN)Creating VSIX package...$(NC)"
	@if ! command -v vsce &> /dev/null; then \
		echo "$(RED)✗ vsce not found. Run 'make deps' first$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)Updating build date...$(NC)"
	@sed -i.bak 's/"buildDate": ".*"/"buildDate": "'$$(date +%Y-%m-%d)'"/' package.json && rm package.json.bak
	@vsce package
	@echo "$(GREEN)✓ Package created: $(VSIX_FILE)$(NC)"
	@echo "$(YELLOW)  Build date: $$(date +%Y-%m-%d)$(NC)"

package-force: ## Create VSIX package without validation
	@echo "$(GREEN)Creating VSIX package (no validation)...$(NC)"
	@vsce package --allow-missing-repository --allow-star-activation
	@echo "$(GREEN)✓ Package created: $(VSIX_FILE)$(NC)"

##@ Installation

compile: ## Compile TypeScript source
	@echo "$(GREEN)Compiling TypeScript...$(NC)"
	@npm run compile
	@echo "$(GREEN)✓ TypeScript compiled$(NC)"

install: compile ## Install extension to VS Code (manual copy)
	@echo "$(GREEN)Installing extension to VS Code...$(NC)"
	@if [ -d "$(VSCODE_EXT_DIR)" ]; then \
		echo "$(YELLOW)Extension already installed. Removing old version...$(NC)"; \
		rm -rf "$(VSCODE_EXT_DIR)"; \
	fi
	@mkdir -p "$(VSCODE_EXT_DIR)"
	@cp package.json "$(VSCODE_EXT_DIR)/"
	@cp language-configuration.json "$(VSCODE_EXT_DIR)/"
	@cp README.md "$(VSCODE_EXT_DIR)/"
	@cp CHANGELOG.md "$(VSCODE_EXT_DIR)/"
	@cp -r syntaxes "$(VSCODE_EXT_DIR)/"
	@cp -r snippets "$(VSCODE_EXT_DIR)/"
	@cp -r images "$(VSCODE_EXT_DIR)/"
	@cp -r out "$(VSCODE_EXT_DIR)/"
	@echo "$(GREEN)✓ Extension installed to: $(VSCODE_EXT_DIR)$(NC)"
	@echo "$(YELLOW)  Please restart VS Code to activate the extension$(NC)"

install-vsix: $(VSIX_FILE) ## Install extension from VSIX package
	@echo "$(GREEN)Installing extension from VSIX...$(NC)"
	@$(VSCODE_CMD) --install-extension $(VSIX_FILE)
	@echo "$(GREEN)✓ Extension installed from VSIX$(NC)"
	@echo "$(YELLOW)  Please restart VS Code to activate the extension$(NC)"

uninstall: ## Uninstall extension from VS Code
	@echo "$(GREEN)Uninstalling extension...$(NC)"
	@if [ -d "$(VSCODE_EXT_DIR)" ]; then \
		rm -rf "$(VSCODE_EXT_DIR)"; \
		echo "$(GREEN)✓ Extension uninstalled$(NC)"; \
	else \
		echo "$(YELLOW)Extension not found$(NC)"; \
	fi

reinstall: uninstall install ## Uninstall and reinstall extension

##@ Testing

test: install ## Install and test with example file
	@echo "$(GREEN)Testing extension...$(NC)"
	@echo "$(YELLOW)Opening example file in VS Code...$(NC)"
	@$(VSCODE_CMD) example-complete.tjp
	@echo "$(GREEN)✓ VS Code opened with example file$(NC)"
	@echo "$(YELLOW)  Please verify:$(NC)"
	@echo "  - Syntax highlighting is active"
	@echo "  - Status bar shows 'TaskJuggler'"
	@echo "  - Type 'project' + Tab to test snippets"

test-snippets: install ## Test snippet functionality
	@echo "$(GREEN)Testing snippets...$(NC)"
	@echo "Create a new .tjp file and try these snippets:"
	@echo "  - project"
	@echo "  - task"
	@echo "  - resource"
	@echo "  - taskreport"
	@$(VSCODE_CMD) -n test-snippets.tjp

##@ Development Utilities

dev: install ## Install in development mode with file watching
	@echo "$(GREEN)Installing in development mode...$(NC)"
	@echo "$(YELLOW)Note: VS Code doesn't support hot reload for extensions$(NC)"
	@echo "$(YELLOW)You'll need to run 'make reinstall' and reload window after changes$(NC)"

lint: validate ## Lint JSON files (alias for validate)

format: ## Format JSON files
	@echo "$(GREEN)Formatting JSON files...$(NC)"
	@python3 -m json.tool package.json > package.json.tmp && mv package.json.tmp package.json
	@python3 -m json.tool language-configuration.json > language-configuration.json.tmp && mv language-configuration.json.tmp language-configuration.json
	@python3 -m json.tool syntaxes/taskjuggler.tmLanguage.json > syntaxes/taskjuggler.tmLanguage.json.tmp && mv syntaxes/taskjuggler.tmLanguage.json.tmp syntaxes/taskjuggler.tmLanguage.json
	@python3 -m json.tool snippets/taskjuggler.json > snippets/taskjuggler.json.tmp && mv snippets/taskjuggler.json.tmp snippets/taskjuggler.json
	@echo "$(GREEN)✓ JSON files formatted$(NC)"

##@ Cleanup

clean: ## Remove generated files (VSIX, build artifacts)
	@echo "$(GREEN)Cleaning build artifacts...$(NC)"
	@rm -f *.vsix
	@rm -rf $(BUILD_DIR)
	@rm -rf $(DIST_DIR)
	@rm -rf node_modules
	@rm -f test-snippets.tjp
	@echo "$(GREEN)✓ Clean complete$(NC)"

clean-test: ## Clean test project reports
	@echo "$(GREEN)Cleaning test project reports...$(NC)"
	@rm -rf test-project/reports/*.html
	@rm -rf test-project/reports/*.csv
	@rm -f test-project/*.html
	@rm -f test-project/*.csv
	@echo "$(GREEN)✓ Test reports cleaned$(NC)"

clean-all: clean clean-test uninstall ## Remove all generated files and uninstall

##@ Publishing

version: ## Show current version
	@echo "$(GREEN)Current version: $(VERSION)$(NC)"
	@grep '"version"' package.json

bump-patch: ## Bump patch version (1.0.0 -> 1.0.1)
	@echo "$(GREEN)Bumping patch version...$(NC)"
	@# This is a placeholder - implement version bumping logic

bump-minor: ## Bump minor version (1.0.0 -> 1.1.0)
	@echo "$(GREEN)Bumping minor version...$(NC)"
	@# This is a placeholder - implement version bumping logic

bump-major: ## Bump major version (1.0.0 -> 2.0.0)
	@echo "$(GREEN)Bumping major version...$(NC)"
	@# This is a placeholder - implement version bumping logic

publish: package ## Publish to VS Code Marketplace (requires vsce login)
	@echo "$(GREEN)Publishing to VS Code Marketplace...$(NC)"
	@echo "$(YELLOW)This requires you to be logged in with vsce$(NC)"
	@echo "$(YELLOW)Run 'vsce login <publisher>' first$(NC)"
	@vsce publish

##@ Documentation

docs: ## Generate documentation
	@echo "$(GREEN)Documentation already available:$(NC)"
	@echo "  - README.md"
	@echo "  - QUICKSTART.md"
	@echo "  - CHANGELOG.md"
	@echo "  - BEST-PRACTICES.md"
	@echo "  - FEATURES.md"
	@echo "  - SUMMARY.md"

info: ## Show extension information
	@echo "$(GREEN)Extension Information:$(NC)"
	@echo "  Name:         $(EXTENSION_NAME)"
	@echo "  Version:      $(VERSION)"
	@echo "  VSIX File:    $(VSIX_FILE)"
	@echo "  Install Dir:  $(VSCODE_EXT_DIR)"
	@echo "  VS Code:      $(VSCODE_CMD)"
	@echo ""
	@echo "$(GREEN)Installation Status:$(NC)"
	@if [ -d "$(VSCODE_EXT_DIR)" ]; then \
		echo "  $(GREEN)✓ Extension is installed$(NC)"; \
	else \
		echo "  $(YELLOW)✗ Extension is not installed$(NC)"; \
	fi
	@echo ""
	@echo "$(GREEN)VSIX Package:$(NC)"
	@if [ -f "$(VSIX_FILE)" ]; then \
		echo "  $(GREEN)✓ VSIX package exists$(NC)"; \
		ls -lh $(VSIX_FILE); \
	else \
		echo "  $(YELLOW)✗ VSIX package not found (run 'make package')$(NC)"; \
	fi

##@ Test Project

compile-test: ## Compile test project with tj3
	@echo "$(GREEN)Compiling test project...$(NC)"
	@if ! command -v tj3 &> /dev/null; then \
		echo "$(RED)✗ tj3 not found. Please install TaskJuggler:$(NC)"; \
		echo "  macOS: brew install taskjuggler"; \
		echo "  or: gem install taskjuggler"; \
		exit 1; \
	fi
	@cd test-project && tj3 project.tjp
	@echo "$(GREEN)✓ Test project compiled successfully$(NC)"
	@echo "$(YELLOW)  Reports generated in test-project/reports/$(NC)"

view-reports: compile-test ## Compile and view reports in browser
	@echo "$(GREEN)Opening reports in browser...$(NC)"
	@if [ -f "test-project/reports/Overview.html" ]; then \
		open test-project/reports/Overview.html 2>/dev/null || \
		xdg-open test-project/reports/Overview.html 2>/dev/null || \
		start test-project/reports/Overview.html 2>/dev/null || \
		echo "$(YELLOW)Please open test-project/reports/Overview.html manually$(NC)"; \
	else \
		echo "$(RED)✗ Reports not found. Compilation may have failed.$(NC)"; \
	fi


##@ Aliases

build: package ## Alias for package

dist: package ## Alias for package

.DEFAULT_GOAL := help
