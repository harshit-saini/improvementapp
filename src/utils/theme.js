import { CorePalette, argbFromHex, hexFromArgb } from '@material/material-color-utilities'

// Builds a full Material You (M3) color scheme from a single seed color,
// including the surface-container tones the deprecated `Scheme` class omits.
function buildScheme(core, tones) {
  const roles = {
    primary: core.a1.tone(tones.primary),
    onPrimary: core.a1.tone(tones.onPrimary),
    primaryContainer: core.a1.tone(tones.primaryContainer),
    onPrimaryContainer: core.a1.tone(tones.onPrimaryContainer),
    secondary: core.a2.tone(tones.primary),
    onSecondary: core.a2.tone(tones.onPrimary),
    secondaryContainer: core.a2.tone(tones.primaryContainer),
    onSecondaryContainer: core.a2.tone(tones.onPrimaryContainer),
    tertiary: core.a3.tone(tones.primary),
    onTertiary: core.a3.tone(tones.onPrimary),
    tertiaryContainer: core.a3.tone(tones.primaryContainer),
    onTertiaryContainer: core.a3.tone(tones.onPrimaryContainer),
    error: core.error.tone(tones.primary),
    onError: core.error.tone(tones.onPrimary),
    errorContainer: core.error.tone(tones.primaryContainer),
    onErrorContainer: core.error.tone(tones.onPrimaryContainer),
    background: core.n1.tone(tones.background),
    onBackground: core.n1.tone(tones.onBackground),
    surface: core.n1.tone(tones.background),
    onSurface: core.n1.tone(tones.onBackground),
    surfaceVariant: core.n2.tone(tones.surfaceVariant),
    onSurfaceVariant: core.n2.tone(tones.onSurfaceVariant),
    outline: core.n2.tone(tones.outline),
    outlineVariant: core.n2.tone(tones.outlineVariant),
    shadow: core.n1.tone(0),
    scrim: core.n1.tone(0),
    inverseSurface: core.n1.tone(tones.onBackground),
    inverseOnSurface: core.n1.tone(tones.background),
    inversePrimary: core.a1.tone(tones.onPrimaryContainer > 50 ? 40 : 80),
    surfaceContainerLowest: core.n1.tone(tones.containerLowest),
    surfaceContainerLow: core.n1.tone(tones.containerLow),
    surfaceContainer: core.n1.tone(tones.container),
    surfaceContainerHigh: core.n1.tone(tones.containerHigh),
    surfaceContainerHighest: core.n1.tone(tones.containerHighest),
  }
  const out = {}
  for (const [key, argb] of Object.entries(roles)) out[key] = hexFromArgb(argb)
  return out
}

const LIGHT_TONES = {
  primary: 40, onPrimary: 100, primaryContainer: 90, onPrimaryContainer: 10,
  background: 98, onBackground: 10, surfaceVariant: 90, onSurfaceVariant: 30,
  outline: 50, outlineVariant: 80,
  containerLowest: 100, containerLow: 96, container: 94, containerHigh: 92, containerHighest: 90,
}

const DARK_TONES = {
  primary: 80, onPrimary: 20, primaryContainer: 30, onPrimaryContainer: 90,
  background: 6, onBackground: 90, surfaceVariant: 30, onSurfaceVariant: 80,
  outline: 60, outlineVariant: 30,
  containerLowest: 4, containerLow: 10, container: 12, containerHigh: 17, containerHighest: 22,
}

export function schemesFromSeed(seedHex) {
  const core = CorePalette.of(argbFromHex(seedHex))
  return {
    light: buildScheme(core, LIGHT_TONES),
    dark: buildScheme(core, DARK_TONES),
  }
}

export function applySchemeToDocument(seedHex, mode) {
  const { light, dark } = schemesFromSeed(seedHex)
  const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
  const scheme = isDark ? dark : light
  const root = document.documentElement
  for (const [key, hex] of Object.entries(scheme)) {
    const token = key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    root.style.setProperty(`--md-${token}`, hex)
  }
  root.style.setProperty('color-scheme', isDark ? 'dark' : 'light')
  root.dataset.theme = isDark ? 'dark' : 'light'
  const themeColorMeta = document.querySelector('meta[name="theme-color"]')
  if (themeColorMeta) themeColorMeta.setAttribute('content', scheme.surface)
}

export const SEED_PRESETS = [
  { name: 'Grape', hex: '#6750A4' },
  { name: 'Mint', hex: '#146356' },
  { name: 'Ocean', hex: '#0F6FC6' },
  { name: 'Sunset', hex: '#B3261E' },
  { name: 'Marigold', hex: '#8B5A00' },
  { name: 'Rose', hex: '#984061' },
  { name: 'Forest', hex: '#3D6B37' },
  { name: 'Slate', hex: '#54627A' },
]
