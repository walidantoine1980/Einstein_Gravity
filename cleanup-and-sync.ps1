# Sync and Cleanup Script for Relativity Simulator
# Usage: Run this to clean up node_modules and sync code

$ProjectDir = Get-Location
$ModulesToRemove = @("node_modules", "node_modules_old", "node_modules_v_old", "dist")

Write-Host "--- Starting Cleanup ---" -ForegroundColor Cyan

foreach ($folder in $ModulesToRemove) {
    if (Test-Path "$ProjectDir\$folder") {
        Write-Host "Removing $folder..." -ForegroundColor Yellow
        Remove-Item -Recurse -Force "$ProjectDir\$folder" -ErrorAction SilentlyContinue
    }
}

Write-Host "Cleanup complete! Google Drive will now sync much faster." -ForegroundColor Green
Write-Host "To reinstall dependencies locally, run: npm install" -ForegroundColor Cyan
