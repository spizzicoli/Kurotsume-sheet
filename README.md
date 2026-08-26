# Kurotsume-sheet

Scheda del personaggio di Kurotsume in React + Material UI + SCSS, pensata per D&D 5e.

## Descrizione

Questa applicazione permette di gestire una scheda di personaggio completa, con campi editabili, calcoli automatici, incantesimi, inventario, attacchi, background e tutte le informazioni principali del personaggio.

## Funzioni principali

- Campi modificabili direttamente dalla scheda.
- Aggiornamento automatico di valori derivati (modificatori, bonus, CA, CD incantesimi, peso trasportato, ecc.).
- Gestione di abilità, tiri salvataggio, incantesimi e attacchi.
- Inventario con oggetti personalizzabili.
- Salvataggio automatico nel browser tramite localStorage.
- Pulsanti di backup con esportazione JSON e importazione di un file di salvataggio.
- Reset della scheda ai dati iniziali.
- Link diretto al repository GitHub.

## Requisiti

Per poter far partire il progetto serve:

- Windows 10/11 (per i file di bootstrap forniti in questa repo)
- Node.js 18+ consigliato
- npm
- accesso a Internet per scaricare le dipendenze iniziali

## Avvio rapido su un PC nuovo

Nel repository sono stati aggiunti due file di bootstrap:

- configurazioneInizialeEAvvio.cmd
- configurazioneInizialeEAvvio.ps1

Questi file fanno automaticamente tutto il necessario:

1. controllano se Node.js e npm sono installati
2. se mancano, li installano tramite winget o choco
3. eseguono npm install
4. eseguono npm run build per verificare che il progetto compili
5. avviano il server di sviluppo Vite
6. aprono il browser a http://localhost:5173

### Metodo più semplice

Doppio click su:

```powershell
configurazioneInizialeEAvvio.cmd
```

oppure da PowerShell:

```powershell
powershell -ExecutionPolicy Bypass -File .\configurazioneInizialeEAvvio.ps1
```

## Avvio manuale

Se vuoi farlo a mano, esegui:

```bash
npm install
npm run dev -- --host 0.0.0.0 --port 5173
```

Poi apri nel browser:

```text
http://localhost:5173
```

Per produrre una build di distribuzione:

```bash
npm run build
npm run preview
```

## Backup e recupero della scheda

La scheda supporta due tipi di salvataggio:

### 1) Salvataggio automatico in browser

Le modifiche vengono salvate automaticamente nel browser tramite localStorage.

Questo significa che riaprendo la scheda nello stesso dispositivo, normalmente i dati sono già lì.

### 2) Backup JSON

Cliccando sul pulsante "Salva modifiche" viene scaricato un file JSON con lo stato attuale della scheda.

Questo file può essere usato per:

- fare un backup locale del personaggio
- recuperare la scheda su un altro dispositivo
- riportare una versione precedente della scheda

Per ricaricare il backup:

- clicca su "Carica file"
- seleziona il file JSON scaricato
- la scheda verrà ripristinata con i dati contenuti nel file

## GitHub e push

Il repository è collegato a GitHub e il bottone "Repo GitHub" apre il progetto online.

Il push diretto da una SPA come questa non è equivalente a salvare i dati della scheda del personaggio: il codice front-end non può fare un git push con autenticazione privata dal browser.

Per pubblicare il repo da un PC con Git installato e autenticato, si usa normalmente:

```bash
git add .
git commit -m "Aggiornamento scheda"
git push origin main
```

## Struttura del progetto

```text
.
├── src/
│   ├── components/
│   ├── context/
│   ├── data/
│   ├── hooks/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   ├── main.jsx
│   └── theme.js
├── public/
├── package.json
├── package-lock.json
├── vite.config.js
├── index.html
├── configurazioneInizialeEAvvio.ps1
├── configurazioneInizialeEAvvio.cmd
├── README.md
└── .gitignore
```

## Note sui dati e sul progetto

- I pesi degli oggetti dell'inventario sono stati stimati e possono essere modificati liberamente.
- Le abilità mancanti sono state integrate coerentemente con i dati del personaggio.
- La scheda è pensata per essere facilmente adattabile a qualsiasi personaggio, non solo a Kurotsume.
- La struttura è modulare: i dati di stato sono separati dai componenti e i calcoli derivati sono gestiti in hook dedicati.

## Supporto

Per eventuali modifiche, aggiunte o correzioni al contenuto della scheda, è consigliato lavorare direttamente sui file in `src/data/initialCharacter.js`, `src/components/` e `src/styles/`.

## Licenza

Questo progetto è stato creato per uso personale e per gestione del personaggio Kurotsume. Eventuali modifiche e adattamenti sono liberi, ma va sempre mantenuto rispetto per i contenuti del gioco e del personaggio.
