# AGENTS.md

## Project overview
- Mobile hydration tracker built with Expo + React Native + TypeScript (`strict` mode in `tsconfig.json`).
- Entry flow: `index.ts` -> `App.tsx` -> `src/index.tsx`.
- Navigation is bottom tabs (`Home`, `Stats`, `Settings`) created in `src/index.tsx`.
- Shared app state is centralized in one hook: `src/hooks/useWaterTracker.ts`.

## Architecture and data flow
- `useWaterTracker` loads and owns `todayLog` + `settings`, then passes state/actions down as screen props (no global store).
- Persistence is AsyncStorage-only via `src/utils/storage.ts`.
- Data model is keyed by date string (`YYYY-MM-DD`) and stored under `@watertracker:daily_logs`.
- Home actions call `addWaterEntry` / `removeWaterEntry`, which recalculate `log.total` from entries each write.
- Settings updates merge partial updates in `updateSettings` and persist with `saveSettings`.
- Stats screen reads all logs via `getWeeklyData()` and computes aggregates client-side (`src/screens/StatsScreen.tsx`).

## Notification integration
- Notifications are managed in `src/utils/notifications.ts` using `expo-notifications`.
- Enabling reminders in `SettingsScreen` requests permissions, then schedules DAILY triggers for each interval slot.
- Scheduling always starts by clearing existing reminders (`cancelAllReminders`) to avoid duplicates.
- Android channel `water-reminders` is created when permissions are granted.
- Expo notifications plugin config lives in `app.json` (`plugins["expo-notifications"]`).

## Developer workflows
- Install deps: `npm install`
- Start Metro/Expo: `npm run start`
- Run Android locally: `npm run android`
- Run iOS locally: `npm run ios`
- Web preview: `npm run web`
- EAS profiles are in `eas.json` (`development`, `preview`, `production`), all Android outputs are APK.
- There is currently no test script configured in `package.json`; manual validation is expected.

## Project-specific conventions
- Keep screen components focused on UI + local form state; business logic belongs in hooks/utils.
- Reuse existing types from `src/types/index.ts` (`WaterEntry`, `DailyLog`, `UserSettings`) rather than inline shapes.
- Preserve dark theme palette used across screens (`#1a1a2e`, `#2d2d44`, accent `#4FC3F7`).
- Use date strings from `getToday()` / `getDateRange()` for storage lookups (avoid ad hoc date formatting).
- When adding hydration mutations, always update both `entries` and derived `total` like `addWaterEntry`/`removeWaterEntry`.

## High-value files to read first
- `src/hooks/useWaterTracker.ts` - app state lifecycle and mutation entry points.
- `src/utils/storage.ts` - persistence format and storage keys.
- `src/screens/SettingsScreen.tsx` + `src/utils/notifications.ts` - permission + reminder scheduling behavior.
- `src/screens/StatsScreen.tsx` - weekly/monthly aggregation and chart labeling behavior.

