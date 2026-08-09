import { useEffect, useMemo, useRef, useState } from 'react'
import { keyToDate } from '../utils/date'
import { formatMoney } from '../utils/currency'

const LEVELS = [0, 0.28, 0.48, 0.68, 0.9]
const CELL = 12
const GAP = 3
const DOW_LABELS = ['Mon', '', 'Wed', '', 'Fri', '', '']

function buildWeeks(days) {
  const weeks = []
  let current = new Array(7).fill(null)
  for (const day of days) {
    const dow = (keyToDate(day.dateKey).getDay() + 6) % 7 // 0 = Mon .. 6 = Sun
    current[dow] = day
    if (dow === 6) {
      weeks.push(current)
      current = new Array(7).fill(null)
    }
  }
  if (current.some(Boolean)) weeks.push(current)
  return weeks
}

function levelFor(net, maxAbs) {
  if (!net || !maxAbs) return 0
  const ratio = Math.min(1, Math.abs(net) / maxAbs)
  return ratio > 0.75 ? 4 : ratio > 0.5 ? 3 : ratio > 0.25 ? 2 : 1
}

function hexToRgbString(hex, fallback) {
  const clean = (hex || '').trim()
  if (!/^#[0-9a-fA-F]{6}$/.test(clean)) return fallback
  const n = parseInt(clean.slice(1), 16)
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`
}

export default function CalendarHeatmap({ days, currencyCode }) {
  const scrollRef = useRef(null)
  const [selected, setSelected] = useState(null)

  const weeks = useMemo(() => buildWeeks(days), [days])
  const maxAbs = useMemo(() => Math.max(1, ...days.map((d) => Math.abs(d.net))), [days])

  const styles = typeof window !== 'undefined' ? getComputedStyle(document.documentElement) : null
  const primaryRgb = hexToRgbString(styles?.getPropertyValue('--md-primary'), '103, 80, 164')
  const errorRgb = hexToRgbString(styles?.getPropertyValue('--md-error'), '179, 38, 30')

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
  }, [weeks])

  function colorFor(day) {
    if (!day || (!day.net && !day.count)) return 'var(--md-surface-container-highest, #e6e0e9)'
    const level = levelFor(day.net, maxAbs)
    const rgb = day.net >= 0 ? primaryRgb : errorRgb
    return `rgba(${rgb}, ${LEVELS[level]})`
  }

  let lastMonth = null

  return (
    <div>
      <div ref={scrollRef} style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'inline-flex', gap: GAP }}>
          <div className="col" style={{ gap: GAP, marginTop: 16, marginRight: 2 }}>
            {DOW_LABELS.map((label, i) => (
              <span key={i} style={{ height: CELL, fontSize: 9, lineHeight: `${CELL}px`, color: 'var(--md-on-surface-variant)' }}>
                {label}
              </span>
            ))}
          </div>
          {weeks.map((week, wi) => {
            const firstDay = week.find(Boolean)
            const month = firstDay ? keyToDate(firstDay.dateKey).toLocaleDateString(undefined, { month: 'short' }) : null
            const showMonth = month && month !== lastMonth
            if (showMonth) lastMonth = month
            return (
              <div key={wi} className="col" style={{ gap: GAP }}>
                <span style={{ display: 'block', height: 12, fontSize: 9, color: 'var(--md-on-surface-variant)' }}>{showMonth ? month : ''}</span>
                {week.map((day, di) => (
                  <button
                    key={di}
                    onClick={() => day && setSelected(day)}
                    aria-label={day ? day.dateKey : undefined}
                    disabled={!day}
                    style={{
                      width: CELL,
                      height: CELL,
                      borderRadius: 3,
                      background: colorFor(day),
                      border: 'none',
                      padding: 0,
                      cursor: day ? 'pointer' : 'default',
                      outline: selected?.dateKey === day?.dateKey ? '2px solid var(--md-primary)' : 'none',
                      outlineOffset: 1,
                    }}
                  />
                ))}
              </div>
            )
          })}
        </div>
      </div>

      <div className="row between" style={{ marginTop: 10, flexWrap: 'wrap', gap: 8 }}>
        <span className="m3-body-sm">
          {selected
            ? `${keyToDate(selected.dateKey).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}: ${
                selected.count
                  ? `${selected.net >= 0 ? '+' : ''}${formatMoney(selected.net, currencyCode)} · ${selected.count} ${selected.count === 1 ? 'activity' : 'activities'}`
                  : 'No activity'
              }`
            : 'Tap a day for details'}
        </span>
        <span className="row gap-8 m3-body-sm">
          Less
          {LEVELS.map((level, i) => (
            <span
              key={i}
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                display: 'inline-block',
                background: i === 0 ? 'var(--md-surface-container-highest)' : `rgba(${primaryRgb}, ${level})`,
              }}
            />
          ))}
          More
        </span>
      </div>
    </div>
  )
}
