import { useEffect, useState } from 'react'
import { AppProvider } from './context/AppContext'
import { SnackbarProvider } from './context/SnackbarContext'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Tasks from './pages/Tasks'
import Stats from './pages/Stats'
import Settings from './pages/Settings'

const PAGES = { home: Home, tasks: Tasks, stats: Stats, settings: Settings }
const TITLES = { home: 'GoodCoin', tasks: 'Habits', stats: 'Stats', settings: 'Settings' }

function validTab(hash) {
  const key = hash.replace('#/', '')
  return PAGES[key] ? key : 'home'
}

function Shell() {
  const [tab, setTab] = useState(() => validTab(window.location.hash))

  useEffect(() => {
    const onHashChange = () => setTab(validTab(window.location.hash))
    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [])

  function changeTab(next) {
    window.location.hash = `/${next}`
    setTab(next)
  }

  const Page = PAGES[tab]

  return (
    <div className="app-shell">
      <header className="app-topbar">
        <span className="emoji">🪙</span>
        <h1 className="m3-title" style={{ margin: 0 }}>{TITLES[tab]}</h1>
      </header>
      <main className="app-content">
        <Page />
      </main>
      <BottomNav active={tab} onChange={changeTab} />
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <SnackbarProvider>
        <Shell />
      </SnackbarProvider>
    </AppProvider>
  )
}
