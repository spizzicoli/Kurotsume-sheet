Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $projectRoot

function Write-Info($msg) {
    Write-Host "`n[INFO] $msg" -ForegroundColor Cyan
}

function Ensure-Command($commandName, $installHint) {
    $cmd = Get-Command $commandName -ErrorAction SilentlyContinue
    if ($cmd) {
        return $true
    }

    Write-Info "Comando '$commandName' non trovato. Provo a installarlo..."

    if ($IsWindows) {
        try {
            & winget install --id OpenJS.NodeJS.LTS --accept-source-agreements --accept-package-agreements --silent
            if ($LASTEXITCODE -ne 0) { throw "winget install fallito" }
        }
        catch {
            try {
                & choco install nodejs-lts -y --no-progress
                if ($LASTEXITCODE -ne 0) { throw "choco install fallito" }
            }
            catch {
                Write-Error "Impossibile installare Node.js automaticamente. Scarica Node.js LTS da https://nodejs.org/ e riavvia il terminale."
                Write-Host "Suggerimento: $installHint" -ForegroundColor Yellow
                exit 1
            }
        }
    }
    elseif ($IsMacOS) {
        try {
            if (-not (Get-Command brew -ErrorAction SilentlyContinue)) {
                throw "Homebrew non trovato. Installa Homebrew da https://brew.sh/ e riavvia il terminale."
            }

            & brew install node
            if ($LASTEXITCODE -ne 0) { throw "brew install node fallito" }

            $brewBinPaths = @(
                '/opt/homebrew/bin',
                '/usr/local/bin'
            )
            foreach ($brewPath in $brewBinPaths) {
                if (Test-Path $brewPath) {
                    $env:PATH = "$brewPath;$env:PATH"
                }
            }
        }
        catch {
            Write-Error "Impossibile installare Node.js automaticamente su macOS: $($_.Exception.Message)"
            Write-Host "Suggerimento: $installHint" -ForegroundColor Yellow
            exit 1
        }
    }
    else {
        Write-Error "Sistema operativo non supportato da questo script: $($PSVersionTable.OS)"
        Write-Host "Suggerimento: $installHint" -ForegroundColor Yellow
        exit 1
    }

    if ($IsWindows) {
        $env:Path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine') + ';' + [System.Environment]::GetEnvironmentVariable('Path', 'User')
    }

    return $true
}

Write-Info "Verifico se Node.js e npm sono installati..."
Ensure-Command 'node' 'Installa Node.js LTS da https://nodejs.org/ e riavvia il terminale.'

$nodeVersion = (& node --version)
$npmVersion = (& npm --version)
Write-Host "Sistema: $([System.Runtime.InteropServices.RuntimeInformation]::OSDescription)" -ForegroundColor DarkGray
Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
Write-Host "npm: $npmVersion" -ForegroundColor Green

Write-Info "Installo le dipendenze del progetto..."
npm install --include=dev
if ($LASTEXITCODE -ne 0) {
    Write-Error "npm install non riuscito."
    exit 1
}

Write-Info "Verifico che il progetto compili correttamente..."
npm run build
if ($LASTEXITCODE -ne 0) {
    Write-Error "npm run build ha fallito. Controlla il progetto prima di avviarlo."
    exit 1
}

Write-Info "Avvio il server di sviluppo Vite..."
$port = 5173
$browserUrl = "http://localhost:$port"
$devCommand = "cd '$projectRoot'; npm run dev -- --host 0.0.0.0 --port $port"

try {
    if ($IsWindows) {
        Start-Process powershell -ArgumentList @('-NoExit', '-Command', $devCommand) | Out-Null
        Start-Sleep -Seconds 2
        Start-Process $browserUrl
    }
    elseif ($IsMacOS) {
        $macCommand = "cd '$projectRoot' && npm run dev -- --host 0.0.0.0 --port $port"
        Start-Process bash -ArgumentList @('-lc', $macCommand) | Out-Null
        Start-Sleep -Seconds 2
        & open $browserUrl 2>$null
    }
    else {
        Write-Error "L'avvio automatico del browser non è supportato su questo sistema."
    }

    Write-Host "`nServer avviato su: $browserUrl" -ForegroundColor Green
    Write-Host "Se la finestra non si apre, apri manualmente il link sopra." -ForegroundColor Yellow

    if ($IsWindows) {
        Write-Host "`nPremi un tasto per chiudere questo script..." -ForegroundColor DarkGray
        $null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
    }
}
catch {
    Write-Error "L'avvio del server non è riuscito: $($_.Exception.Message)"
    exit 1
}
