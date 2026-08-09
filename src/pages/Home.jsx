import { useMemo, useState } from 'react'
import { useAppState, useAppActions } from '../context/AppContext'
import { useSnackbar } from '../context/SnackbarContext'
import { formatMoney, formatSigned } from '../utils/currency'
import { todayKey, formatFriendlyDate } from '../utils/date'
import { getBalance, getLogsForDay, isDoneToday, countToday, computeStreak, getPeriodNet, getEffectiveHabitAmount } from '../utils/selectors'
import HabitRow from '../components/HabitRow'
import ConfirmDialog from '../components/ConfirmDialog'

const GOAL_PERIODS = [
  { key: 'daily', label: 'Today' },
  { key: 'weekly', label: 'This week' },
  { key: 'monthly', label: 'This month' },
]

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

  const goals = GOAL_PERIODS.map(({ key, label }) => {
    const goal = settings.savingsGoals?.[key]
    if (!goal || goal.amount <= 0) return null
    const net = getPeriodNet(logs, key)
    const progress = Math.min(100, Math.max(0, (net / goal.amount) * 100))
    return { key, label, goal, net, progress }
  }).filter(Boolean)

  function doGood(habit) {
    const { amount, boosted } = getEffectiveHabitAmount(habit, logs)
    if (habit.repeatable) {
      addLog({ habitId: habit.id, amount })
      notify(boosted ? `🔥 Streak bonus! +${formatMoney(amount, currency)} for ${habit.name}` : `+${formatMoney(amount, currency)} for ${habit.name}`)
    } else {
      if (isDoneToday(logs, habit.id, today)) return
      addLog({ habitId: habit.id, amount })
      notify(boosted ? `🔥 Streak bonus! +${formatMoney(amount, currency)} earned` : `Nice! +${formatMoney(amount, currency)} earned`)
    }
  }

  function doBad(habit) {
    const { amount } = getEffectiveHabitAmount(habit, logs)
    if (overallBalance - amount < 0) {
      setPendingSpend(habit)
      return
    }
    spendNow(habit)
  }

  function spendNow(habit) {
    const { amount, boosted } = getEffectiveHabitAmount(habit, logs)
    addLog({ habitId: habit.id, amount: -amount })
    notify(boosted ? `🔥 Streak penalty: ${formatMoney(amount, currency)} spent on ${habit.name}` : `${formatMoney(amount, currency)} spent on ${habit.name}`)
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

      {goals.length > 0 && (
        <div className="m3-card outlined">
          <p className="m3-title-sm" style={{ margin: '0 0 12px' }}>🎯 Goals</p>
          <div className="stack-16">
            {goals.map(({ key, label, goal, net, progress }) => (
              <div key={key}>
                <div className="row between">
                  <span className="m3-body-sm">{label} · {goal.name}</span>
                  <span className="m3-body-sm">{formatMoney(net, currency)} / {formatMoney(goal.amount, currency)}</span>
                </div>
                <div className="progress-track" style={{ marginTop: 6 }}>
                  <div className="progress-fill" style={{ width: `${progress}%` }} />
                </div>
              </div>
            ))}
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
              {...getEffectiveHabitAmount(h, logs)}
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
              streak={computeStreak(logs, h.id)}
              {...getEffectiveHabitAmount(h, logs)}
              onAct={() => doBad(h)}
              onUndo={() => undoHabit(h)}
            />
          ))}
        </div>
      </section>

      <ConfirmDialog
        open={!!pendingSpend}
        title="Not enough coins"
        message={pendingSpend ? `You only have ${formatMoney(overallBalance, currency)}. Spending ${formatMoney(getEffectiveHabitAmount(pendingSpend, logs).amount, currency)} on "${pendingSpend.name}" will put you into debt. Do it anyway?` : ''}
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
