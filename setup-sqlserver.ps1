# ==============================================================================
# SCRIPT: Habilitar SQL Server Browser y TCP/IP
# ==============================================================================
# IMPORTANTE: Este script debe ejecutarse como ADMINISTRADOR
# ==============================================================================

Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACIÓN DE SQL SERVER EXPRESS PARA CONEXIONES TCP/IP" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""

# 1. Iniciar y configurar SQL Server Browser
Write-Host "1. Configurando SQL Server Browser..." -ForegroundColor Yellow
try {
    Set-Service -Name "SQLBrowser" -StartupType Automatic
    Start-Service -Name "SQLBrowser"
    Write-Host "   ✓ SQL Server Browser iniciado correctamente" -ForegroundColor Green
} catch {
    Write-Host "   ✗ Error al configurar Browser: $_" -ForegroundColor Red
    Write-Host "   SOLUCIÓN: Ejecuta este script como Administrador (click derecho > Ejecutar como administrador)" -ForegroundColor Yellow
    exit 1
}

# 2. Verificar servicio
$browserStatus = Get-Service -Name "SQLBrowser"
Write-Host "   Estado: $($browserStatus.Status)" -ForegroundColor Cyan
Write-Host ""

# 3. Habilitar TCP/IP en SQL Server Express
Write-Host "2. Habil itando TCP/IP en SQL Server..." -ForegroundColor Yellow
Write-Host "   Para habilitar TCP/IP necesitas:" -ForegroundColor White
Write-Host "   a) Abrir 'SQL Server Configuration Manager'" -ForegroundColor White
Write-Host "   b) Ir a: SQL Server Network Configuration > Protocols for SQLEXPRESS" -ForegroundColor White
Write-Host "   c) Click derecho en 'TCP/IP' > Enable" -ForegroundColor White
Write-Host "   d) Reiniciar el servicio SQL Server (SQLEXPRESS)" -ForegroundColor White
Write-Host ""

# 4. Reiniciar SQL Server
Write-Host "3. ¿Reiniciar SQL Server ahora? (S/N): " -ForegroundColor Yellow -NoNewline
$respuesta = Read-Host

if ($respuesta -eq 'S' -or $respuesta -eq 's') {
    try {
        Restart-Service -Name "MSSQL`$SQLEXPRESS" -Force
        Write-Host "   ✓ SQL Server reiniciado" -ForegroundColor Green
    } catch {
        Write-Host "   ✗ Error al reiniciar: $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host "  CONFIGURACIÓN COMPLETADA" -ForegroundColor Cyan
Write-Host "=====================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Ahora intenta iniciar el servidor Node.js con: npm run dev" -ForegroundColor Green
Write-Host ""
