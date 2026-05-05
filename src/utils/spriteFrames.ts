import { Palette, PixelFrame, AnimationConfig, PetState } from "../types";

// ─────────────────────────────────────────────
//  8-BIT STYLE PALETTE (Limited to 4-5 colors)
// ─────────────────────────────────────────────

export const PALETTE: Palette = {
  // Core 4 colors (8-bit standard)
  BL: "#000000",  // Black outline (ESSENTIAL!)
  SK: "#F8D8B8",  // Skin (light peach)
  HR: "#483020",  // Hair (dark brown)
  BD: "#38B0D8",  // Body (cyan blue)

  // Facial features (using existing colors)
  EY: "#000000",  // Eyes (black, same as outline)
  WH: "#FFFFFF",  // White (for highlights)

  // State colors (change body color based on state)
  C_DYING: "#787878",    // Gray
  C_WEAK: "#E8A030",     // Orange
  C_NORMAL: "#38B0D8",   // Cyan
  C_GOOD: "#50C878",     // Green
  C_HAPPY: "#70E090",    // Bright green
  C_OVERFLOW: "#B078D8", // Purple

  // Effect colors
  ST: "#F8D830",  // Star (gold)
  SW: "#A04040",  // Sweat (dark red)
  DR: "#B078D8",  // Droplet (purple)

  // Transparent
  ".": null,
};

// ─────────────────────────────────────────────
//  TRUE 8-BIT STYLE FRAMES
//  Key features:
//  - Black outline around entire character
//  - Limited color palette (4-5 colors)
//  - Oversized head (chibi style)
//  - Simple facial features (1-pixel eyes)
// ─────────────────────────────────────────────

// Frame dimensions: 10 wide x 12 tall (wider for outline, shorter for chibi)

// ─────────────────────────────────────────────
//  NORMAL STATE (Cyan body, happy expression)
// ─────────────────────────────────────────────

