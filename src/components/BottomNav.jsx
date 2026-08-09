const TABS = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'tasks', label: 'Habits', icon: 'task_alt' },
  { key: 'stats', label: 'Stats', icon: 'bar_chart' },
  { key: 'settings', label: 'Settings', icon: 'settings' },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="m3-bottom-nav" aria-label="Primary">
      {TABS.map((tab) => {
        const isActive = active === tab.key
        return (
          <button
            key={tab.key}
            className={`m3-nav-item${isActive ? ' active' : ''}`}
            onClick={() => onChange(tab.key)}
            aria-current={isActive ? 'page' : undefined}
          >
            <span className="pill">
              <span className={`material-symbol${isActive ? ' filled' : ''}`}>{tab.icon}</span>
            </span>
            <span className="label">{tab.label}</span>
          </button>
        )
      })}
    </nav>
  )
}
