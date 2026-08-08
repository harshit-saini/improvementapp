export function todayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function formatFriendlyDate(d = new Date()) {
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

export function daysAgoKey(n, from = new Date()) {
  const d = new Date(from)
  d.setDate(d.getDate() - n)
  return todayKey(d)
}

export function keyToDate(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

// Monday-start ISO week key, e.g. "2026-W32"
export function weekKey(dateKey) {
  const d = keyToDate(dateKey)
  const day = (d.getDay() + 6) % 7 // 0 = Monday
  d.setDate(d.getDate() - day + 3) // nearest Thursday
  const firstThursday = new Date(d.getFullYear(), 0, 4)
  const fdDay = (firstThursday.getDay() + 6) % 7
  firstThursday.setDate(firstThursday.getDate() - fdDay + 3)
  const week = 1 + Math.round((d - firstThursday) / (7 * 86400000))
  return `${d.getFullYear()}-W${String(week).padStart(2, '0')}`
}

export function startOfWeek(dateKey) {
  const d = keyToDate(dateKey)
  const day = (d.getDay() + 6) % 7
  d.setDate(d.getDate() - day)
  return todayKey(d)
}

export function lastNWeeks(n, from = new Date()) {
  const weeks = []
  const seen = new Set()
  for (let i = 0; i < n * 7 + 7; i++) {
    const key = daysAgoKey(i, from)
    const wk = weekKey(key)
    if (!seen.has(wk)) {
      seen.add(wk)
      weeks.push({ weekKey: wk, start: startOfWeek(key) })
    }
    if (seen.size >= n) break
  }
  return weeks.reverse()
}

export function shortWeekLabel(start) {
  const d = keyToDate(start)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}
