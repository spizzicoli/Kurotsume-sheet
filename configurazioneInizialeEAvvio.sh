#!/bin/bash
set -u

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

log() {
  echo -e "\n[INFO] $1"
}

ensure_path_for_local_bin() {
  if [ -d "$HOME/homebrew/bin" ]; then
    export PATH="$HOME/homebrew/bin:$PATH"
  fi
  if [ -d "/opt/homebrew/bin" ]; then
    export PATH="/opt/homebrew/bin:$PATH"
  fi
  if [ -d "/usr/local/bin" ]; then
    export PATH="/usr/local/bin:$PATH"
  fi
}

install_homebrew_user_local() {
  local brew_prefix="$HOME/homebrew"
  log "Homebrew non ha accesso alla cartella di sistema. Provo a installarlo in una directory personale: $brew_prefix"

  mkdir -p "$brew_prefix"
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)" --prefix="$brew_prefix"
  if [ $? -ne 0 ]; then
    echo "Installazione di Homebrew nel prefisso personale fallita." >&2
    return 1
  fi

  export PATH="$brew_prefix/bin:$PATH"
  return 0
}

install_node_with_homebrew_or_fallback() {
  if command -v node >/dev/null 2>&1; then
    return 0
  fi

  ensure_path_for_local_bin

  if command -v brew >/dev/null 2>&1; then
    log "Node.js non trovato. Provo a installarlo con Homebrew..."
    brew install node
    if [ $? -eq 0 ]; then
      return 0
    fi

    echo "Homebrew è presente ma non riesce a installare Node.js nel percorso configurato dall'azienda." >&2
    echo "Provo con una installazione personale in $HOME/homebrew." >&2
    install_homebrew_user_local || return 1
    brew install node
    return $?
  fi

  if [ -x "$HOME/homebrew/bin/brew" ] || [ -x "$HOME/.homebrew/bin/brew" ]; then
    export PATH="$HOME/homebrew/bin:$HOME/.homebrew/bin:$PATH"
    brew install node
    return $?
  fi

  log "Homebrew non trovato. Provo a installare un Homebrew personale senza usare i permessi di sistema..."
  install_homebrew_user_local || return 1
  brew install node
  return $?
}

log "Verifico se Node.js e npm sono installati..."
if ! command -v node >/dev/null 2>&1; then
  if ! install_node_with_homebrew_or_fallback; then
    echo "Impossibile installare Node.js automaticamente in questa macchina aziendale." >&2
    echo "Opzioni possibili:" >&2
    echo "1) installa Node.js LTS da https://nodejs.org/ (funziona anche senza sudo)" >&2
    echo "2) usa nvm: https://github.com/nvm-sh/nvm" >&2
    echo "3) chiedi all'IT di rendere scrivibili /usr/local o /opt/homebrew" >&2
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
