#!/bin/bash

# Script di installazione automatica per l'estensione TaskJuggler VS Code
# Funziona su macOS e Linux

set -e

EXTENSION_NAME="taskjuggler-syntax-1.0.0"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TARGET_DIR="$HOME/.vscode/extensions/$EXTENSION_NAME"

echo "============================================"
echo "Installazione TaskJuggler Syntax per VS Code"
echo "============================================"
echo ""

# Verifica se VS Code è installato
if ! command -v code &> /dev/null; then
    echo "⚠️  ATTENZIONE: VS Code non sembra essere installato o 'code' non è nel PATH"
    echo "   Puoi comunque procedere con l'installazione manuale."
    echo ""
fi

# Verifica se l'estensione è già installata
if [ -d "$TARGET_DIR" ]; then
    echo "⚠️  L'estensione è già installata in: $TARGET_DIR"
    read -p "Vuoi sovrascrivere l'installazione esistente? (s/n) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "Installazione annullata."
        exit 0
    fi
    echo "Rimozione installazione esistente..."
    rm -rf "$TARGET_DIR"
fi

# Crea la directory target
echo "Creazione directory: $TARGET_DIR"
mkdir -p "$TARGET_DIR"

# Copia i file necessari
echo "Copia dei file..."
cp "$SOURCE_DIR/package.json" "$TARGET_DIR/"
cp "$SOURCE_DIR/language-configuration.json" "$TARGET_DIR/"
cp "$SOURCE_DIR/README.md" "$TARGET_DIR/"
cp "$SOURCE_DIR/CHANGELOG.md" "$TARGET_DIR/"
cp -r "$SOURCE_DIR/syntaxes" "$TARGET_DIR/"
cp -r "$SOURCE_DIR/snippets" "$TARGET_DIR/"
cp -r "$SOURCE_DIR/images" "$TARGET_DIR/"

# Verifica installazione
if [ -f "$TARGET_DIR/package.json" ]; then
    echo ""
    echo "✅ Installazione completata con successo!"
    echo ""
    echo "📁 Percorso installazione: $TARGET_DIR"
    echo ""
    echo "Per attivare l'estensione:"
    echo "  1. Riavvia Visual Studio Code"
    echo "  2. Apri un file .tjp o .tji"
    echo "  3. Il syntax highlighting sarà automaticamente attivo"
    echo ""
    echo "Per testare l'estensione, apri il file example.tjp:"
    echo "  code $SOURCE_DIR/example.tjp"
    echo ""
else
    echo ""
    echo "❌ Errore durante l'installazione"
    exit 1
fi
