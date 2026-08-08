import { useEffect, useRef } from 'react'
import { useAppState, useAppActions } from '../context/AppContext'
import { useSnackbar } from '../context/SnackbarContext'
import { getDueBillCharges } from '../utils/selectors'
import { formatMoney } from '../utils/currency'

const CHECK_INTERVAL_MS = 5 * 60 * 1000

// Fixed spends charge on a schedule regardless of what the user does — this is the
// one place that applies them, so the cost keeps ticking even if the app stays open
// across midnight or gets reopened days later.
export default function BillSync() {
  const { bills, logs, settings } = useAppState()
  const { chargeBills } = useAppActions()
  const notify = useSnackbar()
  const stateRef = useRef({ bills, logs })
  stateRef.current = { bills, logs }

  useEffect(() => {
    function sync() {
      const { bills, logs } = stateRef.current
      const charges = getDueBillCharges(bills, logs)
      if (!charges.length) return
      chargeBills(charges)
      const total = charges.reduce((s, c) => s + Math.abs(c.amount), 0)
      const names = [...new Set(charges.map((c) => bills.find((b) => b.id === c.billId)?.name))].filter(Boolean)
      const label = names.length === 1 ? names[0] : `${names.length} fixed spends`
      notify(`${label} charged: -${formatMoney(total, settings.currencyCode)}`)
    }
    sync()
    const interval = setInterval(sync, CHECK_INTERVAL_MS)
    document.addEventListener('visibilitychange', sync)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', sync)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bills])

  return null
}
