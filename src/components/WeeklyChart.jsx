import { shortWeekLabel } from '../utils/date'

export default function WeeklyChart({ weeks }) {
  const max = Math.max(1, ...weeks.flatMap((w) => [w.earned, w.spent]))
  const chartH = 140
  const barW = 14
  const gap = 10
  const groupW = barW * 2 + 4
  const width = weeks.length * (groupW + gap) + gap

  return (
    <div style={{ overflowX: 'auto' }}>
      <svg width={Math.max(width, 280)} height={chartH + 40} role="img" aria-label="Weekly earned vs spent">
        {weeks.map((w, i) => {
          const x = gap + i * (groupW + gap)
          const earnH = (w.earned / max) * chartH
          const spendH = (w.spent / max) * chartH
          return (
            <g key={w.weekKey}>
              <rect x={x} y={chartH - earnH} width={barW} height={earnH} rx={4} fill="var(--md-primary, #6750a4)" />
              <rect x={x + barW + 4} y={chartH - spendH} width={barW} height={spendH} rx={4} fill="var(--md-error, #b3261e)" />
              <text x={x + groupW / 2} y={chartH + 18} textAnchor="middle" fontSize="10" fill="var(--md-on-surface-variant, #49454f)">
                {shortWeekLabel(w.start)}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="row gap-12" style={{ marginTop: 4 }}>
        <Legend color="var(--md-primary, #6750a4)" label="Earned" />
        <Legend color="var(--md-error, #b3261e)" label="Spent" />
      </div>
    </div>
  )
}

function Legend({ color, label }) {
  return (
    <span className="row gap-8 m3-body-sm">
      <span style={{ width: 10, height: 10, borderRadius: 3, background: color, display: 'inline-block' }} />
      {label}
    </span>
  )
}
