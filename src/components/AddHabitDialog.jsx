import { useEffect, useState } from 'react'
import Dialog from './Dialog'
import IconPicker from './IconPicker'

const emptyForm = { name: '', type: 'good', amount: 5, emoji: '✅', category: '', repeatable: false, streakBoostDays: 0, streakBoostAmount: null }

export default function AddHabitDialog({ open, initial, onClose, onSave, onDelete }) {
  const [form, setForm] = useState(emptyForm)
  const [boostEnabled, setBoostEnabled] = useState(false)

  useEffect(() => {
    if (!open) return
    const next = initial ? { ...emptyForm, ...initial } : emptyForm
    setForm(next)
    setBoostEnabled(!!next.streakBoostDays)
  }, [open, initial])

  if (!open) return null

  const isEdit = !!initial
  const valid =
    form.name.trim().length > 0 &&
    Number(form.amount) > 0 &&
    (!boostEnabled || (Number(form.streakBoostDays) > 0 && Number(form.streakBoostAmount) > 0))

  function set(patch) {
    setForm((f) => ({ ...f, ...patch }))
  }

  function toggleBoost() {
    const next = !boostEnabled
    setBoostEnabled(next)
    if (next && !form.streakBoostAmount) {
      set({ streakBoostDays: form.streakBoostDays || 7, streakBoostAmount: Math.round(Number(form.amount) * 2) })
    }
  }

  function submit() {
    if (!valid) return
    onSave({
      ...form,
      name: form.name.trim(),
      amount: Number(form.amount),
      category: form.category.trim() || 'General',
      streakBoostDays: boostEnabled ? Number(form.streakBoostDays) : 0,
      streakBoostAmount: boostEnabled ? Number(form.streakBoostAmount) : null,
    })
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
        <button className={form.type === 'good' ? 'selected' : ''} onClick={() => set({ type: 'good' })}>
          😇 Good habit
        </button>
        <button className={form.type === 'bad' ? 'selected' : ''} onClick={() => set({ type: 'bad' })}>
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
        <label>Icon {form.emoji && <span style={{ fontSize: '1.1rem' }}>{form.emoji}</span>}</label>
        <IconPicker value={form.emoji} onChange={(emoji) => set({ emoji })} />
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

      <div className="m3-card outlined" style={{ padding: '12px 16px', marginTop: 12 }}>
        <div className="row between">
          <div>
            <p className="m3-body" style={{ margin: 0 }}>🔥 Streak bonus</p>
            <p className="m3-body-sm" style={{ margin: 0 }}>
              {boostEnabled
                ? `${form.type === 'good' ? 'Reward' : 'Cost'} increases once you keep a streak going — miss a single day and it drops right back to the base price`
                : 'Keep the price the same no matter the streak'}
            </p>
          </div>
          <button className={`m3-switch${boostEnabled ? ' on' : ''}`} onClick={toggleBoost} aria-label="Toggle streak bonus">
            <span className="knob" />
          </button>
        </div>

        {boostEnabled && (
          <div className="m3-field-row" style={{ marginTop: 12, marginBottom: 0 }}>
            <div className="m3-field" style={{ marginBottom: 0 }}>
              <label htmlFor="boost-days">After streak of (days)</label>
              <input id="boost-days" type="number" min="1" step="1" value={form.streakBoostDays} onChange={(e) => set({ streakBoostDays: e.target.value })} />
            </div>
            <div className="m3-field" style={{ marginBottom: 0 }}>
              <label htmlFor="boost-amount">New {form.type === 'good' ? 'reward' : 'cost'}</label>
              <input id="boost-amount" type="number" min="0" step="0.5" value={form.streakBoostAmount ?? ''} onChange={(e) => set({ streakBoostAmount: e.target.value })} />
            </div>
          </div>
        )}
      </div>
    </Dialog>
  )
}
