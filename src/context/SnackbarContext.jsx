import { createContext, useCallback, useContext, useRef, useState } from 'react'

const SnackbarContext = createContext(null)

export function SnackbarProvider({ children }) {
  const [items, setItems] = useState([])
  const counter = useRef(0)

  const dismiss = useCallback((id) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const notify = useCallback(
    (message, opts = {}) => {
      const id = ++counter.current
      const item = { id, message, actionLabel: opts.actionLabel, onAction: opts.onAction }
      setItems((prev) => [...prev.slice(-1), item])
      window.setTimeout(() => dismiss(id), opts.duration ?? 4000)
      return id
    },
    [dismiss],
  )

  return (
    <SnackbarContext.Provider value={notify}>
      {children}
      <div className="m3-snackbar-wrap">
        {items.map((item) => (
          <div className="m3-snackbar" key={item.id}>
            <span>{item.message}</span>
            {item.actionLabel && (
              <button
                onClick={() => {
                  item.onAction?.()
                  dismiss(item.id)
                }}
              >
                {item.actionLabel}
              </button>
            )}
          </div>
        ))}
      </div>
    </SnackbarContext.Provider>
  )
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext)
  if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider')
  return ctx
}
