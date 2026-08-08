import { useMemo, useState } from 'react'
import { useAppState, useAppActions } from '../context/AppContext'
import { useSnackbar } from '../context/SnackbarContext'
import { formatMoney } from '../utils/currency'
import AddHabitDialog from '../components/AddHabitDialog'
import ConfirmDialog from '../components/ConfirmDialog'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'good', label: 'Good' },
  { key: 'bad', label: 'Guilty' },
]

export default function Tasks() {
  const { habits, settings } = useAppState()
  const { addHabit, updateHabit, deleteHabit } = useAppActions()
  const notify = useSnackbar()
  const [filter, setFilter] = useState('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [toDelete, setToDelete] = useState(null)

  const list = useMemo(() => {
    return habits.filter((h) => filter === 'all' || h.type === filter)
  }, [habits, filter])

  function openAdd() {
    setEditing(null)
    setDialogOpen(true)
  }

  function openEdit(habit) {
    setEditing(habit)
    setDialogOpen(true)
  }

  function save(data) {
    if (editing) {
      updateHabit(editing.id, data)
      notify('Habit updated')
    } else {
      addHabit(data)
      notify('Habit added')
    }
    setDialogOpen(false)
  }

  function requestDelete(habit) {
    setToDelete(habit)
    setDialogOpen(false)
  }

  function confirmDelete() {
    deleteHabit(toDelete.id)
    notify(`Deleted "${toDelete.name}"`)
    setToDelete(null)
  }

  return (
    <div className="stack-16">
      <h1 className="m3-headline" style={{ margin: '4px 0 0' }}>Your habits</h1>
      <p className="m3-body-sm" style={{ marginTop: -8 }}>Add, edit, or remove the habits you're tracking.</p>

      <div className="chip-row">
        {FILTERS.map((f) => (
          <button key={f.key} className={`m3-chip${filter === f.key ? ' selected' : ''}`} onClick={() => setFilter(f.key)}>
            {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 && (
        <div className="empty-state">
          <span className="emoji">🗂️</span>
          <p className="m3-body">No habits yet. Tap + to add your first one.</p>
        </div>
      )}

      <div className="stack-12">
        {list.map((h) => (
          <button key={h.id} className="m3-card outlined row between" style={{ width: '100%', textAlign: 'left', border: '1px solid var(--md-outline-variant)' }} onClick={() => openEdit(h)}>
            <div className="row gap-12" style={{ minWidth: 0 }}>
              <span
                className="emoji"
                style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 'var(--shape-md)', background: 'var(--md-surface-container-high)', flexShrink: 0 }}
              >
                {h.emoji}
              </span>
              <span className="col" style={{ minWidth: 0 }}>
                <span className="m3-title-sm" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{h.name}</span>
                <span className="m3-body-sm">{h.category} · {h.repeatable ? 'multi/day' : 'once/day'}</span>
              </span>
            </div>
            <span className={`badge`} style={{ background: h.type === 'good' ? 'var(--md-primary-container)' : 'var(--md-error-container)', color: h.type === 'good' ? 'var(--md-on-primary-container)' : 'var(--md-on-error-container)' }}>
              {h.type === 'good' ? '+' : '-'}{formatMoney(h.amount, settings.currencyCode)}
            </span>
          </button>
        ))}
      </div>

      <button className="m3-fab" onClick={openAdd} aria-label="Add habit">＋</button>

      <AddHabitDialog
        open={dialogOpen}
        initial={editing}
        onClose={() => setDialogOpen(false)}
        onSave={save}
        onDelete={requestDelete}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete habit?"
        message={toDelete ? `This removes "${toDelete.name}" and its history. This can't be undone.` : ''}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setToDelete(null)}
      />
    </div>
  )
}
