// Funzioni ufficiali D&D 5e per il calcolo dei valori derivati.

export const abilityMod = (score) => Math.floor((Number(score) - 10) / 2)

export const fmtMod = (mod) => (mod >= 0 ? `+${mod}` : `${mod}`)

export const proficiencyBonusByLevel = (level) => {
  const lv = Number(level) || 1
  if (lv >= 17) return 6
  if (lv >= 13) return 5
  if (lv >= 9) return 4
  if (lv >= 5) return 3
  return 2
}

// Peso trasportabile / sollevabile in kg, regole PHB (Forza x 7,5 / x 15),
// arrotondate al kg come da conversione standard usata nella scheda.
export const carryCapacity = (strScore) => Math.round(Number(strScore) * 7.5)
export const liftCapacity = (strScore) => Math.round(Number(strScore) * 15)

export const abilityLabels = {
  for: 'Forza',
  des: 'Destrezza',
  cos: 'Costituzione',
  int: 'Intelligenza',
  sag: 'Saggezza',
  car: 'Carisma'
}

export const abilityShort = {
  for: 'FOR',
  des: 'DES',
  cos: 'COS',
  int: 'INT',
  sag: 'SAG',
  car: 'CAR'
}

// Generatore di id univoci per nuove voci create dall'utente (talenti,
// incantesimi, armi, oggetti…), utilizzabile lato client senza dipendenze.
let seq = 0
export const newId = (prefix = 'id') => `${prefix}-${Date.now().toString(36)}-${(seq++).toString(36)}`
