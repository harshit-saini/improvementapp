import { useMemo, useState } from 'react'
import { searchIcons } from '../utils/icons'

export default function IconPicker({ value, onChange }) {
  const [query, setQuery] = useState('')
  const results = useMemo(() => searchIcons(query), [query])

  return (
    <div>
      <div className="m3-search" style={{ height: 44, marginBottom: 10 }}>
        <span>🔍</span>
        <input
          placeholder="Search icons… (e.g. run, coffee, sleep)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {query && (
          <button className="m3-icon-btn" style={{ width: 26, height: 26 }} onClick={() => setQuery('')}>✕</button>
        )}
      </div>

      {results.length === 0 ? (
        <p className="m3-body-sm" style={{ margin: '4px 0' }}>No icons match "{query}" — try a different word.</p>
      ) : (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            maxHeight: 176,
            overflowY: 'auto',
            paddingRight: 2,
          }}
        >
          {results.map(({ emoji }) => (
            <button
              key={emoji}
              className={`m3-chip${value === emoji ? ' selected' : ''}`}
              onClick={() => onChange(emoji)}
              aria-label={emoji}
              style={{ fontSize: '1.15rem', width: 42, height: 42, justifyContent: 'center', padding: 0, flexShrink: 0 }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
