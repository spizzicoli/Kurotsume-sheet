import { supabase } from './supabaseClient'

const ABILITIES = ['for', 'des', 'cos', 'int', 'sag', 'car']

// ---------------------------------------------------------------
// characters (riga principale: anagrafica, caratteristiche, tiri
// salvezza, combattimento, background)
// ---------------------------------------------------------------
function characterToRow(state) {
  const row = {
    nome: state.info.nome,
    immagine: state.info.immagine,
    razza: state.info.razza,
    livello_totale: Number(state.info.livelloTotale) || 1,
    allineamento: state.info.allineamento,
    eta: Number(state.info.eta) || null,
    taglia: state.info.taglia,
    velocita: Number(state.info.velocita) || 0,
    esperienza: state.info.esperienza,
    ispirazione_eroica: !!state.info.ispirazioneEroica,

    ac_base: Number(state.combat.acBase) || 0,
    ac_dex_bonus: !!state.combat.acDexBonus,
    ac_altri_bonus: Number(state.combat.acAltriBonus) || 0,
    hp_max: Number(state.combat.hpMax) || 0,
    hp_current: Number(state.combat.hpCurrent) || 0,
    hp_temp: Number(state.combat.hpTemp) || 0,

    background_nome: state.background.nome,
    background_testo: state.background.testo,
    personalita: state.background.personalita,
    ideali: state.background.ideali,
    legami: state.background.legami,
    difetti: state.background.difetti
  }
  ABILITIES.forEach((ab) => {
    row[`ab_${ab}`] = Number(state.abilities[ab]) || 10
    row[`save_${ab}`] = !!state.savingThrows[ab]
  })
  return row
}

function rowToCharacterPartial(row) {
  const abilities = {}
  const savingThrows = {}
  ABILITIES.forEach((ab) => {
    abilities[ab] = row[`ab_${ab}`]
    savingThrows[ab] = row[`save_${ab}`]
  })
  return {
    info: {
      nome: row.nome,
      immagine: row.immagine,
      razza: row.razza,
      classi: [], // riempito da character_classes
      livelloTotale: row.livello_totale,
      allineamento: row.allineamento,
      eta: row.eta,
      taglia: row.taglia,
      velocita: row.velocita,
      esperienza: row.esperienza,
      ispirazioneEroica: row.ispirazione_eroica
    },
    abilities,
    savingThrows,
    combat: {
      acBase: row.ac_base,
      acDexBonus: row.ac_dex_bonus,
      acAltriBonus: row.ac_altri_bonus,
      hpMax: row.hp_max,
      hpCurrent: row.hp_current,
      hpTemp: row.hp_temp,
      hitDice: [] // riempito da hit_dice
    },
    background: {
      nome: row.background_nome,
      testo: row.background_testo,
      personalita: row.personalita,
      ideali: row.ideali,
      legami: row.legami,
      difetti: row.difetti
    }
  }
}

// ---------------------------------------------------------------
// Trova il personaggio esistente (il primo creato) o ne crea uno
// vuoto. L'app gestisce un solo personaggio per progetto Supabase.
// ---------------------------------------------------------------
export async function ensureCharacterId() {
  const { data, error } = await supabase
    .from('characters')
    .select('id')
    .order('created_at', { ascending: true })
    .limit(1)
  if (error) throw error
  if (data && data.length > 0) return data[0].id

  const { data: inserted, error: insErr } = await supabase
    .from('characters')
    .insert({})
    .select('id')
    .single()
  if (insErr) throw insErr
  return inserted.id
}

// ---------------------------------------------------------------
// Carica lo stato completo del personaggio dalle 10 tabelle
// ---------------------------------------------------------------
export async function loadCharacterData(characterId) {
  const [
    { data: charRow, error: charErr },
    { data: classes, error: classesErr },
    { data: skills, error: skillsErr },
    { data: attacks, error: attacksErr },
    { data: features, error: featuresErr },
    { data: spells, error: spellsErr },
    { data: slots, error: slotsErr },
    { data: hitDice, error: hitDiceErr },
    { data: inventory, error: inventoryErr },
    { data: notes, error: notesErr }
  ] = await Promise.all([
    supabase.from('characters').select('*').eq('id', characterId).single(),
    supabase.from('character_classes').select('*').eq('character_id', characterId).order('ordine'),
    supabase.from('skills').select('*').eq('character_id', characterId).order('ordine'),
    supabase.from('attacks').select('*').eq('character_id', characterId).order('ordine'),
    supabase.from('feature_items').select('*').eq('character_id', characterId).order('ordine'),
    supabase.from('spells').select('*').eq('character_id', characterId).order('ordine'),
    supabase.from('spell_slots').select('*').eq('character_id', characterId).order('livello'),
    supabase.from('hit_dice').select('*').eq('character_id', characterId).order('ordine'),
    supabase.from('inventory_items').select('*').eq('character_id', characterId).order('ordine'),
    supabase.from('player_notes').select('*').eq('character_id', characterId).order('ordine')
  ])

  const firstError =
    charErr || classesErr || skillsErr || attacksErr || featuresErr || spellsErr || slotsErr ||
    hitDiceErr || inventoryErr || notesErr
  if (firstError) throw firstError

  const base = rowToCharacterPartial(charRow)

  base.info.classi = (classes || []).map((c) => ({
    nome: c.nome,
    sottoclasse: c.sottoclasse,
    livello: c.livello
  }))

  base.combat.hitDice = (hitDice || []).map((h) => ({
    id: h.id,
    dado: h.dado,
    classe: h.classe,
    totale: h.totale,
    usati: h.usati
  }))

  base.skills = (skills || []).map((s) => ({
    id: s.skill_key,
    nome: s.nome,
    abilita: s.abilita,
    competenza: s.competenza
  }))

  base.attacks = (attacks || []).map((a) => ({
    id: a.id,
    nome: a.nome,
    abilita: a.abilita,
    bonusMagico: a.bonus_magico,
    bonusDannoExtra: a.bonus_danno_extra,
    dadoDanno: a.dado_danno,
    tipoDanno: a.tipo_danno,
    proprieta: a.proprieta || []
  }))

  const groups = { talenti: [], guerriero: [], stregone: [], razziali: [] }
  ;(features || []).forEach((f) => {
    if (!groups[f.gruppo]) groups[f.gruppo] = []
    groups[f.gruppo].push({
      id: f.id,
      nome: f.nome,
      descrizione: f.descrizione,
      usiMax: f.usi_max,
      usiSpesi: f.usi_spesi
    })
  })
  base.featureGroups = groups

  base.spells = {
    incantesimi: (spells || []).map((s) => ({
      id: s.id,
      nome: s.nome,
      livello: s.livello,
      tempoLancio: s.tempo_lancio,
      tipoAzione: s.tipo_azione,
      gittata: s.gittata,
      componenti: s.componenti,
      effetti: s.effetti,
      daTalento: s.da_talento
    })),
    slots: (slots || []).map((s) => ({
      livello: s.livello,
      usiMax: s.usi_max,
      usiSpesi: s.usi_spesi
    }))
  }

  base.inventory = (inventory || []).map((i) => ({
    id: i.id,
    nome: i.nome,
    descrizione: i.descrizione || '',
    peso: Number(i.peso) || 0,
    quantita: Number(i.quantita) || 0
  }))

  base.note = (notes || []).map((n) => n.testo)

  return base
}

