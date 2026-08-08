export const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'COIN', symbol: '🪙', name: 'GoodCoin (fun points)' },
]

export function getCurrency(code) {
  return CURRENCIES.find((c) => c.code === code) || CURRENCIES[0]
}

export function formatMoney(amount, currencyCode) {
  const currency = getCurrency(currencyCode)
  const rounded = Math.round(amount * 100) / 100
  const abs = Math.abs(rounded)
  const formatted = abs % 1 === 0 ? abs.toFixed(0) : abs.toFixed(2)
  const sign = rounded < 0 ? '-' : ''
  return `${sign}${currency.symbol}${formatted}`
}

export function formatSigned(amount, currencyCode) {
  const sign = amount > 0 ? '+' : ''
  return `${sign}${formatMoney(amount, currencyCode)}`
}
