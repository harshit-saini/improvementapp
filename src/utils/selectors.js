import { todayKey, daysAgoKey, lastNWeeks, weekKey } from './date'

export function getBalance(logs) {
  return logs.reduce((sum, l) => sum + l.amount, 0)
}

export function getLogsForDay(logs, dateKey) {
  return logs.filter((l) => l.dateKey === dateKey)
}

export function getHabitEntriesToday(logs, habitId, dateKey) {
  return logs.filter((l) => l.habitId === habitId && l.dateKey === dateKey)
}

export function isDoneToday(logs, habitId, dateKey) {
  return getHabitEntriesToday(logs, habitId, dateKey).length > 0
}

export function countToday(logs, habitId, dateKey) {
  return getHabitEntriesToday(logs, habitId, dateKey).length
}

// Consecutive days (ending today or yesterday) with at least one log for this habit.
export function computeStreak(logs, habitId, from = new Date()) {
  const days = new Set(logs.filter((l) => l.habitId === habitId).map((l) => l.dateKey))
  const today = todayKey(from)
  let streak = 0
  let offset = days.has(today) ? 0 : 1
  if (!days.has(today) && !days.has(daysAgoKey(1, from))) return 0
  while (days.has(daysAgoKey(offset, from))) {
    streak++
    offset++
  }
  return streak
}

export function weeklyStats(logs, weeksCount = 6, from = new Date()) {
  const weeks = lastNWeeks(weeksCount, from)
  const buckets = new Map(weeks.map((w) => [w.weekKey, { ...w, earned: 0, spent: 0 }]))
  for (const l of logs) {
    const wk = weekKey(l.dateKey)
    const bucket = buckets.get(wk)
    if (!bucket) continue
    if (l.amount >= 0) bucket.earned += l.amount
    else bucket.spent += -l.amount
  }
  return Array.from(buckets.values()).map((b) => ({ ...b, net: b.earned - b.spent }))
}

export function habitFrequency(logs, habits) {
  const counts = new Map()
  for (const l of logs) counts.set(l.habitId, (counts.get(l.habitId) || 0) + 1)
  return habits
    .map((h) => ({ habit: h, count: counts.get(h.id) || 0, total: logs.filter((l) => l.habitId === h.id).reduce((s, l) => s + Math.abs(l.amount), 0) }))
    .sort((a, b) => b.count - a.count)
}

export function computeAchievements(state) {
  const { logs, habits } = state
  const balance = getBalance(logs)
  const goodHabits = habits.filter((h) => h.type === 'good')
  const bestStreak = Math.max(0, ...goodHabits.map((h) => computeStreak(logs, h.id)))
  const goodLogs = logs.filter((l) => l.amount > 0)
  const badLogs = logs.filter((l) => l.amount < 0)
  const last7 = Array.from({ length: 7 }, (_, i) => daysAgoKey(i))
  const noBadLast7 = badLogs.every((l) => !last7.includes(l.dateKey))

  return [
    { id: 'first-step', emoji: '👣', title: 'First Step', desc: 'Complete your first good habit', earned: goodLogs.length >= 1 },
    { id: 'streak-3', emoji: '🔥', title: 'On a Roll', desc: 'Hit a 3-day streak', earned: bestStreak >= 3 },
    { id: 'streak-7', emoji: '⚡', title: 'Week Warrior', desc: 'Hit a 7-day streak', earned: bestStreak >= 7 },
    { id: 'streak-30', emoji: '🏆', title: 'Habit Master', desc: 'Hit a 30-day streak', earned: bestStreak >= 30 },
    { id: 'saver-50', emoji: '💰', title: 'Nest Egg', desc: `Reach a balance of 50`, earned: balance >= 50 },
    { id: 'saver-200', emoji: '🏦', title: 'Big Saver', desc: `Reach a balance of 200`, earned: balance >= 200 },
    { id: 'disciplined', emoji: '🧘', title: 'Disciplined Week', desc: 'No guilty spending in 7 days', earned: badLogs.length > 0 && noBadLast7 },
    { id: 'variety', emoji: '🌈', title: 'Well Rounded', desc: 'Log 5 different good habits', earned: new Set(goodLogs.map((l) => l.habitId)).size >= 5 },
  ]
}
