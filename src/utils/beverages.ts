import { Locale, getLocale } from "./i18n";

// ─────────────────────────────────────────────
//  Beverage catalog
// ─────────────────────────────────────────────
//
// Hydration ratios approximate the net hydration a beverage provides
// vs. an equal volume of plain water. Sources differ — these are
// commonly cited values used by mainstream hydration apps:
//   water        1.00
//   sports drink 1.00 (electrolytes ~ neutral at moderate intake)
//   milk         0.90
//   tea          0.85
//   juice        0.85
//   soda         0.70
//   coffee       0.60 (mild diuretic in caffeinated form)
//
// `effectiveAmount = round(amount * hydrationRatio)`.

export interface Beverage {
  id: string;
  hydrationRatio: number;
  color: string; // hex, used for UI swatch
  emoji: string;
}

export const BEVERAGES: Beverage[] = [
  { id: "water",        hydrationRatio: 1.0,  color: "#4FC3F7", emoji: "💧" },
  { id: "tea",          hydrationRatio: 0.85, color: "#A1887F", emoji: "🍵" },
  { id: "coffee",       hydrationRatio: 0.6,  color: "#6D4C41", emoji: "☕" },
  { id: "juice",        hydrationRatio: 0.85, color: "#FFB74D", emoji: "🧃" },
  { id: "milk",         hydrationRatio: 0.9,  color: "#FAFAFA", emoji: "🥛" },
  { id: "soda",         hydrationRatio: 0.7,  color: "#7E57C2", emoji: "🥤" },
  { id: "sportsDrink",  hydrationRatio: 1.0,  color: "#66BB6A", emoji: "🏃" },
];

export const DEFAULT_BEVERAGE_ID = "water";

const BY_ID: Record<string, Beverage> = BEVERAGES.reduce(
  (acc, b) => {
    acc[b.id] = b;
    return acc;
  },
  {} as Record<string, Beverage>,
);

export const getBeverageById = (id: string | undefined): Beverage =>
  (id && BY_ID[id]) || BY_ID[DEFAULT_BEVERAGE_ID];

export const computeEffectiveAmount = (
  amount: number,
  beverageId: string | undefined,
): number => {
  const b = getBeverageById(beverageId);
  return Math.round(amount * b.hydrationRatio);
};

// ─────────────────────────────────────────────
//  Localized names
// ─────────────────────────────────────────────

const NAMES: Record<Locale, Record<string, string>> = {
  en: {
    water: "Water",
    tea: "Tea",
    coffee: "Coffee",
    juice: "Juice",
    milk: "Milk",
    soda: "Soda",
    sportsDrink: "Sports drink",
  },
  zh: {
    water: "水",
    tea: "茶",
    coffee: "咖啡",
    juice: "果汁",
    milk: "牛奶",
    soda: "汽水",
    sportsDrink: "运动饮料",
  },
};

export const getBeverageName = (id: string, locale?: Locale): string => {
  const loc: Locale = locale ?? getLocale();
  const tbl = NAMES[loc] || NAMES.en;
  return tbl[id] ?? id;
};

// Convenience: translate using current locale (re-runs each render).
export const tBeverage = (id: string): string => getBeverageName(id);
