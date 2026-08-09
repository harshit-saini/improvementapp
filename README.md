# GoodCoin — turn your habits into fake currency

Earn fake cash for the habits you want to build, and spend it guilt-free on
the ones you allow yourself (ice cream, late-night scrolling, whatever).
Everything is stored on-device — no backend, no account, works offline.

## Features

- **Home** — today's date, today's net balance vs. all-time overall balance,
  a search bar, and your good habits / guilty pleasures as tap-to-log cards.
- **Habits** — add, edit, or delete habits: name, reward/cost, emoji, category,
  whether it can be logged once or multiple times a day, and an optional
  **streak bonus** — keep a habit going for N days and its reward/cost jumps
  to a higher amount you set, resetting to the base rate if the streak breaks.
- **Fixed spends** — the "shop": recurring costs (daily or weekly) that charge
  automatically on schedule whether or not you've earned anything, so there's
  always a reason to keep the good habits going. Managed from the Habits page.
- **Stats** — weekly earned-vs-spent chart, a GitHub-style calendar heatmap of
  daily consistency (tap any day for its net and activity count), current
  streaks, most-logged habits, and unlockable achievements.
- **Settings** — pick your currency (16 options), light/dark/system theme,
  a Material You accent color (generates a full tonal palette from a seed
  color), independent daily/weekly/monthly net-earnings goals with progress
  bars on Home, and JSON export/import/reset.
- Installable as a **PWA** (add to home screen, works offline via service
  worker), mobile-first responsive layout, undo on every action via snackbar,
  and a confirmation prompt before spending you into debt.

## Design

Styled after Google's **Material You (M3)**: dynamic color generated from a
seed hue via `@material/material-color-utilities`, M3 shape/elevation/typography
scale, filled/tonal/outlined buttons, bottom navigation, and bottom-sheet dialogs.

## Development

```bash
npm install
npm run dev      # local dev server
npm run build    # production build + PWA manifest/service worker
npm run preview  # preview the production build
```

All data lives in `localStorage` on the device — there is no server.
