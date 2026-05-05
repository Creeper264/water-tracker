// v2.3.0 — Smart daily-goal calculator.
//
// Formula (rounded to nearest 50 ml, clamped to [1500, 4500]):
//   weightKg * 30
//     + activity bonus { sedentary 0, light 200, moderate 400, high 700 }
//     + climate bonus  { cool 0, temperate 100, hot 300 }
//
// 30 ml/kg is a widely cited baseline (e.g. EFSA general guidance scaled
// per body weight). Activity / climate bonuses approximate the additional
// fluid loss surveyed in mainstream hydration apps.

export type ActivityLevel = "sedentary" | "light" | "moderate" | "high";
export type ClimateLevel = "cool" | "temperate" | "hot";

const ACTIVITY_BONUS: Record<ActivityLevel, number> = {
  sedentary: 0,
  light: 200,
  moderate: 400,
  high: 700,
};

const CLIMATE_BONUS: Record<ClimateLevel, number> = {
  cool: 0,
  temperate: 100,
  hot: 300,
};

const MIN_GOAL_ML = 1500;
const MAX_GOAL_ML = 4500;
const ROUND_STEP = 50;

export const recommendDailyGoalMl = (
  weightKg: number,
  activity: ActivityLevel,
  climate: ClimateLevel,
): number => {
  if (!Number.isFinite(weightKg) || weightKg <= 0) return MIN_GOAL_ML;

  const raw =
    weightKg * 30 + ACTIVITY_BONUS[activity] + CLIMATE_BONUS[climate];

  const clamped = Math.max(MIN_GOAL_ML, Math.min(MAX_GOAL_ML, raw));
  return Math.round(clamped / ROUND_STEP) * ROUND_STEP;
};

export const ACTIVITY_LEVELS: ActivityLevel[] = [
  "sedentary",
  "light",
  "moderate",
  "high",
];

export const CLIMATE_LEVELS: ClimateLevel[] = ["cool", "temperate", "hot"];
