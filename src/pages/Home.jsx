import { useMemo, useState } from 'react'
import { useAppState, useAppActions } from '../context/AppContext'
import { useSnackbar } from '../context/SnackbarContext'
import { formatMoney, formatSigned } from '../utils/currency'
import { todayKey, formatFriendlyDate } from '../utils/date'
import { getBalance, getLogsForDay, isDoneToday, countToday, computeStreak } from '../utils/selectors'
import HabitRow from '../components/HabitRow'
import ConfirmDialog from '../components/ConfirmDialog'

export default function Home() {
  const state = useAppState()
  const { addLog, removeLog } = useAppActions()
  const notify = useSnackbar()
  const [query, setQuery] = useState('')
  const [viewOverall, setViewOverall] = useState(false)
  const [pendingSpend, setPendingSpend] = useState(null)

  const { habits, logs, settings } = state
  const today = todayKey()
  const currency = settings.currencyCode

  const overallBalance = useMemo(() => getBalance(logs), [logs])
  const todayLogs = useMemo(() => getLogsForDay(logs, today), [logs, today])
  const todayBalance = useMemo(() => todayLogs.reduce((s, l) => s + l.amount, 0), [todayLogs])

  const activeHabits = habits.filter((h) => !h.archived)
  const filtered = activeHabits.filter((h) => h.name.toLowerCase().includes(query.toLowerCase()) || h.category?.toLowerCase().includes(query.toLowerCase()))
  const goodHabits = filtered.filter((h) => h.type === 'good')
  const badHabits = filtered.filter((h) => h.type === 'bad')

  const goal = settings.savingsGoal
  const goalProgress = goal?.amount > 0 ? Math.min(100, Math.max(0, (overallBalance / goal.amount) * 100)) : 0

  function doGood(habit) {
    if (habit.repeatable) {
      addLog({ habitId: habit.id, amount: habit.amount })
      notify(`+${formatMoney(habit.amount, currency)} for ${habit.name}`)
    } else {
      if (isDoneToday(logs, habit.id, today)) return
      addLog({ habitId: habit.id, amount: habit.amount })
      notify(`Nice! +${formatMoney(habit.amount, currency)} earned`)
    }
  }

  function doBad(habit) {
    if (overallBalance - habit.amount < 0) {
      setPendingSpend(habit)
      return
    }
    spendNow(habit)
  }

  function spendNow(habit) {
    addLog({ habitId: habit.id, amount: -habit.amount })
    notify(`${formatMoney(habit.amount, currency)} spent on ${habit.name}`)
    setPendingSpend(null)
  }

  function undoHabit(habit) {
    const entries = todayLogs.filter((l) => l.habitId === habit.id)
    const last = entries[entries.length - 1]
    if (!last) return
    removeLog(last.id)
    notify('Undone')
  }

  return (
    <div className="stack-16">
      <div>
        <p className="m3-label" style={{ margin: 0 }}>{formatFriendlyDate()}</p>
      </div>

      <div className="m3-card tonal-primary elevated" style={{ background: 'var(--md-primary-container)' }}>
        <div className="row between">
          <span className="m3-label" style={{ color: 'var(--md-on-primary-container)', opacity: 0.8 }}>
            {viewOverall ? "Overall balance" : "Today's balance"}
          </span>
          <div className="m3-segmented" style={{ margin: 0, height: 28 }}>
            <button className={viewOverall ? '' : 'selected'} onClick={() => setViewOverall(false)} style={{ height: 28, fontSize: '0.72rem' }}>Today</button>
            <button className={viewOverall ? 'selected' : ''} onClick={() => setViewOverall(true)} style={{ height: 28, fontSize: '0.72rem' }}>Overall</button>
          </div>
        </div>
        <p className="m3-display" style={{ margin: '8px 0 0' }}>
          {viewOverall ? formatMoney(overallBalance, currency) : formatSigned(todayBalance, currency)}
        </p>
        {overallBalance < 0 && (
          <p className="m3-body-sm" style={{ color: 'var(--md-error)', marginTop: 4 }}>You're in the red — a few good habits will bring you back.</p>
        )}
      </div>

      {goal?.amount > 0 && (
        <div className="m3-card outlined">
          <div className="row between">
            <span className="m3-body-sm">🎯 Goal: {goal.name}</span>
            <span className="m3-body-sm">{formatMoney(Math.max(0, overallBalance), currency)} / {formatMoney(goal.amount, currency)}</span>
          </div>
          <div className="progress-track" style={{ marginTop: 8 }}>
            <div className="progress-fill" style={{ width: `${goalProgress}%` }} />
          </div>
        </div>
      )}

      <div className="m3-search" style={{ marginBottom: 0 }}>
        <span>🔍</span>
        <input
          placeholder="Search your habits…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="m3-icon-btn" style={{ width: 28, height: 28 }} onClick={() => setQuery('')}>✕</button>
        )}
      </div>

      <section>
        <h2 className="m3-title" style={{ margin: '4px 0 10px' }}>😇 Good habits</h2>
        {goodHabits.length === 0 && <EmptyRow text="No good habits match." />}
        <div className="stack-12">
          {goodHabits.map((h) => (
            <HabitRow
              key={h.id}
              habit={h}
              currencyCode={currency}
              done={isDoneToday(logs, h.id, today)}
              count={countToday(logs, h.id, today)}
              streak={computeStreak(logs, h.id)}
              onAct={() => doGood(h)}
              onUndo={() => undoHabit(h)}
            />
          ))}
        </div>
      </section>

      <section>
        <h2 className="m3-title" style={{ margin: '4px 0 10px' }}>😈 Guilty pleasures</h2>
        {badHabits.length === 0 && <EmptyRow text="No guilty pleasures match." />}
        <div className="stack-12">
          {badHabits.map((h) => (
            <HabitRow
              key={h.id}
              habit={h}
              currencyCode={currency}
              done={isDoneToday(logs, h.id, today)}
              count={countToday(logs, h.id, today)}
              onAct={() => doBad(h)}
              onUndo={() => undoHabit(h)}
            />
          ))}
        </div>
      </section>

      <ConfirmDialog
        open={!!pendingSpend}
        title="Not enough coins"
        message={pendingSpend ? `You only have ${formatMoney(overallBalance, currency)}. Spending ${formatMoney(pendingSpend.amount, currency)} on "${pendingSpend.name}" will put you into debt. Do it anyway?` : ''}
        confirmLabel="Spend anyway"
        danger
        onConfirm={() => spendNow(pendingSpend)}
        onCancel={() => setPendingSpend(null)}
      />
    </div>
  )
}

function EmptyRow({ text }) {
  return (
    <div className="empty-state" style={{ padding: '20px 0' }}>
      <p className="m3-body-sm" style={{ margin: 0 }}>{text}</p>
    </div>
  )
}
