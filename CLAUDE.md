# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Water Tracker is an Expo + React Native + TypeScript mobile app (`strict` TypeScript). State is centralized in a single hook (`src/hooks/useWaterTracker.ts`); persistence is AsyncStorage-only. There is no global store, no backend, and no test suite configured.

## Common Commands

```bash
npm install            # install dependencies
npm run start          # start Metro / Expo dev server
npm run android        # run on a connected Android device/emulator (expo run:android)
npm run ios            # run on iOS simulator (expo run:ios)
npm run web            # web preview
npm run apk:release    # build release APK via gradlew (cd android && gradlew.bat assembleRelease)
```

EAS profiles (`development`, `preview`, `production`) live in `eas.json`; Android outputs are APK. There is no lint, format, or test script — manual validation on device/emulator is the expected workflow.

## Entry Flow & Navigation

- `index.ts` → `App.tsx` (wraps `<ErrorBoundary>`) → `src/index.tsx` (root `App` component).
- `src/index.tsx` wraps the tree in `ThemeProvider` (`src/contexts/ThemeContext.tsx`) and a `NavigationContainer` with a bottom-tab navigator: **Home / Pet / Stats / Settings**.
- The root `App` calls `useWaterTracker()` once and passes `todayLog`, `settings`, and the `addWater`/`removeEntry`/`updateSettings` actions down to screens as props.

## Architecture & Data Flow

- **Single source of truth**: `useWaterTracker` loads & owns `todayLog` and `settings`, exposing mutators. Screens are presentation + local form state only — business logic lives in hooks/utils.
- **Storage layer** (`src/utils/storage.ts`): AsyncStorage keys are namespaced with `@watertracker:` (e.g. `@watertracker:daily_logs`). Daily logs are keyed by `YYYY-MM-DD` date strings. Always use `getToday()` / `getDateRange()` helpers — do not ad-hoc-format dates.
- **Mutation invariant**: when adding/removing water entries, recalculate `log.total` from `entries` on every write (see `addWaterEntry` / `removeWaterEntry`). When updating settings, merge partial updates via `updateSettings` and persist with `saveSettings`.
- **Stats**: `StatsScreen` reads logs via `getWeeklyData()` and computes aggregates client-side.
- **Streaks**: `getStreakData()` is loaded in the root `App` whenever `todayLog` changes and passed into `PetScreen`.
- **Pet system**: separate state/persistence in `src/utils/petState.ts` and `src/utils/petStorage.ts`; rendered by `PetScreen` and the `PetCharacter` / `PetLottie` / `PixelScene` components.

## Notifications

- Managed in `src/utils/notifications.ts` via `expo-notifications`.
- Enabling reminders in `SettingsScreen` requests permissions, then schedules **DAILY** triggers for each interval slot. Always start by calling `cancelAllReminders()` to avoid duplicate schedules.
- Android channel `water-reminders` is created on permission grant.
- Plugin config is in `app.json` under `plugins["expo-notifications"]`.

## Project Conventions

- **Types**: reuse `WaterEntry`, `DailyLog`, `UserSettings`, `StreakData` from `src/types/index.ts` rather than redefining inline shapes.
- **Theme palette**: dark theme — backgrounds `#1a1a2e` / `#2d2d44`, accent `#4FC3F7`. Theme overrides are funneled through `ThemeContext` + `src/utils/theme.ts`.
- **Haptics**: use `src/utils/haptics.ts` wrappers rather than calling `expo-haptics` directly.
- **userInterfaceStyle** is locked to `"dark"` in `app.json`.

## High-Value Files (read first when changing behavior)

- `src/hooks/useWaterTracker.ts` — state lifecycle and mutation entry points
- `src/utils/storage.ts` — persistence format, storage keys, date helpers
- `src/utils/notifications.ts` + `src/screens/SettingsScreen.tsx` — permission and reminder scheduling
- `src/screens/StatsScreen.tsx` — weekly/monthly aggregation and chart labeling
- `src/utils/petState.ts` / `src/utils/petStorage.ts` — pet/streak progression rules
