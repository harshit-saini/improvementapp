import { useMemo } from 'react'
import { useAppState } from '../context/AppContext'
import { formatMoney } from '../utils/currency'
import { weeklyStats, habitFrequency, computeStreak, computeAchievements, getBalance } from '../utils/selectors'
import WeeklyChart from '../components/WeeklyChart'

export default function Stats() {
  const state = useAppState()
  const { habits, logs, settings } = state
  const currency = settings.currencyCode

  const weeks = useMemo(() => weeklyStats(logs, 6), [logs])
  const thisWeek = weeks[weeks.length - 1]
  const lastWeek = weeks[weeks.length - 2]
  const netDelta = thisWeek && lastWeek ? thisWeek.net - lastWeek.net : 0

  const goodHabits = habits.filter((h) => h.type === 'good')
  const streaks = goodHabits
    .map((h) => ({ habit: h, streak: computeStreak(logs, h.id) }))
    .sort((a, b) => b.streak - a.streak)
    .filter((s) => s.streak > 0)

  const topHabits = habitFrequency(logs, habits).filter((h) => h.count > 0).slice(0, 5)
  const achievements = computeAchievements(state)
  const earnedCount = achievements.filter((a) => a.earned).length
  const overallBalance = getBalance(logs)

  return (
    <div className="stack-16">
      <h1 className="m3-headline" style={{ margin: '4px 0 0' }}>Your progress</h1>

      <div className="row gap-12">
        <StatTile label="Overall balance" value={formatMoney(overallBalance, currency)} />
        <StatTile label="This week net" value={formatMoney(thisWeek?.net ?? 0, currency)} sub={lastWeek ? `${netDelta >= 0 ? '▲' : '▼'} ${formatMoney(Math.abs(netDelta), currency)} vs last week` : undefined} />
      </div>

      <div className="m3-card elevated">
        <h2 className="m3-title" style={{ margin: '0 0 12px' }}>Weekly earned vs spent</h2>
        <WeeklyChart weeks={weeks} />
      </div>

      <div className="m3-card outlined">
        <h2 className="m3-title" style={{ margin: '0 0 12px' }}>🔥 Streaks</h2>
        {streaks.length === 0 && <p className="m3-body-sm" style={{ margin: 0 }}>Complete a good habit today to start a streak.</p>}
        <div className="stack-12">
          {streaks.map(({ habit, streak }) => (
            <div key={habit.id} className="row between">
              <span className="m3-body">{habit.emoji} {habit.name}</span>
              <span className="badge">{streak} day{streak === 1 ? '' : 's'}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="m3-card outlined">
        <h2 className="m3-title" style={{ margin: '0 0 12px' }}>Most logged habits</h2>
        {topHabits.length === 0 && <p className="m3-body-sm" style={{ margin: 0 }}>No activity yet — log a habit to see stats here.</p>}
        <div className="stack-12">
          {topHabits.map(({ habit, count, total }) => (
            <div key={habit.id} className="row between">
              <span className="m3-body">{habit.emoji} {habit.name}</span>
              <span className="m3-body-sm">{count}× · {formatMoney(total, currency)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="m3-card tonal-primary" style={{ background: 'var(--md-tertiary-container)', color: 'var(--md-on-tertiary-container)' }}>
        <div className="row between" style={{ marginBottom: 12 }}>
          <h2 className="m3-title" style={{ margin: 0 }}>🏅 Achievements</h2>
          <span className="m3-body-sm" style={{ color: 'inherit' }}>{earnedCount}/{achievements.length}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))', gap: 12 }}>
          {achievements.map((a) => (
            <div key={a.id} className="col" style={{ alignItems: 'center', textAlign: 'center', opacity: a.earned ? 1 : 0.35 }}>
              <span style={{ fontSize: '1.7rem' }}>{a.emoji}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: 600, marginTop: 4 }}>{a.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function StatTile({ label, value, sub }) {
  return (
    <div className="m3-card elevated" style={{ flex: 1 }}>
      <p className="m3-label" style={{ margin: 0 }}>{label}</p>
      <p className="m3-headline" style={{ margin: '4px 0 0' }}>{value}</p>
      {sub && <p className="m3-body-sm" style={{ margin: '2px 0 0' }}>{sub}</p>}
    </div>
  )
}
