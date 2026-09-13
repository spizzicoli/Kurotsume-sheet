import React, { createContext, useContext, useEffect, useMemo, useReducer, useRef, useCallback, useState } from 'react'
import initialCharacter from '../data/initialCharacter'
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient'
import { ensureCharacterId, loadCharacterData, saveCharacterData } from '../lib/characterRepository'

const SAVE_DEBOUNCE_MS = 800

// Imposta immutabilmente un valore in un percorso annidato (array di chiavi/indici).
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

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD':
      return action.payload
    case 'SET_PATH':
      return setIn(state, action.path, action.value)
    case 'ADD_INVENTORY_ITEM':
      return { ...state, inventory: [...state.inventory, action.item] }
    case 'REMOVE_INVENTORY_ITEM':
      return { ...state, inventory: state.inventory.filter((i) => i.id !== action.id) }
    default:
      return state
  }
}

const CharacterStateContext = createContext(null)
const CharacterDispatchContext = createContext(null)
const CharacterSyncContext = createContext(null)

export function CharacterProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null)
  // status: 'no-config' | 'loading' | 'ready' | 'error'
  const [syncStatus, setSyncStatus] = useState(isSupabaseConfigured ? 'loading' : 'no-config')
  const [syncError, setSyncError] = useState(null)
  const [isSaving, setIsSaving] = useState(false)

  const characterIdRef = useRef(null)
  const skipNextSaveRef = useRef(true)

  // Caricamento iniziale da Supabase (una volta sola all'avvio dell'app)
  useEffect(() => {
    if (!isSupabaseConfigured) return
    let cancelled = false

    async function init() {
      try {
        const id = await ensureCharacterId()
        let data = await loadCharacterData(id)
        const isEmpty =
          data.skills.length === 0 && data.attacks.length === 0 && data.inventory.length === 0

        if (isEmpty) {
          // Progetto Supabase appena creato: popoliamo con i dati di partenza di Kurotsume.
          await saveCharacterData(id, initialCharacter)
          data = initialCharacter
        }

        if (!cancelled) {
          characterIdRef.current = id
          skipNextSaveRef.current = true
          dispatch({ type: 'LOAD', payload: data })
          setSyncStatus('ready')
        }
      } catch (err) {
        console.error('Errore caricamento personaggio da Supabase:', err)
        if (!cancelled) {
          setSyncError(err.message || String(err))
          setSyncStatus('error')
        }
      }
    }

    init()
    return () => {
      cancelled = true
    }
  }, [])

  // Salvataggio automatico (con debounce) ogni volta che lo stato cambia
  useEffect(() => {
    if (syncStatus !== 'ready' || !state) return
    if (skipNextSaveRef.current) {
      skipNextSaveRef.current = false
      return
    }
    const handle = setTimeout(async () => {
      try {
        setIsSaving(true)
        await saveCharacterData(characterIdRef.current, state)
        setSyncError(null)
      } catch (err) {
        console.error('Errore salvataggio su Supabase:', err)
        setSyncError(err.message || String(err))
      } finally {
        setIsSaving(false)
      }
    }, SAVE_DEBOUNCE_MS)
    return () => clearTimeout(handle)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, syncStatus])

  const resetToDefaults = useCallback(() => {
    skipNextSaveRef.current = false
    dispatch({ type: 'LOAD', payload: initialCharacter })
  }, [])

  const syncValue = useMemo(
    () => ({ status: syncStatus, error: syncError, isSaving, resetToDefaults, supabaseReady: !!supabase }),
    [syncStatus, syncError, isSaving, resetToDefaults]
  )

  return (
    <CharacterStateContext.Provider value={state}>
      <CharacterDispatchContext.Provider value={dispatch}>
        <CharacterSyncContext.Provider value={syncValue}>{children}</CharacterSyncContext.Provider>
      </CharacterDispatchContext.Provider>
    </CharacterStateContext.Provider>
  )
}

export function useCharacter() {
  const ctx = useContext(CharacterStateContext)
  if (!ctx) throw new Error('useCharacter deve essere usato dentro CharacterProvider (dopo il caricamento)')
  return ctx
}

export function useCharacterDispatch() {
  const ctx = useContext(CharacterDispatchContext)
  if (!ctx) throw new Error('useCharacterDispatch deve essere usato dentro CharacterProvider')
  return ctx
}

// Stato di sincronizzazione con Supabase, utile per mostrare messaggi
// di caricamento/salvataggio/errore nell'interfaccia.
export function useCharacterSync() {
  const ctx = useContext(CharacterSyncContext)
  if (!ctx) throw new Error('useCharacterSync deve essere usato dentro CharacterProvider')
  return ctx
}

// Hook di comodo: restituisce [valore, setValue] per un percorso nello stato,
// così ogni campo della scheda può essere modificato allo stesso modo.
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
