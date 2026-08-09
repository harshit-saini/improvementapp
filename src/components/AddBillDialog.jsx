import { useEffect, useState } from 'react'
import Dialog from './Dialog'
import IconPicker from './IconPicker'

const emptyForm = { name: '', amount: 5, emoji: '🏠', category: '', frequency: 'daily' }

export default function AddBillDialog({ open, initial, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (open) setForm(initial ? { ...initial } : emptyForm)
  }, [open, initial])

  if (!open) return null

  const isEdit = !!initial
  const valid = form.name.trim().length > 0 && Number(form.amount) > 0

  function set(patch) {
    setForm((f) => ({ ...f, ...patch }))
  }

  function submit() {
    if (!valid) return
    onSave({ ...form, name: form.name.trim(), amount: Number(form.amount), category: form.category.trim() || 'Fixed spends' })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit fixed spend' : 'New fixed spend'}
      actions={
        <>
          {isEdit && (
            <button className="m3-btn text" style={{ color: 'var(--md-error)', marginRight: 'auto' }} onClick={() => onDelete(initial)}>
              Delete
            </button>
          )}
          <button className="m3-btn text" onClick={onClose}>Cancel</button>
          <button className="m3-btn filled" disabled={!valid} onClick={submit}>{isEdit ? 'Save' : 'Add fixed spend'}</button>
        </>
      }
    >
      <p className="m3-body-sm" style={{ marginTop: 0 }}>
        The shop charges this automatically on schedule — whether or not you do anything. It keeps ticking, so there's always a reason to keep earning.
      </p>

      <div className="m3-field">
        <label htmlFor="bill-name">Name</label>
        <input
          id="bill-name"
          placeholder="e.g. Rent, subscription…"
          value={form.name}
          onChange={(e) => set({ name: e.target.value })}
          autoFocus
        />
      </div>

      <div className="m3-field-row">
        <div className="m3-field">
          <label htmlFor="bill-amount">Cost</label>
          <input id="bill-amount" type="number" min="0" step="0.5" value={form.amount} onChange={(e) => set({ amount: e.target.value })} />
        </div>
        <div className="m3-field">
          <label htmlFor="bill-category">Category</label>
          <input id="bill-category" placeholder="Bills, subscriptions…" value={form.category} onChange={(e) => set({ category: e.target.value })} />
        </div>
      </div>

      <div className="m3-field">
        <label>Charges</label>
        <div className="m3-segmented" style={{ marginBottom: 0 }}>
          <button className={form.frequency === 'daily' ? 'selected' : ''} onClick={() => set({ frequency: 'daily' })}>Every day</button>
          <button className={form.frequency === 'weekly' ? 'selected' : ''} onClick={() => set({ frequency: 'weekly' })}>Every week</button>
        </div>
      </div>

      <div className="m3-field">
        <label>Icon {form.emoji && <span style={{ fontSize: '1.1rem' }}>{form.emoji}</span>}</label>
        <IconPicker value={form.emoji} onChange={(emoji) => set({ emoji })} />
      </div>
    </Dialog>
  )
}