const FRAME_NORMAL_1: PixelFrame = [
  // Head (rows 0-6) - oversized, simple shape with outline
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  [".", "BL", "HR", "HR", "HR", "HR", "HR", "HR", "BL", "."],
  ["BL", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "BL"],
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],
  ["BL", "SK", "EY", "SK", "SK", "SK", "EY", "SK", "SK", "BL"],  // 1-pixel eyes
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],  // neutral mouth
  ["BL", "BL", "SK", "SK", "SK", "SK", "SK", "SK", "BL", "BL"],
  // Body (rows 7-11) - smaller, simple rectangle
  [".", "BL", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "BL", "."],
  [".", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "."],
  [".", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "."],
  [".", ".", "BL", "BL", "C_NORMAL", "C_NORMAL", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

const FRAME_NORMAL_2: PixelFrame = [
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  [".", "BL", "HR", "HR", "HR", "HR", "HR", "HR", "BL", "."],
  ["BL", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "BL"],
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],
  ["BL", "SK", "EY", "SK", "SK", "SK", "EY", "SK", "SK", "BL"],
  ["BL", "SK", "SK", "SK", "BL", "BL", "SK", "SK", "SK", "BL"],  // small smile
  ["BL", "BL", "SK", "SK", "SK", "SK", "SK", "SK", "BL", "BL"],
  [".", "BL", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "BL", "."],
  [".", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "."],
  [".", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "."],
  [".", ".", "BL", "BL", "C_NORMAL", "C_NORMAL", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

// ─────────────────────────────────────────────
//  GOOD STATE (Green body, bigger smile)
// ─────────────────────────────────────────────

const FRAME_GOOD_1: PixelFrame = [
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  [".", "BL", "HR", "HR", "HR", "HR", "HR", "HR", "BL", "."],
  ["BL", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "BL"],
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],
  ["BL", "SK", "EY", "SK", "SK", "SK", "EY", "SK", "SK", "BL"],
  ["BL", "SK", "SK", "SK", "BL", "BL", "SK", "SK", "SK", "BL"],  // smile
  ["BL", "BL", "SK", "SK", "SK", "SK", "SK", "SK", "BL", "BL"],
  [".", "BL", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "BL", "."],
  [".", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "."],
  [".", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "."],
  [".", ".", "BL", "BL", "C_GOOD", "C_GOOD", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

const FRAME_GOOD_2: PixelFrame = [
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  [".", "BL", "HR", "HR", "HR", "HR", "HR", "HR", "BL", "."],
  ["BL", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "BL"],
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],
  ["BL", "SK", "EY", "SK", "SK", "SK", "EY", "SK", "SK", "BL"],
  ["BL", "SK", "SK", "SK", "BL", "BL", "BL", "SK", "SK", "BL"],  // wider smile
  ["BL", "BL", "SK", "SK", "SK", "SK", "SK", "SK", "BL", "BL"],
  [".", "BL", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "BL", "."],
  [".", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "."],
  [".", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "."],
  [".", ".", "BL", "BL", "C_GOOD", "C_GOOD", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

// ─────────────────────────────────────────────
//  HAPPY STATE (Bright green, stars effect)
// ─────────────────────────────────────────────

const FRAME_HAPPY_1: PixelFrame = [
  ["ST", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "ST"],  // stars
  [".", "BL", "HR", "HR", "HR", "HR", "HR", "HR", "BL", "."],
  ["BL", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "BL"],
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],  // closed eyes (happy)
  ["BL", "SK", "SK", "BL", "BL", "BL", "BL", "SK", "SK", "BL"],  // big smile
  ["BL", "BL", "SK", "SK", "SK", "SK", "SK", "SK", "BL", "BL"],
  [".", "BL", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "BL", "."],
  [".", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "."],
  [".", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "."],
  [".", ".", "BL", "BL", "C_HAPPY", "C_HAPPY", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

const FRAME_HAPPY_2: PixelFrame = [
  [".", "ST", "BL", "BL", "BL", "BL", "BL", "BL", "ST", "."],
  [".", "BL", "HR", "HR", "HR", "HR", "HR", "HR", "BL", "."],
  ["BL", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "BL"],
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],
  ["BL", "SK", "SK", "BL", "BL", "BL", "BL", "SK", "SK", "BL"],
  ["BL", "BL", "SK", "SK", "SK", "SK", "SK", "SK", "BL", "BL"],
  [".", "BL", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "BL", "."],
  [".", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "."],
  [".", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "."],
  [".", ".", "BL", "BL", "C_HAPPY", "C_HAPPY", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

// ─────────────────────────────────────────────
//  OVERFLOW STATE (Purple body, water droplets)
// ─────────────────────────────────────────────

const FRAME_OVERFLOW_1: PixelFrame = [
  ["DR", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "DR"],  // droplets
  [".", "BL", "HR", "HR", "HR", "HR", "HR", "HR", "BL", "."],
  ["BL", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "BL"],
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],
  ["BL", "SK", "EY", "SK", "SK", "SK", "EY", "SK", "SK", "BL"],
  ["BL", "SK", "SK", "SK", "BL", "BL", "SK", "SK", "SK", "BL"],
  ["BL", "BL", "SK", "SK", "SK", "SK", "SK", "SK", "BL", "BL"],
  [".", "BL", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "BL", "."],
  [".", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "."],
  [".", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "."],
  [".", ".", "BL", "BL", "C_OVERFLOW", "C_OVERFLOW", "BL", "BL", ".", "."],
  [".", ".", "DR", "BL", "BL", "BL", "BL", "DR", ".", "."],  // droplets at bottom
];

const FRAME_OVERFLOW_2: PixelFrame = [
  [".", "DR", "BL", "BL", "BL", "BL", "BL", "BL", "DR", "."],
  [".", "BL", "HR", "HR", "HR", "HR", "HR", "HR", "BL", "."],
  ["BL", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "BL"],
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],
  ["BL", "SK", "EY", "SK", "SK", "SK", "EY", "SK", "SK", "BL"],
  ["BL", "SK", "SK", "SK", "BL", "BL", "BL", "SK", "SK", "BL"],  // wide smile
  ["BL", "BL", "SK", "SK", "SK", "SK", "SK", "SK", "BL", "BL"],
  [".", "BL", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "BL", "."],
  [".", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "."],
  [".", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "."],
  [".", ".", "BL", "BL", "C_OVERFLOW", "C_OVERFLOW", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

// ─────────────────────────────────────────────
//  DEHYDRATED STATE (Orange body, weak expression, sweat)
// ─────────────────────────────────────────────

const FRAME_DEHYDRATED_1: PixelFrame = [
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  [".", "BL", "HR", "HR", "HR", "HR", "HR", "HR", "BL", "."],
  ["BL", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "BL"],
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],
  ["BL", "SK", "SK", "BL", "SK", "SK", "BL", "SK", "SK", "BL"],  // horizontal eyes (tired)
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],
  ["BL", "BL", "SK", "SK", "SK", "SK", "SK", "SK", "BL", "BL"],
  [".", "BL", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "BL", "."],
  [".", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "."],
  [".", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "."],
  [".", ".", "BL", "BL", "C_WEAK", "C_WEAK", "BL", "BL", "SW", "."],  // sweat
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", "SW", "."],
];

const FRAME_DEHYDRATED_2: PixelFrame = [
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  [".", "BL", "HR", "HR", "HR", "HR", "HR", "HR", "BL", "."],
  ["BL", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "BL"],
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],
  ["BL", "SK", "SK", "BL", "SK", "SK", "BL", "SK", "SK", "BL"],
  ["BL", "SK", "SK", "SK", "BL", "BL", "SK", "SK", "SK", "BL"],  // wavy mouth
  ["BL", "BL", "SK", "SK", "SK", "SK", "SK", "SK", "BL", "BL"],
  [".", "BL", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "BL", "."],
  [".", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "."],
  [".", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "."],
  [".", ".", "BL", "BL", "C_WEAK", "C_WEAK", "BL", "BL", ".", "SW"],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "SW"],
];

// ─────────────────────────────────────────────
//  DYING STATE (Gray body, X eyes, smoke)
// ─────────────────────────────────────────────

const FRAME_DYING_1: PixelFrame = [
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  [".", "BL", "HR", "HR", "HR", "HR", "HR", "HR", "BL", "."],
  ["BL", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "BL"],
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],
  ["BL", "SK", "BL", "SK", "BL", "BL", "SK", "BL", "SK", "BL"],  // X eyes
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],  // flat mouth
  ["BL", "BL", "SK", "SK", "SK", "SK", "SK", "SK", "BL", "BL"],
  [".", "BL", "BL", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "BL", "BL", "."],
  [".", "BL", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "BL", "."],
  [".", "BL", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "BL", "."],
  [".", ".", "BL", "BL", "C_DYING", "C_DYING", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

const FRAME_DYING_2: PixelFrame = [
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  [".", "BL", "HR", "HR", "HR", "HR", "HR", "HR", "BL", "."],
  ["BL", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "HR", "BL"],
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],
  ["BL", "SK", "BL", "SK", "BL", "BL", "SK", "BL", "SK", "BL"],
  ["BL", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "SK", "BL"],
  ["BL", "BL", "SK", "SK", "SK", "SK", "SK", "SK", "BL", "BL"],
  [".", "BL", "BL", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "BL", "BL", "."],
  [".", "BL", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "BL", "."],
  [".", "BL", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "BL", "."],
  [".", ".", "BL", "BL", "C_DYING", "C_DYING", "BL", "BL", "ST", "."],  // smoke/star
  [".", ".", "ST", "BL", "BL", "BL", "BL", ".", ".", "."],
];

// ─────────────────────────────────────────────
//  Export Animation Configurations
// ─────────────────────────────────────────────

export const PET_ANIMATIONS: Record<PetState, AnimationConfig> = {
  dying: {
    frames: [FRAME_DYING_1, FRAME_DYING_2],
    interval: 800,
    loop: true,
  },
  dehydrated: {
    frames: [FRAME_DEHYDRATED_1, FRAME_DEHYDRATED_2],
    interval: 600,
    loop: true,
  },
  normal: {
    frames: [FRAME_NORMAL_1, FRAME_NORMAL_2],
    interval: 1000,
    loop: true,
  },
  good: {
    frames: [FRAME_GOOD_1, FRAME_GOOD_2],
    interval: 800,
    loop: true,
  },
  happy: {
    frames: [FRAME_HAPPY_1, FRAME_HAPPY_2],
    interval: 400,
    loop: true,
  },
  overflow: {
    frames: [FRAME_OVERFLOW_1, FRAME_OVERFLOW_2],
    interval: 400,
    loop: true,
  },
};
