const TABS = [
  { key: 'home', label: 'Home', icon: '🏠' },
  { key: 'tasks', label: 'Habits', icon: '✅' },
  { key: 'stats', label: 'Stats', icon: '📊' },
  { key: 'settings', label: 'Settings', icon: '⚙️' },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="m3-bottom-nav" aria-label="Primary">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          className={`m3-nav-item${active === tab.key ? ' active' : ''}`}
          onClick={() => onChange(tab.key)}
          aria-current={active === tab.key ? 'page' : undefined}
        >
          <span className="pill">{tab.icon}</span>
          <span className="label">{tab.label}</span>
        </button>
      ))}
    </nav>
  )
}