// ---------------------------------------------------------------
// Salva lo stato completo: aggiorna la riga characters e sostituisce
// il contenuto di tutte le tabelle figlie (delete + insert), per
// restare sempre in linea con l'array corrente nello stato dell'app.
// ---------------------------------------------------------------
export async function saveCharacterData(characterId, state) {
  const charRow = characterToRow(state)

  const replaceChildren = async (table, rows) => {
    const { error: delErr } = await supabase.from(table).delete().eq('character_id', characterId)
    if (delErr) throw delErr
    if (rows.length === 0) return
    const { error: insErr } = await supabase.from(table).insert(rows)
    if (insErr) throw insErr
  }

  const classRows = state.info.classi.map((c, i) => ({
    character_id: characterId,
    ordine: i,
    nome: c.nome,
    sottoclasse: c.sottoclasse,
    livello: Number(c.livello) || 1
  }))

  const skillRows = state.skills.map((s, i) => ({
    character_id: characterId,
    ordine: i,
    skill_key: s.id,
    nome: s.nome,
    abilita: s.abilita,
    competenza: !!s.competenza
  }))

  const attackRows = state.attacks.map((a, i) => ({
    character_id: characterId,
    ordine: i,
    nome: a.nome,
    abilita: a.abilita,
    bonus_magico: Number(a.bonusMagico) || 0,
    bonus_danno_extra: Number(a.bonusDannoExtra) || 0,
    dado_danno: a.dadoDanno,
    tipo_danno: a.tipoDanno,
    proprieta: a.proprieta || []
  }))

  const featureRows = []
  Object.entries(state.featureGroups).forEach(([gruppo, items]) => {
    items.forEach((f, i) => {
      featureRows.push({
        character_id: characterId,
        gruppo,
        ordine: i,
        nome: f.nome,
        descrizione: f.descrizione,
        usi_max: Number(f.usiMax) || 0,
        usi_spesi: Number(f.usiSpesi) || 0
      })
    })
  })

  const spellRows = state.spells.incantesimi.map((s, i) => ({
    character_id: characterId,
    ordine: i,
    nome: s.nome,
    livello: Number(s.livello) || 0,
    tempo_lancio: s.tempoLancio,
    tipo_azione: s.tipoAzione,
    gittata: s.gittata,
    componenti: s.componenti,
    effetti: s.effetti,
    da_talento: !!s.daTalento
  }))

  const slotRows = state.spells.slots.map((s) => ({
    character_id: characterId,
    livello: Number(s.livello) || 0,
    usi_max: Number(s.usiMax) || 0,
    usi_spesi: Number(s.usiSpesi) || 0
  }))

  const hitDiceRows = state.combat.hitDice.map((h, i) => ({
    character_id: characterId,
    ordine: i,
    dado: h.dado,
    classe: h.classe,
    totale: Number(h.totale) || 1,
    usati: Number(h.usati) || 0
  }))

  const inventoryRows = state.inventory.map((it, i) => ({
    character_id: characterId,
    ordine: i,
    nome: it.nome,
    descrizione: it.descrizione || '',
    peso: Number(it.peso) || 0,
    quantita: Number(it.quantita) || 0
  }))

  const noteRows = state.note.map((testo, i) => ({
    character_id: characterId,
    ordine: i,
    testo
  }))

  const { error: updErr } = await supabase.from('characters').update(charRow).eq('id', characterId)
  if (updErr) throw updErr

  await Promise.all([
    replaceChildren('character_classes', classRows),
    replaceChildren('skills', skillRows),
    replaceChildren('attacks', attackRows),
    replaceChildren('feature_items', featureRows),
    replaceChildren('spells', spellRows),
    replaceChildren('spell_slots', slotRows),
    replaceChildren('hit_dice', hitDiceRows),
    replaceChildren('inventory_items', inventoryRows),
    replaceChildren('player_notes', noteRows)
  ])
}
