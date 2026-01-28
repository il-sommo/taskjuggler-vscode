# Script di installazione automatica per l'estensione TaskJuggler VS Code
# Funziona su Windows (PowerShell)

$ErrorActionPreference = "Stop"

$EXTENSION_NAME = "taskjuggler-syntax-1.0.0"
$SOURCE_DIR = $PSScriptRoot
$TARGET_DIR = "$env:USERPROFILE\.vscode\extensions\$EXTENSION_NAME"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Installazione TaskJuggler Syntax per VS Code" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verifica se VS Code è installato
$codeCommand = Get-Command code -ErrorAction SilentlyContinue
if (-not $codeCommand) {
    Write-Host "⚠️  ATTENZIONE: VS Code non sembra essere installato o 'code' non è nel PATH" -ForegroundColor Yellow
    Write-Host "   Puoi comunque procedere con l'installazione manuale." -ForegroundColor Yellow
    Write-Host ""
}

# Verifica se l'estensione è già installata
if (Test-Path $TARGET_DIR) {
    Write-Host "⚠️  L'estensione è già installata in: $TARGET_DIR" -ForegroundColor Yellow
    $response = Read-Host "Vuoi sovrascrivere l'installazione esistente? (s/n)"
    if ($response -notmatch '^[Ss]$') {
        Write-Host "Installazione annullata." -ForegroundColor Red
        exit 0
    }
    Write-Host "Rimozione installazione esistente..." -ForegroundColor Yellow
    Remove-Item -Path $TARGET_DIR -Recurse -Force
}

# Crea la directory target
Write-Host "Creazione directory: $TARGET_DIR" -ForegroundColor Green
New-Item -ItemType Directory -Path $TARGET_DIR -Force | Out-Null

# Copia i file necessari
Write-Host "Copia dei file..." -ForegroundColor Green
Copy-Item "$SOURCE_DIR\package.json" "$TARGET_DIR\" -Force
Copy-Item "$SOURCE_DIR\language-configuration.json" "$TARGET_DIR\" -Force
Copy-Item "$SOURCE_DIR\README.md" "$TARGET_DIR\" -Force
Copy-Item "$SOURCE_DIR\CHANGELOG.md" "$TARGET_DIR\" -Force
Copy-Item "$SOURCE_DIR\syntaxes" "$TARGET_DIR\" -Recurse -Force
Copy-Item "$SOURCE_DIR\snippets" "$TARGET_DIR\" -Recurse -Force
Copy-Item "$SOURCE_DIR\images" "$TARGET_DIR\" -Recurse -Force

# Verifica installazione
if (Test-Path "$TARGET_DIR\package.json") {
    Write-Host ""
    Write-Host "✅ Installazione completata con successo!" -ForegroundColor Green
    Write-Host ""
    Write-Host "📁 Percorso installazione: $TARGET_DIR" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Per attivare l'estensione:" -ForegroundColor White
    Write-Host "  1. Riavvia Visual Studio Code" -ForegroundColor White
    Write-Host "  2. Apri un file .tjp o .tji" -ForegroundColor White
    Write-Host "  3. Il syntax highlighting sarà automaticamente attivo" -ForegroundColor White
    Write-Host ""
    Write-Host "Per testare l'estensione, apri il file example.tjp:" -ForegroundColor White
    Write-Host "  code $SOURCE_DIR\example.tjp" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Errore durante l'installazione" -ForegroundColor Red
    exit 1
}
