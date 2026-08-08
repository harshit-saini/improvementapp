import { useEffect, useState } from 'react'
import Dialog from './Dialog'

const GOOD_EMOJIS = ['✅', '🏋️', '📖', '💧', '🥗', '🧘', '🛏️', '🦷', '🚶', '💰', '🌱', '😴']
const BAD_EMOJIS = ['🍦', '📱', '🍕', '🚬', '🛋️', '🎮', '🍺', '🛍️', '😴', '🍬', '⏰', '🙅']

const emptyForm = { name: '', type: 'good', amount: 5, emoji: '✅', category: '', repeatable: false }

export default function AddHabitDialog({ open, initial, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (open) setForm(initial ? { ...initial } : emptyForm)
  }, [open, initial])

  if (!open) return null

  const isEdit = !!initial
  const emojiSet = form.type === 'good' ? GOOD_EMOJIS : BAD_EMOJIS
  const valid = form.name.trim().length > 0 && Number(form.amount) > 0

  function set(patch) {
    setForm((f) => ({ ...f, ...patch }))
  }

  function submit() {
    if (!valid) return
    onSave({ ...form, name: form.name.trim(), amount: Number(form.amount), category: form.category.trim() || 'General' })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit habit' : 'New habit'}
      actions={
        <>
          {isEdit && (
            <button className="m3-btn text" style={{ color: 'var(--md-error)', marginRight: 'auto' }} onClick={() => onDelete(initial)}>
              Delete
            </button>
          )}
          <button className="m3-btn text" onClick={onClose}>Cancel</button>
          <button className="m3-btn filled" disabled={!valid} onClick={submit}>{isEdit ? 'Save' : 'Add habit'}</button>
        </>
      }
    >
      <div className="m3-segmented">
        <button className={form.type === 'good' ? 'selected' : ''} onClick={() => set({ type: 'good', emoji: GOOD_EMOJIS.includes(form.emoji) ? form.emoji : '✅' })}>
          😇 Good habit
        </button>
        <button className={form.type === 'bad' ? 'selected' : ''} onClick={() => set({ type: 'bad', emoji: BAD_EMOJIS.includes(form.emoji) ? form.emoji : '🍦' })}>
          😈 Guilty pleasure
        </button>
      </div>

      <div className="m3-field">
        <label htmlFor="habit-name">Name</label>
        <input
          id="habit-name"
          placeholder={form.type === 'good' ? 'e.g. Meditate 10 minutes' : 'e.g. Order takeout'}
          value={form.name}
          onChange={(e) => set({ name: e.target.value })}
          autoFocus
        />
      </div>

      <div className="m3-field-row">
        <div className="m3-field">
          <label htmlFor="habit-amount">{form.type === 'good' ? 'Reward amount' : 'Cost'}</label>
          <input id="habit-amount" type="number" min="0" step="0.5" value={form.amount} onChange={(e) => set({ amount: e.target.value })} />
        </div>
        <div className="m3-field">
          <label htmlFor="habit-category">Category</label>
          <input id="habit-category" placeholder="Health, Chores…" value={form.category} onChange={(e) => set({ category: e.target.value })} />
        </div>
      </div>

      <div className="m3-field">
        <label>Icon</label>
        <div className="chip-row" style={{ marginBottom: 0 }}>
          {emojiSet.map((e) => (
            <button
              key={e}
              className={`m3-chip${form.emoji === e ? ' selected' : ''}`}
              onClick={() => set({ emoji: e })}
              style={{ fontSize: '1.1rem', width: 44, justifyContent: 'center' }}
            >
              {e}
            </button>
          ))}
        </div>
      </div>

      <div className="m3-card outlined row between" style={{ padding: '12px 16px' }}>
        <div>
          <p className="m3-body" style={{ margin: 0 }}>Allow multiple times a day</p>
          <p className="m3-body-sm" style={{ margin: 0 }}>
            {form.repeatable ? 'Each tap logs another entry' : 'Only once per day'}
          </p>
        </div>
        <button className={`m3-switch${form.repeatable ? ' on' : ''}`} onClick={() => set({ repeatable: !form.repeatable })} aria-label="Toggle repeatable">
          <span className="knob" />
        </button>
      </div>
    </Dialog>
  )
}
