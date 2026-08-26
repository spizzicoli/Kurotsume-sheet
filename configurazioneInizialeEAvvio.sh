#!/bin/bash
set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

log() {
  echo -e "\n[INFO] $1"
}

log "Verifico se Node.js e npm sono installati..."
if ! command -v node >/dev/null 2>&1; then
  if command -v brew >/dev/null 2>&1; then
    log "Node.js non trovato. Provo a installarlo con Homebrew..."
    brew install node
    if [ $? -ne 0 ]; then
      echo "Impossibile installare Node.js automaticamente con Homebrew." >&2
      echo "Installa Node.js LTS da https://nodejs.org/ oppure Homebrew da https://brew.sh/" >&2
      exit 1
    fi
  else
    echo "Node.js non trovato." >&2
    echo "Installa Homebrew da https://brew.sh/ oppure scarica Node.js LTS da https://nodejs.org/" >&2
    exit 1
  fi
fi

NODE_VERSION="$(node --version)"
NPM_VERSION="$(npm --version)"
echo "Node.js: $NODE_VERSION"
echo "npm: $NPM_VERSION"

log "Installo le dipendenze del progetto..."
npm install --include=dev
if [ $? -ne 0 ]; then
  echo "npm install non riuscito." >&2
  exit 1
fi

log "Verifico che il progetto compili correttamente..."
npm run build
if [ $? -ne 0 ]; then
  echo "npm run build ha fallito. Controlla il progetto prima di avviarlo." >&2
  exit 1
fi

PORT=5173
BROWSER_URL="http://localhost:$PORT"
log "Avvio il server di sviluppo Vite su $BROWSER_URL"

if command -v open >/dev/null 2>&1; then
  npm run dev -- --host 0.0.0.0 --port "$PORT" &
  SERVER_PID=$!
  sleep 3
  open "$BROWSER_URL"
  wait "$SERVER_PID"
else
  echo "Apri manualmente il browser su: $BROWSER_URL"
  npm run dev -- --host 0.0.0.0 --port "$PORT"
fi
