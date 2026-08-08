import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { loadState, saveState, defaultState } from '../utils/storage'
import { makeId } from '../utils/id'
import { todayKey } from '../utils/date'
import { applySchemeToDocument } from '../utils/theme'

const AppStateContext = createContext(null)
const AppDispatchContext = createContext(null)

function reducer(state, action) {
  switch (action.type) {
    case 'ADD_HABIT': {
      const habit = { id: makeId(), archived: false, createdAt: Date.now(), ...action.habit }
      return { ...state, habits: [...state.habits, habit] }
    }
    case 'UPDATE_HABIT': {
      return {
        ...state,
        habits: state.habits.map((h) => (h.id === action.id ? { ...h, ...action.patch } : h)),
      }
    }
    case 'DELETE_HABIT': {
      return {
        ...state,
        habits: state.habits.filter((h) => h.id !== action.id),
        logs: state.logs.filter((l) => l.habitId !== action.id),
      }
    }
    case 'ADD_LOG': {
      const log = { id: makeId(), timestamp: Date.now(), ...action.log }
      return { ...state, logs: [...state.logs, log] }
    }
    case 'REMOVE_LOG': {
      return { ...state, logs: state.logs.filter((l) => l.id !== action.id) }
    }
    case 'UPDATE_SETTINGS': {
      return { ...state, settings: { ...state.settings, ...action.patch } }
    }
    case 'IMPORT_STATE': {
      return action.state
    }
    case 'RESET_STATE': {
      return defaultState()
    }
    default:
      return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, null, () => loadState() || defaultState())

  useEffect(() => {
    saveState(state)
  }, [state])

  useEffect(() => {
    applySchemeToDocument(state.settings.seedColor, state.settings.themeMode)
  }, [state.settings.seedColor, state.settings.themeMode])

  useEffect(() => {
    if (state.settings.themeMode !== 'system') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = () => applySchemeToDocument(state.settings.seedColor, state.settings.themeMode)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [state.settings.themeMode, state.settings.seedColor])

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>{children}</AppDispatchContext.Provider>
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const ctx = useContext(AppStateContext)
  if (!ctx) throw new Error('useAppState must be used within AppProvider')
  return ctx
}

export function useAppDispatch() {
  const ctx = useContext(AppDispatchContext)
  if (!ctx) throw new Error('useAppDispatch must be used within AppProvider')
  return ctx
}

// Convenience action creators bundled into one hook for ergonomic component usage.
export function useAppActions() {
  const dispatch = useAppDispatch()
  return useMemo(
    () => ({
      addHabit: (habit) => dispatch({ type: 'ADD_HABIT', habit }),
      updateHabit: (id, patch) => dispatch({ type: 'UPDATE_HABIT', id, patch }),
      deleteHabit: (id) => dispatch({ type: 'DELETE_HABIT', id }),
      addLog: (log) => dispatch({ type: 'ADD_LOG', log: { dateKey: todayKey(), ...log } }),
      removeLog: (id) => dispatch({ type: 'REMOVE_LOG', id }),
      updateSettings: (patch) => dispatch({ type: 'UPDATE_SETTINGS', patch }),
      importState: (state) => dispatch({ type: 'IMPORT_STATE', state }),
      resetState: () => dispatch({ type: 'RESET_STATE' }),
    }),
    [dispatch],
  )
}
