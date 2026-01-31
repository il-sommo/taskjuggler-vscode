# Makefile for TaskJuggler Test Project

.PHONY: all compile clean view help

# Default target
all: compile

# Compile the project
compile:
	@echo "Compiling TaskJuggler project..."
	tj3 project.tjp

# Clean compiled output
clean:
	@echo "Cleaning compiled files..."
	@rm -f *.html *.csv *.xml *.msp *.tjp.check
	@echo "Clean complete!"

# View the main report
view: compile
	@echo "Opening report..."
	@open Overview.html 2>/dev/null || xdg-open Overview.html 2>/dev/null || start Overview.html 2>/dev/null || echo "Please open Overview.html manually"

# Show help
help:
	@echo "TaskJuggler Test Project Makefile"
	@echo ""
	@echo "Available targets:"
	@echo "  make compile  - Compile the TaskJuggler project"
	@echo "  make clean    - Remove all compiled output files"
	@echo "  make view     - Compile and open the main report"
	@echo "  make help     - Show this help message"
	@echo ""
	@echo "Files cleaned by 'make clean':"
	@echo "  - *.html (HTML reports)"
	@echo "  - *.csv (CSV exports)"
	@echo "  - *.xml (XML exports)"
	@echo "  - *.msp (MS Project files)"
	@echo "  - *.tjp.check (Check files)"
