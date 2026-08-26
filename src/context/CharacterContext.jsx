import React, { createContext, useContext, useEffect, useMemo, useReducer, useCallback } from 'react'
import initialCharacter from '../data/initialCharacter'

const STORAGE_KEY = 'kurotsume-scheda-dnd-v1'

function normalizeCharacter(saved) {
  if (!saved || typeof saved !== 'object') return initialCharacter

  const normalized = {
    ...initialCharacter,
    ...saved,
    info: { ...initialCharacter.info, ...(saved.info || {}), eta: 90 },
    abilities: { ...initialCharacter.abilities, ...(saved.abilities || {}) },
    savingThrows: { ...initialCharacter.savingThrows, ...(saved.savingThrows || {}) },
    combat: { ...initialCharacter.combat, ...(saved.combat || {}) },
    spells: { ...initialCharacter.spells, ...(saved.spells || {}) },
    featureGroups: {
      ...initialCharacter.featureGroups,
      ...(saved.featureGroups || {})
    }
  }

  normalized.featureGroups = {
    ...normalized.featureGroups,
    stregone: (normalized.featureGroups?.stregone || []).filter(
      (feat) => !(feat?.nome || '').toLowerCase().includes('magia innata')
    ),
    razziali: (normalized.featureGroups?.razziali || []).filter(
      (feat) =>
        !((feat?.nome || '').toLowerCase().includes('longevo') ||
          (feat?.nome || '').toLowerCase().includes('scurovisione') ||
          (feat?.nome || '').toLowerCase().includes('lingue'))
    )
  }

  const baseAttacks = Array.isArray(initialCharacter.attacks) ? initialCharacter.attacks : []
  const savedAttacks = Array.isArray(saved.attacks) ? saved.attacks : []
  const mergedAttacks = [...savedAttacks]

  const tantIndex = mergedAttacks.findIndex(
    (a) => (a?.nome || '').toLowerCase().replace(/[^a-z]/g, '') === 'tanto'
  )
  if (tantIndex >= 0) {
    const tantDefaults = baseAttacks.find((a) => (a?.nome || '').toLowerCase().replace(/[^a-z]/g, '') === 'tanto')
    mergedAttacks[tantIndex] = {
      ...(tantDefaults || {}),
      ...mergedAttacks[tantIndex],
      abilita: 'des',
      bonusMagico: 1,
      bonusDannoExtra: 2,
      dadoDanno: '1d4',
      tipoDanno: 'Perforante'
    }
  } else {
    const tantDefaults = baseAttacks.find((a) => (a?.nome || '').toLowerCase().replace(/[^a-z]/g, '') === 'tanto')
    if (tantDefaults) mergedAttacks.push({ ...tantDefaults, abilita: 'des', bonusMagico: 1, bonusDannoExtra: 2, dadoDanno: '1d4', tipoDanno: 'Perforante' })
  }

  const kunaiIndex = mergedAttacks.findIndex(
    (a) => (a?.nome || '').toLowerCase().replace(/[^a-z]/g, '') === 'kunai'
  )
  if (kunaiIndex < 0) {
    const kunaiDefaults = baseAttacks.find((a) => (a?.nome || '').toLowerCase().replace(/[^a-z]/g, '') === 'kunai')
    if (kunaiDefaults) mergedAttacks.push({ ...kunaiDefaults })
  }

  normalized.attacks = mergedAttacks
  return normalized
}

// Legge lo stato salvato in localStorage e, se non esiste, usa i dati iniziali del personaggio.
function loadInitial() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return normalizeCharacter(JSON.parse(raw))
  } catch (e) {
    console.warn('Impossibile leggere lo stato salvato, uso i dati di default.', e)
  }
  return initialCharacter
}

// Aggiorna in modo immutabile un valore annidato all'interno dello stato, seguendo un percorso come ['combat', 'hpCurrent'].
function setIn(obj, path, value) {
  if (path.length === 0) return value
  const [head, ...rest] = path
  if (Array.isArray(obj)) {
    const copy = obj.slice()
    copy[head] = setIn(obj[head], rest, value)
    return copy
  }
  return { ...obj, [head]: setIn(obj ? obj[head] : undefined, rest, value) }
}

// Gestisce tutte le azioni sullo stato globale della scheda: aggiornamenti, reset e import di backup.
function reducer(state, action) {
  switch (action.type) {
    case 'SET_PATH':
      return setIn(state, action.path, action.value)
    case 'ADD_INVENTORY_ITEM':
      return { ...state, inventory: [...state.inventory, action.item] }
    case 'REMOVE_INVENTORY_ITEM':
      return { ...state, inventory: state.inventory.filter((i) => i.id !== action.id) }
    case 'RESET':
      return initialCharacter
    case 'IMPORT':
      return action.payload
    default:
      return state
  }
}

const CharacterStateContext = createContext(null)
const CharacterDispatchContext = createContext(null)

// Provider globale dello stato della scheda: inizializza il contenuto da localStorage e lo salva automaticamente dopo ogni modifica.
export function CharacterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (e) {
      console.warn('Impossibile salvare lo stato in locale.', e)
    }
  }, [state])

  return (
    <CharacterStateContext.Provider value={state}>
      <CharacterDispatchContext.Provider value={dispatch}>
        {children}
      </CharacterDispatchContext.Provider>
    </CharacterStateContext.Provider>
  )
}

// Restituisce lo stato completo del personaggio per i componenti che devono leggere i dati.
export function useCharacter() {
  const ctx = useContext(CharacterStateContext)
  if (!ctx) throw new Error('useCharacter deve essere usato dentro CharacterProvider')
  return ctx
}

// Restituisce la funzione dispatch per modificare lo stato globale della scheda.
export function useCharacterDispatch() {
  const ctx = useContext(CharacterDispatchContext)
  if (!ctx) throw new Error('useCharacterDispatch deve essere usato dentro CharacterProvider')
  return ctx
}

// Hook di comodo: restituisce il valore e il setter per un percorso dentro lo stato, così i campi della scheda possono aggiornare dati annidati in modo semplice.
export function useField(path) {
  const state = useCharacter()
  const dispatch = useCharacterDispatch()
  const value = useMemo(() => path.reduce((acc, k) => (acc == null ? acc : acc[k]), state), [state, path])
  const setValue = useCallback(
    (v) => dispatch({ type: 'SET_PATH', path, value: v }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch, JSON.stringify(path)]
  )
  return [value, setValue]
}
