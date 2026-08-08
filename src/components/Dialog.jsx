import { useEffect } from 'react'

export default function Dialog({ open, onClose, title, children, actions }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="m3-scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="m3-dialog" role="dialog" aria-modal="true" aria-label={title}>
        <div className="m3-dialog-grab" />
        {title && <h2 className="m3-headline" style={{ margin: '0 0 16px' }}>{title}</h2>}
        {children}
        {actions && <div className="m3-dialog-actions">{actions}</div>}
      </div>
    </div>
  )
}
