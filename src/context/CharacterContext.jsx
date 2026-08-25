import React, { createContext, useContext, useEffect, useMemo, useReducer, useCallback } from 'react'
import initialCharacter from '../data/initialCharacter'

const STORAGE_KEY = 'kurotsume-scheda-dnd-v1'

function loadInitial() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch (e) {
    console.warn('Impossibile leggere lo stato salvato, uso i dati di default.', e)
  }
  return initialCharacter
}

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
    case 'SET_PATH':
      return setIn(state, action.path, action.value)
    case 'ADD_INVENTORY_ITEM':
      return { ...state, inventory: [...state.inventory, action.item] }
    case 'REMOVE_INVENTORY_ITEM':
      return { ...state, inventory: state.inventory.filter((i) => i.id !== action.id) }
    case 'RESET':
      return initialCharacter
    default:
      return state
  }
}

const CharacterStateContext = createContext(null)
const CharacterDispatchContext = createContext(null)

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

export function useCharacter() {
  const ctx = useContext(CharacterStateContext)
  if (!ctx) throw new Error('useCharacter deve essere usato dentro CharacterProvider')
  return ctx
}

export function useCharacterDispatch() {
  const ctx = useContext(CharacterDispatchContext)
  if (!ctx) throw new Error('useCharacterDispatch deve essere usato dentro CharacterProvider')
  return ctx
}

// Hook di comodo: restituisce [valore, setValue] per un percorso nello stato,
// così ogni campo della scheda può essere modificato e salvato allo stesso modo.
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
