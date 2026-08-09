const STORAGE_KEY = 'goodcoin.v1'

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // storage full or unavailable — silently skip, in-memory state still works
  }
}

export function defaultState() {
  const now = Date.now()
  return {
    version: 1,
    settings: {
      currencyCode: 'USD',
      themeMode: 'system',
      seedColor: '#6750A4',
      savingsGoals: {
        daily: { name: 'Coffee treat', amount: 10 },
        weekly: { name: 'Weekend treat', amount: 50 },
        monthly: { name: 'Something nice', amount: 150 },
      },
      onboarded: false,
    },
    habits: [
      { id: 'h1', name: 'Morning workout', type: 'good', amount: 5, emoji: '🏋️', category: 'Health', repeatable: false, archived: false, createdAt: now, streakBoostDays: 7, streakBoostAmount: 10 },
      { id: 'h2', name: 'Read 20 minutes', type: 'good', amount: 3, emoji: '📖', category: 'Growth', repeatable: false, archived: false, createdAt: now },
      { id: 'h3', name: 'Drink a glass of water', type: 'good', amount: 1, emoji: '💧', category: 'Health', repeatable: true, archived: false, createdAt: now },
      { id: 'h4', name: 'Make my bed', type: 'good', amount: 2, emoji: '🛏️', category: 'Chores', repeatable: false, archived: false, createdAt: now },
      { id: 'h5', name: 'Ice cream', type: 'bad', amount: 4, emoji: '🍦', category: 'Treats', repeatable: true, archived: false, createdAt: now },
      { id: 'h6', name: 'Late-night scrolling', type: 'bad', amount: 6, emoji: '📱', category: 'Screen time', repeatable: false, archived: false, createdAt: now },
      { id: 'h7', name: 'Skip the gym', type: 'bad', amount: 5, emoji: '🛋️', category: 'Health', repeatable: false, archived: false, createdAt: now },
    ],
    bills: [
      { id: 'b1', name: 'Daily upkeep', amount: 2, emoji: '🏠', category: 'Living costs', frequency: 'daily', archived: false, createdAt: now },
      { id: 'b2', name: 'Streaming subscription', amount: 8, emoji: '📺', category: 'Subscriptions', frequency: 'weekly', archived: false, createdAt: now },
    ],
    logs: [],
  }
}

// Fills in fields introduced after a save/export was made (e.g. old saves have no
// `bills` array, or a singular `savingsGoal` instead of per-period `savingsGoals`)
// without touching the user's actual habits/logs/settings.
export function normalizeState(loaded) {
  if (!loaded) return defaultState()
  const defaults = defaultState()
  return {
    ...loaded,
    bills: loaded.bills || [],
    settings: {
      ...defaults.settings,
      ...loaded.settings,
      savingsGoals: {
        daily: { ...defaults.settings.savingsGoals.daily, ...loaded.settings?.savingsGoals?.daily },
        weekly: { ...defaults.settings.savingsGoals.weekly, ...loaded.settings?.savingsGoals?.weekly },
        monthly: { ...defaults.settings.savingsGoals.monthly, ...loaded.settings?.savingsGoals?.monthly },
      },
    },
  }
}
