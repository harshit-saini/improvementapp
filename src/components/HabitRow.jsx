import { formatMoney } from '../utils/currency'

export default function HabitRow({ habit, currencyCode, done, count, streak, onAct, onUndo }) {
  const isGood = habit.type === 'good'
  const showUndo = habit.repeatable ? count > 0 : done

  return (
    <div className={`m3-card outlined row between`} style={{ gap: 12 }}>
      <button
        className="row gap-12"
        style={{ background: 'transparent', border: 'none', flex: 1, textAlign: 'left', padding: 0, minWidth: 0 }}
        onClick={onAct}
      >
        <span
          className="emoji"
          style={{
            width: 44,
            height: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 'var(--shape-md)',
            background: done && !habit.repeatable ? 'var(--md-primary-container)' : 'var(--md-surface-container-high)',
            flexShrink: 0,
          }}
        >
          {habit.emoji || (isGood ? '✅' : '⚠️')}
        </span>
        <span className="col" style={{ minWidth: 0 }}>
          <span className="m3-title-sm" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {habit.name}
          </span>
          <span className="m3-body-sm row gap-8">
            <span>{isGood ? '+' : '-'}{formatMoney(habit.amount, currencyCode)}</span>
            {habit.repeatable && count > 0 && <span>· ×{count} today</span>}
            {isGood && streak > 0 && <span>· 🔥 {streak}d</span>}
          </span>
        </span>
      </button>
      <div className="row gap-8" style={{ flexShrink: 0 }}>
        {showUndo && (
          <button className="m3-icon-btn" title="Undo" onClick={onUndo}>
            ↩️
          </button>
        )}
        {!showUndo && (
          <button className={`m3-btn sm ${isGood ? 'filled' : 'tonal'}`} onClick={onAct}>
            {isGood ? 'Do it' : 'Spend'}
          </button>
        )}
      </div>
    </div>
  )
}
