<<<<<<< HEAD
# Kurotsume-sheet
=======
# Scheda del Personaggio — Kurotsume (D&D 5e)

App web in React + Material UI + SCSS, responsive (desktop, tablet, mobile),
per la scheda del personaggio di Kurotsume, livello 11.

## Caratteristiche

- Tutti i campi sono modificabili: basta cliccarci sopra.
- I valori derivati (modificatori, bonus alle abilità, tiri salvezza, CA,
  CD incantesimi, peso trasportato, ecc.) si aggiornano automaticamente
  quando cambi un punteggio caratteristica o un oggetto nell'inventario.
- Le capacità con un numero limitato di utilizzi (Second Wind, Azione
  Impetuosa, Indomito, Punti Stregoneria, Teletrasporto, Dadi Superiorità,
  Dadi Vita, slot incantesimo) hanno dei pallini cliccabili: clicca per
  consumare un utilizzo, clicca di nuovo per recuperarlo.
- Sezioni "Abilità" e "Talenti e Capacità" ingrandite, come richiesto.
- **Talenti e Capacità**: nome e descrizione di ogni voce sono modificabili,
  puoi aggiungerne di nuove o rimuoverle liberamente in ognuno dei quattro
  gruppi (Talenti, Guerriero, Stregone, Razziali), e impostare/rimuovere il
  contatore di utilizzi per ciascuna.
- **Incantesimi**: ogni incantesimo mostra tempo di lancio, tipo di azione,
  gittata, componenti ed effetti, tutti modificabili; puoi aggiungerne o
  rimuoverne quanti vuoi, e i gruppi per livello si aggiornano da soli.
- **Attacchi**: ogni arma è completamente modificabile (nome, caratteristica
  usata, bonus magico, bonus danno extra, dado e tipo di danno, proprietà),
  e puoi aggiungere o rimuovere armi liberamente.
- **Inventario**: ogni oggetto può avere una breve descrizione sotto al nome.
- Tutto lo stato viene salvato automaticamente nel browser (localStorage),
  quindi le modifiche non si perdono ricaricando la pagina. Il pulsante
  "Ripristina dati originali" in fondo alla pagina riporta la scheda ai
  dati di partenza di Kurotsume.

## Avvio in locale

Serve [Node.js](https://nodejs.org/) (versione 18 o superiore) installato
sul computer.

1. Apri il terminale nella cartella del progetto (dove si trova questo file).
2. Installa le dipendenze:

   ```bash
   npm install
   ```

3. Avvia il server di sviluppo:

   ```bash
   npm run dev
   ```

4. Apri nel browser l'indirizzo che compare in console (di norma
   `http://localhost:5173`).

Per generare una build ottimizzata da pubblicare online:

```bash
npm run build
npm run preview   # per testare in locale la build di produzione
```

## Note sui dati

- I pesi degli oggetti dell'inventario non erano specificati nel file
  originale del personaggio: sono stati stimati dai pesi ufficiali del
  Manuale del Giocatore (convertiti in kg) per gli oggetti equivalenti.
  Sono comunque modificabili liberamente dalla scheda.
- Le due abilità mancanti nella scheda originale (Storia, Intuizione) sono
  state aggiunte secondo l'elenco ufficiale delle 18 abilità di D&D 5e,
  senza competenza, coerentemente con il valore di Intuizione Passiva già
  presente nei dati forniti.
- "Second Wind" è stato tradotto con il nome ufficiale italiano
  "Recuperare Energie".
- Il trucchetto "Passo di Gelo" indicato nel file originale non corrisponde
  a un incantesimo ufficiale: i dettagli inseriti sono quelli di "Raggio di
  Gelo" (Ray of Frost), il più vicino per tema ed effetto. Nome e testo
  restano comunque modificabili in scheda.

## Struttura del progetto

```
src/
  components/     Componenti dell'interfaccia (header, pannelli, campi editabili…)
  context/        Stato globale del personaggio (React Context + localStorage)
  data/           Dati di partenza del personaggio
  hooks/          Calcoli derivati (modificatori, CA, peso, CD incantesimi…)
  styles/         Foglio di stile SCSS globale
  utils/          Funzioni di regolamento D&D 5e (modificatori, bonus competenza…)
```
>>>>>>> 3e518c4 (Aggiornamento scheda Kurotsume)
