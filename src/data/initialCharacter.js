// Dati di partenza ricostruiti fedelmente da "kurotsume_11.txt".
// - I pesi dell'inventario non erano specificati nel file originale: sono
//   stati stimati dai pesi ufficiali PHB degli oggetti equivalenti
//   (convertiti in kg) e sono comunque modificabili liberamente.
// - I dettagli degli incantesimi (tempo di lancio, gittata, componenti,
//   effetti) sono quelli ufficiali del Manuale del Giocatore, con i danni
//   dei trucchetti calcolati per un personaggio di livello 11 (3 dadi).
// - Il trucchetto "Passo di Gelo" indicato nel file originale non
//   corrisponde a un nome ufficiale: i dati riportati sono quelli di
//   "Raggio di Gelo" (Ray of Frost), l'incantesimo più vicino per tema ed
//   effetto. Il nome resta comunque modificabile in scheda.
// - "Second Wind" è stato tradotto con il nome ufficiale italiano
//   "Recuperare Energie".

let uid = 0
const id = (p) => `${p}-${++uid}`

const initialCharacter = {
  info: {
    nome: 'Kurotsume',
    immagine: '/kurotsume.png',
    razza: 'Shadar-Kai (Morte)',
    classi: [
      { nome: 'Guerriero', sottoclasse: 'Maestro di Battaglia', livello: 8 },
      { nome: 'Stregone', sottoclasse: 'Ombra', livello: 3 }
    ],
    livelloTotale: 11,
    allineamento: 'Neutrale',
    eta: 90,
    taglia: 'Media',
    velocita: 9,
    esperienza: '—',
    ispirazioneEroica: false
  },

  abilities: {
    for: 18,
    des: 12,
    cos: 18,
    int: 8,
    sag: 10,
    car: 16
  },

  savingThrows: {
    for: true,
    des: false,
    cos: true,
    int: false,
    sag: false,
    car: false
  },

  skills: [
    { id: 'acrobazia', nome: 'Acrobazia', abilita: 'des', competenza: false },
    { id: 'addestrare', nome: 'Addestrare Animali', abilita: 'sag', competenza: false },
    { id: 'arcana', nome: 'Arcana', abilita: 'int', competenza: false },
    { id: 'atletica', nome: 'Atletica', abilita: 'for', competenza: true },
    { id: 'furtivita', nome: 'Furtività', abilita: 'des', competenza: false },
    { id: 'inganno', nome: 'Inganno', abilita: 'car', competenza: false },
    { id: 'indagare', nome: 'Indagare', abilita: 'int', competenza: false },
    { id: 'intimidire', nome: 'Intimidire', abilita: 'car', competenza: true },
    { id: 'intrattenere', nome: 'Intrattenere', abilita: 'car', competenza: false },
    { id: 'intuizione', nome: 'Intuizione', abilita: 'sag', competenza: false },
    { id: 'medicina', nome: 'Medicina', abilita: 'sag', competenza: false },
    { id: 'natura', nome: 'Natura', abilita: 'int', competenza: false },
    { id: 'percezione', nome: 'Percezione', abilita: 'sag', competenza: true },
    { id: 'persuasione', nome: 'Persuasione', abilita: 'car', competenza: true },
    { id: 'rapidita', nome: 'Rapidità di Mano', abilita: 'des', competenza: false },
    { id: 'religione', nome: 'Religione', abilita: 'int', competenza: false },
    { id: 'sopravvivenza', nome: 'Sopravvivenza', abilita: 'sag', competenza: false },
    { id: 'storia', nome: 'Storia', abilita: 'int', competenza: true }
  ],

  combat: {
    acBase: 18,
    acDexBonus: true,
    acAltriBonus: 0,
    hpMax: 120,
    hpCurrent: 120,
    hpTemp: 0,
    hitDice: [
      { id: 'hd-guerriero', dado: 'd10', classe: 'Guerriero', totale: 8, usati: 0 },
      { id: 'hd-stregone', dado: 'd6', classe: 'Stregone', totale: 3, usati: 0 }
    ]
  },

  attacks: [
    {
      id: id('atk'),
      nome: 'Katana Spietata +3',
      abilita: 'for',
      bonusMagico: 3,
      bonusDannoExtra: 2,
      dadoDanno: '1d8',
      tipoDanno: 'Tagliente',
      proprieta: ['Finesse', 'Versatile (1d10)', 'Magica', 'Spietata']
    },
    {
      id: id('atk'),
      nome: 'Tantō',
      abilita: 'des',
      bonusMagico: 1,
      bonusDannoExtra: 2,
      dadoDanno: '1d4',
      tipoDanno: 'Perforante',
      proprieta: ['Leggera', 'Finesse', 'Da lancio (6/18 m)']
    },
    {
      id: id('atk'),
      nome: 'Kunai',
      abilita: 'des',
      bonusMagico: 1,
      bonusDannoExtra: 2,
      dadoDanno: '1d4',
      tipoDanno: 'Tagliente',
      proprieta: ['Leggera', 'Da lancio (6/18 m)', 'Precisa']
    }
  ],

  featureGroups: {
    talenti: [
      {
        id: id('feat'),
        nome: 'Iniziato alla Magia (Stregone)',
        descrizione:
          'Concede +1 a Carisma (già incluso nel punteggio), il trucchetto Amicizia e gli incantesimi aggiuntivi Invisibilità e Infliggi Ferite (lanciabili una volta ciascuno per riposo lungo, oltre agli slot incantesimo normali).',
        usiMax: 0,
        usiSpesi: 0
      }
    ],
    guerriero: [
      {
        id: id('feat'),
        nome: 'Attacco Extra (2 attacchi)',
        descrizione: 'Puoi attaccare due volte, invece di una, ogni volta che compi l\u2019azione Attacco nel tuo turno.',
        usiMax: 0,
        usiSpesi: 0
      },
      {
        id: id('feat'),
        nome: 'Stile di Combattimento: Duellante',
        descrizione: 'Quando impugni un\u2019arma da mischia in una sola mano e nessun\u2019altra arma, ottieni +2 ai tiri per i danni con quell\u2019arma.',
        usiMax: 0,
        usiSpesi: 0
      },
      {
        id: id('feat'),
        nome: 'Recuperare Energie',
        descrizione: 'Azione bonus: recuperi 1d10 + livello da guerriero (8) Punti Ferita. Si ricarica con un riposo breve o lungo.',
        usiMax: 1,
        usiSpesi: 0
      },
      {
        id: id('feat'),
        nome: 'Azione Impetuosa',
        descrizione: 'Nel tuo turno puoi compiere un\u2019azione aggiuntiva, oltre alla tua azione normale e a un\u2019eventuale azione bonus. Si ricarica con un riposo breve o lungo.',
        usiMax: 1,
        usiSpesi: 0
      },
      {
        id: id('feat'),
        nome: 'Indomito',
        descrizione: 'Puoi ripetere un tiro salvezza fallito, ma devi accettare il nuovo risultato. Si ricarica con un riposo lungo.',
        usiMax: 1,
        usiSpesi: 0
      },
      {
        id: id('feat'),
        nome: 'Dadi Superiorità (d8) — Maestro di Battaglia',
        descrizione: 'Manovre conosciute:\n\nAttacco Preciso: attacco con arma + 1 dado superiorità al tiro per colpire prima di sapere se colpirei.\n\nAttacco Disarmante: attacco con arma + 1 dado superiorità ai danni, nemico TS FOR fallisce disarmato.\n\nAttacco Sbilanciante: attacco con arma + 1 dado superiorità ai danni, nemico TS FOR fallisce prono.\n\nAttacco Minaccioso: attacco con arma, + 1 dado superiorità ai danni, nemico TS SAG fallisce spaventato da me fino alla fine del mio turno successivo.\n\nSi ricaricano con un riposo breve o lungo.',
        usiMax: 4,
        usiSpesi: 0
      }
    ],
    stregone: [
      {
        id: id('feat'),
        nome: 'Punti Stregoneria',
        descrizione: 'Risorsa spendibile per applicare la Metamagia o convertibile in slot incantesimo aggiuntivi. Si ricaricano con un riposo lungo.',
        usiMax: 3,
        usiSpesi: 0
      },
      {
        id: id('feat'),
        nome: 'Oscurità del Sangue d\u2019Ombra',
        descrizione: 'Puoi lanciare Oscurità spendendo Punti Stregoneria senza consumare uno slot incantesimo, e hai resistenza ai danni necrotici all\u2019interno della sua area.',
        usiMax: 0,
        usiSpesi: 0
      },
      {
        id: id('feat'),
        nome: 'Affinità con l\u2019Ombra',
        descrizione: 'Hai vantaggio ai tiri di Furtività quando ti trovi in una zona di penombra o di oscurità totale.',
        usiMax: 0,
        usiSpesi: 0
      },
    ],
    razziali: [
      {
        id: id('feat'),
        nome: 'Teletrasporto Shadar-Kai',
        descrizione: 'Come azione bonus ti teletrasporti fino a 9 m in uno spazio libero che riesci a vedere. Fino all\u2019inizio del tuo turno successivo ottieni resistenza a tutti i danni. Si ricarica con un riposo lungo (o breve a partire dal 3° livello Shadar-Kai).',
        usiMax: 3,
        usiSpesi: 0
      },
      {
        id: id('feat'),
        nome: 'Resistenza Necrotica',
        descrizione: 'Hai resistenza ai danni necrotici.',
        usiMax: 0,
        usiSpesi: 0
      }
    ]
  },

  spells: {
    spellPoints: 3,
    incantesimi: [
      {
        id: id('spell'),
        nome: 'Stretta Folgorante',
        livello: 0,
        tempoLancio: '1 azione',
        tipoAzione: 'Azione',
        gittata: 'Contatto',
        componenti: 'V, S',
        effetti:
          'Attacco in mischia con incantesimo (vantaggio se il bersaglio indossa armatura di metallo). Se colpisci: 3d8 danni da fulmine (scala con il livello del personaggio) e il bersaglio non può compiere reazioni fino all\u2019inizio del suo turno successivo.',
        daTalento: false
      },
      {
        id: id('spell'),
        nome: 'Passo di Gelo',
        livello: 0,
        tempoLancio: '1 azione',
        tipoAzione: 'Azione',
        gittata: '18 m',
        componenti: 'V, S',
        effetti:
          'Attacco a distanza con incantesimo. Se colpisci: 3d8 danni da freddo e la velocità del bersaglio è ridotta di 3 m fino all\u2019inizio del tuo turno successivo.',
        daTalento: false
      },
      {
        id: id('spell'),
        nome: 'Amicizia',
        livello: 0,
        tempoLancio: '1 azione',
        tipoAzione: 'Azione',
        gittata: 'Te stesso',
        componenti: 'S, M (un pizzico di trucco applicato sul viso)',
        effetti:
          'Per la durata, hai vantaggio alle prove di Carisma verso una creatura non ostile che scegli. Quando l\u2019incantesimo termina, il bersaglio capisce di essere stato influenzato magicamente e può diventare ostile. Durata: Concentrazione, fino a 1 minuto.',
        daTalento: false
      },
      {
        id: id('spell'),
        nome: 'Scudo',
        livello: 1,
        tempoLancio: '1 reazione',
        tipoAzione: 'Reazione',
        gittata: 'Te stesso',
        componenti: 'V, S',
        effetti:
          'Scatenata quando vieni colpito da un tiro per colpire o sei bersaglio dell\u2019incantesimo Dardo Incantato. Fino all\u2019inizio del tuo turno successivo ottieni +5 alla CA (incluso contro l\u2019attacco scatenante) e immunità ai danni da Dardo Incantato. Durata: 1 turno.',
        daTalento: false
      },
      {
        id: id('spell'),
        nome: 'Ritirata Rapida',
        livello: 1,
        tempoLancio: '1 azione bonus',
        tipoAzione: 'Azione Bonus',
        gittata: 'Te stesso',
        componenti: 'V, S',
        effetti: 'Per la durata puoi usare Scatto come azione bonus in ogni tuo turno. Durata: Concentrazione, fino a 10 minuti.',
        daTalento: false
      },
      {
        id: id('spell'),
        nome: 'Onda Tonante',
        livello: 1,
        tempoLancio: '1 azione',
        tipoAzione: 'Azione',
        gittata: 'Te stesso (cubo di 4,5 m)',
        componenti: 'V, S, M (un pizzico di lana o pelo di castoro)',
        effetti:
          'Ogni creatura nell\u2019area effettua un TS su Costituzione: se fallisce subisce 2d8 danni tonanti ed è spinta di 3 m; se ha successo subisce metà danni senza essere spinta. Oggetti non fissati e non indossati nell\u2019area vengono spinti di 3 m.',
        daTalento: false
      },
      {
        id: id('spell'),
        nome: 'Infliggi Ferite',
        livello: 1,
        tempoLancio: '1 azione',
        tipoAzione: 'Azione',
        gittata: 'Contatto',
        componenti: 'V, S',
        effetti: 'Attacco in mischia con incantesimo. Se colpisci: 3d10 danni necrotici.',
        daTalento: true
      },
      {
        id: id('spell'),
        nome: 'Immagine Speculare',
        livello: 2,
        tempoLancio: '1 azione',
        tipoAzione: 'Azione',
        gittata: 'Te stesso',
        componenti: 'V, S',
        effetti:
          'Crei tre duplicati illusori di te stesso. Finché durano, ogni volta che vieni bersagliato da un attacco tira 1d20: con un risultato sufficiente a colpire, l\u2019attacco colpisce un duplicato invece di te. Ogni colpo subito distrugge un duplicato. Durata: 1 minuto.',
        daTalento: false
      },
      {
        id: id('spell'),
        nome: 'Passo Velato',
        livello: 2,
        tempoLancio: '1 azione bonus',
        tipoAzione: 'Azione Bonus',
        gittata: 'Te stesso',
        componenti: 'V',
        effetti: 'Ti circondi brevemente di nebbia argentea e ti teletrasporti fino a 9 m in uno spazio libero che riesci a vedere.',
        daTalento: false
      },
      {
        id: id('spell'),
        nome: 'Oscurità',
        livello: 2,
        tempoLancio: '1 azione',
        tipoAzione: 'Azione',
        gittata: '18 m',
        componenti: 'V, M (pece e carbone)',
        effetti:
          'Oscurità magica riempie una sfera di raggio 4,5 m centrata su un punto entro gittata, oscurando la visione normale e la scurovisione. Durata: Concentrazione, fino a 10 minuti.',
        daTalento: false
      },
      {
        id: id('spell'),
        nome: 'Invisibilità',
        livello: 2,
        tempoLancio: '1 azione',
        tipoAzione: 'Azione',
        gittata: 'Contatto',
        componenti: 'V, S, M (un ciglio d\u2019occhio avvolto nella gomma arabica)',
        effetti:
          'La creatura toccata diventa invisibile finché l\u2019incantesimo non termina. L\u2019effetto termina anticipatamente se il bersaglio attacca o lancia un incantesimo. Durata: Concentrazione, fino a 1 ora.',
        daTalento: true
      }
    ],
    slots: [
      { livello: 1, usiMax: 4, usiSpesi: 0 },
      { livello: 2, usiMax: 3, usiSpesi: 0 },
      { livello: 3, usiMax: 2, usiSpesi: 0 }
    ]
  },

  inventory: [
    { id: id('item'), nome: 'Armatura completa +1', descrizione: 'Piastre annerite dal rituale del clan; concede CA 18 base.', peso: 29.5, quantita: 1 },
    { id: id('item'), nome: 'Katana Spietata +3', descrizione: 'Temprata con frammenti di anima; arma principale.', peso: 1.4, quantita: 1 },
    { id: id('item'), nome: 'Tantō', descrizione: '', peso: 0.5, quantita: 1 },
    { id: id('item'), nome: 'Kunai', descrizione: 'Lame da lancio.', peso: 0.1, quantita: 10 },
    { id: id('item'), nome: 'Triboli (sacca)', descrizione: '', peso: 0.9, quantita: 1 },
    { id: id('item'), nome: 'Sfere d\u2019acciaio (sacca)', descrizione: '', peso: 0.9, quantita: 1 },
    { id: id('item'), nome: 'Pozione di guarigione', descrizione: '', peso: 0.23, quantita: 4 },
    { id: id('item'), nome: 'Giaciglio', descrizione: '', peso: 3.2, quantita: 1 },
    { id: id('item'), nome: 'Corde (15 m)', descrizione: '', peso: 4.5, quantita: 1 },
    { id: id('item'), nome: 'Olio (fiaschetta)', descrizione: '', peso: 0.45, quantita: 1 },
    { id: id('item'), nome: 'Incenso', descrizione: '', peso: 0.1, quantita: 1 },
    { id: id('item'), nome: 'Candele', descrizione: '', peso: 0.1, quantita: 5 },
    { id: id('item'), nome: 'Mantello Distorcente', descrizione: 'Ultimo cimelio del Clan della Luna Nera.', peso: 0.5, quantita: 1 }
  ],

  currency: {
    MR: 0,
    MA: 0,
    MO: 0,
    MP: 0
  },

  background: {
    nome: 'Clan della Luna Nera',
    testo:
      'Kurotsume è l\u2019ultimo sopravvissuto del Clan della Luna Nera, un ordine di guerrieri Shadar-Kai devoti alla Regina Corvo. Cresciuto nelle ombre del Piano della Morte, ha imparato a combattere senza esitazione, a muoversi silenzioso come un presagio e a colpire con la precisione di una lama rituale.\n\nIl clan fu sterminato da un tradimento interno, e Kurotsume porta ancora il peso di quella notte: il sangue, il silenzio, il gelo dell\u2019ombra che si chiudeva su tutto ciò che amava. Da allora vaga tra i piani, cercando vendetta, redenzione o forse un nuovo scopo.\n\nIl suo mantello distorcente è l\u2019ultimo cimelio del clan, e la sua katana spietata è stata temprata con frammenti di anima.',
    personalita: 'Silenzioso, disciplinato, osservatore.',
    ideali: 'Onore, vendetta, perfezione.',
    legami: 'Il Clan della Luna Nera.',
    difetti: 'Ossessione per la forza, difficoltà a fidarsi.',
    lingue: 'Comune, Elfico, Abissale',
    tratti: 'Scurovisione 36 m · Resistenza ai danni necrotici · Vantaggio sui tiri salvezza contro l\u2019affascinamento · Riposo breve 4 ore'
  },

  note: [
    'Usa sempre la katana come arma principale.',
    'Il Teletrasporto Shadar-Kai è una risorsa difensiva potentissima: usalo prima di incassare colpi pesanti.',
    'Oscurità + Immagine Speculare = combo difensiva.',
    'Attacco Sbilanciante + Critico = devastante.'
  ]
}

export default initialCharacter
