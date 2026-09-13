# Scheda del Personaggio — Kurotsume (D&D 5e) — app iOS + Supabase

App React + Material UI + SCSS, impacchettata come **app iOS nativa tramite
Capacitor** (progetto Xcode) e con **tutti i dati salvati su Supabase**
invece che nel browser: puoi installarla sul tuo iPhone da Mac e i dati
restano sincronizzati sul tuo progetto Supabase.

npm install
npm run build
npm run cap:add:ios     # solo la prima volta
npm run cap:sync
npm run cap:open:ios

## Come funziona l'architettura

- L'interfaccia (React/MUI/SCSS) resta la stessa di prima.
- **Capacitor** prende la build web (`npm run build`, cartella `dist/`) e la
  incapsula in un vero progetto Xcode: l'app gira a schermo intero come app
  nativa, con la sua icona sull'iPhone, ma "dentro" mostra la scheda web.
- **Supabase** sostituisce il salvataggio locale: ogni modifica ai campi
  viene salvata automaticamente (con un breve ritardo) sul tuo progetto
  Supabase, in 10 tabelle relazionali. Al riavvio dell'app i dati vengono
  ricaricati da lì.
- Se il database è vuoto (progetto Supabase appena creato), la primissima
  apertura dell'app lo popola automaticamente con i dati di partenza di
  Kurotsume: non devi inserire nulla a mano, basta aver lanciato la query
  di creazione delle tabelle.

## Cosa ti serve

