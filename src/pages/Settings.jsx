import { useRef, useState } from 'react'
import { useAppState, useAppActions } from '../context/AppContext'
import { useSnackbar } from '../context/SnackbarContext'
import { CURRENCIES } from '../utils/currency'
import { SEED_PRESETS } from '../utils/theme'
import ConfirmDialog from '../components/ConfirmDialog'

const THEME_MODES = [
  { key: 'light', label: '☀️ Light' },
  { key: 'dark', label: '🌙 Dark' },
  { key: 'system', label: '🖥️ Auto' },
]

export default function Settings() {
  const state = useAppState()
  const { updateSettings, importState, resetState } = useAppActions()
  const notify = useSnackbar()
  const fileInput = useRef(null)
  const [resetOpen, setResetOpen] = useState(false)
  const { settings } = state

  function exportData() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `goodcoin-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
    notify('Backup downloaded')
  }

  function onImportFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (!parsed.habits || !parsed.settings) throw new Error('bad shape')
        importState(parsed)
        notify('Data restored')
      } catch {
        notify('That file could not be read')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="stack-16">
      <h1 className="m3-headline" style={{ margin: '4px 0 0' }}>Settings</h1>

      <SectionCard title="Currency">
        <div className="m3-field" style={{ marginBottom: 0 }}>
          <label htmlFor="currency-select">Choose your currency</label>
          <select id="currency-select" value={settings.currencyCode} onChange={(e) => updateSettings({ currencyCode: e.target.value })}>
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>{c.symbol} — {c.name}</option>
            ))}
          </select>
        </div>
      </SectionCard>

      <SectionCard title="Appearance">
        <p className="m3-body-sm" style={{ marginTop: 0 }}>Theme mode</p>
        <div className="m3-segmented">
          {THEME_MODES.map((m) => (
            <button key={m.key} className={settings.themeMode === m.key ? 'selected' : ''} onClick={() => updateSettings({ themeMode: m.key })}>
              {m.label}
            </button>
          ))}
        </div>
        <p className="m3-body-sm">Accent color (Material You)</p>
        <div className="chip-row" style={{ marginBottom: 8 }}>
          {SEED_PRESETS.map((p) => (
            <button
              key={p.hex}
              className="m3-icon-btn"
              title={p.name}
              onClick={() => updateSettings({ seedColor: p.hex })}
              style={{
                background: p.hex,
                width: 36,
                height: 36,
                border: settings.seedColor === p.hex ? '2px solid var(--md-on-surface)' : '2px solid transparent',
              }}
            />
          ))}
          <label className="m3-icon-btn" style={{ width: 36, height: 36, border: '1px dashed var(--md-outline)', cursor: 'pointer' }}>
            🎨
            <input
              type="color"
              value={settings.seedColor}
              onChange={(e) => updateSettings({ seedColor: e.target.value })}
              style={{ position: 'absolute', width: 1, height: 1, opacity: 0 }}
            />
          </label>
        </div>
      </SectionCard>

      <SectionCard title="Savings goal">
        <p className="m3-body-sm" style={{ marginTop: 0 }}>Set something to save your coins toward — shown as a progress bar on Home.</p>
        <div className="m3-field-row">
          <div className="m3-field">
            <label htmlFor="goal-name">Goal name</label>
            <input id="goal-name" value={settings.savingsGoal?.name || ''} onChange={(e) => updateSettings({ savingsGoal: { ...settings.savingsGoal, name: e.target.value } })} />
          </div>
          <div className="m3-field">
            <label htmlFor="goal-amount">Target amount</label>
            <input id="goal-amount" type="number" min="0" value={settings.savingsGoal?.amount ?? 0} onChange={(e) => updateSettings({ savingsGoal: { ...settings.savingsGoal, amount: Number(e.target.value) } })} />
          </div>
        </div>
      </SectionCard>

      <SectionCard title="Your data">
        <p className="m3-body-sm" style={{ marginTop: 0 }}>Everything is stored only on this device. Back it up or move it to another device with export/import.</p>
        <div className="row gap-8" style={{ flexWrap: 'wrap' }}>
          <button className="m3-btn tonal" onClick={exportData}>⬇️ Export backup</button>
          <button className="m3-btn outlined" onClick={() => fileInput.current?.click()}>⬆️ Import backup</button>
          <input ref={fileInput} type="file" accept="application/json" hidden onChange={onImportFile} />
        </div>
        <button className="m3-btn danger full" style={{ marginTop: 12 }} onClick={() => setResetOpen(true)}>🗑️ Reset all data</button>
      </SectionCard>

      <SectionCard title="About">
        <p className="m3-body-sm" style={{ margin: 0 }}>
          GoodCoin turns your habits into a little economy: earn fake cash for the good stuff, spend it guilt-free on the things you allow yourself. Installable as an app, works fully offline, your data never leaves this device.
        </p>
      </SectionCard>

      <ConfirmDialog
        open={resetOpen}
        title="Reset everything?"
        message="This deletes all habits, history, and settings on this device. This can't be undone."
        confirmLabel="Reset"
        danger
        onConfirm={() => {
          resetState()
          setResetOpen(false)
          notify('All data reset')
        }}
        onCancel={() => setResetOpen(false)}
      />
    </div>
  )
}

function SectionCard({ title, children }) {
  return (
    <div className="m3-card outlined">
      <h2 className="m3-title" style={{ margin: '0 0 12px' }}>{title}</h2>
      {children}
    </div>
  )
}