- Un Mac con **Xcode** installato (dall'App Store) e i suoi **Command Line
  Tools**.
- **CocoaPods**, richiesto da Capacitor per iOS: se non ce l'hai,
  `sudo gem install cocoapods` oppure `brew install cocoapods`.
- **Node.js** 18 o superiore.
- Un **Apple ID** (basta un account personale gratuito) per firmare l'app e
  installarla sul tuo iPhone.
- Un account [Supabase](https://supabase.com) (il piano gratuito va bene).

---

## 1. Crea il progetto Supabase e le tabelle

1. Vai su [supabase.com](https://supabase.com) → crea un nuovo progetto.
2. Apri **SQL Editor** → **New query**.
3. Copia **tutto** il contenuto del file [`supabase/schema.sql`](./supabase/schema.sql)
   di questo progetto, incollalo e premi **Run**.
   Questo crea le 10 tabelle (`characters`, `character_classes`, `skills`,
   `attacks`, `feature_items`, `spells`, `spell_slots`, `hit_dice`,
   `inventory_items`, `player_notes`) con gli indici e i permessi necessari.
   Non serve nessun'altra query: l'app popolerà i dati da sola al primo avvio.
4. Vai su **Project Settings → API** e copia:
   - **Project URL**
   - **anon public key** (non la `service_role`, quella non va mai
     usata lato client)

## 2. Configura le credenziali Supabase nel progetto

Nella cartella del progetto:

```bash
cp .env.example .env
```

Apri `.env` e incolla i due valori copiati da Supabase:

```
VITE_SUPABASE_URL=https://tuo-progetto.supabase.co
VITE_SUPABASE_ANON_KEY=tua-chiave-anon-pubblica
```

## 3. Installa le dipendenze e prova in locale (facoltativo ma consigliato)

```bash
npm install
npm run dev
```

Apri l'indirizzo mostrato in console (di norma `http://localhost:5173`):
dovresti vedere la scheda caricarsi con i dati di Kurotsume presi da
Supabase. Modifica un campo e ricarica la pagina: se il valore resta, la
sincronizzazione funziona.

## 4. Crea il progetto Xcode con Capacitor

Sempre nella cartella del progetto:

```bash
npm run build          # genera la build web in dist/
npm run cap:add:ios    # SOLO la prima volta: crea la cartella ios/ con il progetto Xcode
npm run cap:sync       # copia la build dentro il progetto iOS (rifallo ad ogni modifica al codice)
npm run cap:open:ios   # apre il progetto in Xcode
```

## 5. Installa l'app sul tuo iPhone da Xcode

1. In Xcode, collega il tuo iPhone al Mac via cavo (o assicurati che sia
   sulla stessa rete Wi-Fi per il debug wireless) e sbloccalo.
2. Nel pannello a sinistra seleziona il progetto **App** → scheda
   **Signing & Capabilities**.
3. In **Team**, seleziona il tuo Apple ID (se non compare, aggiungilo da
   Xcode → Settings → Accounts).
4. In alto, dal menu dei dispositivi, scegli il tuo iPhone (invece del
   simulatore).
5. Premi ▶ **Run**. Xcode compila e installa l'app sul telefono.
6. La prima volta il telefono rifiuterà l'app perché non è firmata da un
   account sviluppatore verificato: vai su iPhone → **Impostazioni →
   Generali → VPN e gestione dispositivi**, tocca il tuo Apple ID e scegli
   **Fidati**. Poi riapri l'app dalla schermata Home.

Da questo momento l'app è installata come una qualsiasi altra: si apre
dall'icona, funziona offline per la visualizzazione (mostra l'ultimo stato
caricato) e si sincronizza con Supabase quando c'è connessione.

> Con un account sviluppatore gratuito l'app scade dopo 7 giorni e va
> reinstallata da Xcode con lo stesso procedimento (▶ Run). Con un account
> Apple Developer a pagamento (99 $/anno) dura un anno.

## Quando modifichi qualcosa in futuro

Ogni volta che cambi il codice React (non lo schema Supabase):

```bash
npm run cap:sync       # ricompila la parte web e la copia nel progetto iOS
npm run cap:open:ios   # riapri Xcode e premi ▶ Run
```

Non serve rifare `npm run cap:add:ios`: quello crea la cartella `ios/` una
sola volta.

---

## Funzionalità della scheda

- Tutti i campi sono modificabili: basta cliccarci sopra.
- I valori derivati (modificatori, bonus alle abilità, tiri salvezza, CA,
  CD incantesimi, peso trasportato, ecc.) si aggiornano automaticamente.
- Le capacità con un numero limitato di utilizzi hanno dei pallini
  cliccabili: clicca per consumare un utilizzo, clicca di nuovo per
  recuperarlo.
- **Talenti e Capacità**: nome e descrizione di ogni voce sono modificabili;
  puoi aggiungerne di nuove o rimuoverle in ognuno dei quattro gruppi
  (Talenti, Guerriero, Stregone, Razziali), con contatore di utilizzi
  opzionale per ciascuna.
- **Incantesimi**: ogni incantesimo mostra tempo di lancio, tipo di azione,
  gittata, componenti ed effetti, tutti modificabili; puoi aggiungerne o
  rimuoverne quanti vuoi.
- **Attacchi**: ogni arma è completamente modificabile (nome, caratteristica
  usata, bonus magico, bonus danno extra, dado e tipo di danno, proprietà),
  con aggiunta/rimozione libera.
- **Inventario**: ogni oggetto ha nome, peso, quantità e una descrizione
  opzionale; il peso trasportato si ricalcola da solo.
- Il pulsante "Ripristina dati originali" in fondo alla pagina sovrascrive
  il database Supabase con i dati di partenza di Kurotsume.

## Note sui dati

- I pesi degli oggetti dell'inventario non erano specificati nel file
  originale del personaggio: sono stati stimati dai pesi ufficiali del
  Manuale del Giocatore (convertiti in kg) per gli oggetti equivalenti.
- Le due abilità mancanti nella scheda originale (Storia, Intuizione) sono
  state aggiunte secondo l'elenco ufficiale delle 18 abilità di D&D 5e.
- "Second Wind" è stato tradotto con il nome ufficiale italiano
  "Recuperare Energie".
- Il trucchetto "Passo di Gelo" indicato nel file originale non corrisponde
  a un incantesimo ufficiale: i dettagli inseriti sono quelli di "Raggio di
  Gelo" (Ray of Frost), il più vicino per tema ed effetto. Nome e testo
  restano comunque modificabili in scheda.

## Nota sulla sicurezza dei dati

Questa app non ha un sistema di login: usa la chiave "anon" di Supabase per
leggere/scrivere direttamente dal telefono, con delle policy che permettono
l'accesso completo alle tabelle a chiunque abbia quella chiave (che è
comunque incorporata nell'app, non pubblica). Per un uso personale va bene;
se in futuro volessi condividere l'app con altre persone mantenendo schede
separate, si può aggiungere autenticazione Supabase e restringere le policy
per utente: fammelo sapere e aggiorniamo lo schema.

## Struttura del progetto

```
src/
  components/     Componenti dell'interfaccia (header, pannelli, campi editabili…)
  context/        Stato globale del personaggio (React Context + sync Supabase)
  data/           Dati di partenza del personaggio (usati per il primo popolamento)
  hooks/          Calcoli derivati (modificatori, CA, peso, CD incantesimi…)
  lib/            Client Supabase e funzioni di lettura/scrittura (repository)
  styles/         Foglio di stile SCSS globale
  utils/          Funzioni di regolamento D&D 5e (modificatori, bonus competenza…)
supabase/
  schema.sql      Script di creazione di tutte le tabelle (da eseguire una volta)
capacitor.config.json   Configurazione dell'app iOS
```
