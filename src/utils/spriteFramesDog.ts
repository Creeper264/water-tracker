import { Palette, PixelFrame, AnimationConfig, PetState } from "../types";

// 8-BIT DOG PALETTE (Limited colors with black outline)
export const DOG_PALETTE: Palette = {
  BL: "#000000",  // Black outline (ESSENTIAL!)
  FC: "#A85828",  // Fur color (brown dog)
  FL: "#E8D0B0", // Light fur (belly)
  PK: "#E85858", // Pink tongue
  BK: "#201810", // Dark nose
  EY: "#000000", // Eyes (black)
  WH: "#FFFFFF", // White highlight

  // State colors
  C_DYING: "#787878",
  C_WEAK: "#E8A030",
  C_NORMAL: "#A85828",
  C_GOOD: "#50C878",
  C_HAPPY: "#70E090",
  C_OVERFLOW: "#B078D8",

  // Effects
  ST: "#F8D830",
  SW: "#A04040",
  DR: "#B078D8",

  ".": null,
};

// DOG NORMAL STATE
const DOG_NORMAL_1: PixelFrame = [
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],  // floppy ears
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "EY", "FC", "FC", "FC", "EY", "FC", "FC", "BL"],  // eyes
  ["BL", "FL", "FL", "FC", "BK", "FC", "FC", "FL", "FL", "BL"],  // nose
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "BL", "."],
  [".", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "."],
  [".", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "."],
  [".", ".", "BL", "BL", "C_NORMAL", "C_NORMAL", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

const DOG_NORMAL_2: PixelFrame = [
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "EY", "FC", "FC", "FC", "EY", "FC", "FC", "BL"],
  ["BL", "FL", "FL", "FL", "BK", "FL", "FL", "FL", "FL", "BL"],  // small mouth
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "BL", "."],
  [".", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "."],
  [".", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "."],
  [".", ".", "BL", "BL", "C_NORMAL", "C_NORMAL", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

// DOG GOOD STATE (tail wag implied)
const DOG_GOOD_1: PixelFrame = [
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],  // closed eyes
  ["BL", "FL", "FL", "FL", "BK", "BL", "BL", "FL", "FL", "BL"],  // smile
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "BL", "."],
  [".", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "."],
  [".", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "."],
  [".", ".", "BL", "BL", "C_GOOD", "C_GOOD", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

const DOG_GOOD_2: PixelFrame = [
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FL", "FL", "FL", "BK", "BL", "BL", "FL", "FL", "BL"],
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "BL", "."],
  [".", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "."],
  [".", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "."],
  [".", ".", "BL", "BL", "C_GOOD", "C_GOOD", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

// DOG HAPPY STATE (tongue out)
const DOG_HAPPY_1: PixelFrame = [
  ["ST", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "ST"],  // stars
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],  // closed eyes
  ["BL", "FL", "FL", "FL", "BK", "BL", "BL", "PK", "PK", "BL"],  // tongue
  ["BL", "BL", "FL", "FL", "FL", "PK", "PK", "PK", "BL", "BL"],
  [".", "BL", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "BL", "."],
  [".", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "."],
  [".", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "."],
  [".", ".", "BL", "BL", "C_HAPPY", "C_HAPPY", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

const DOG_HAPPY_2: PixelFrame = [
  [".", "ST", "BL", "BL", "BL", "BL", "BL", "BL", "ST", "."],
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FL", "FL", "FL", "BK", "BL", "PK", "PK", "PK", "BL"],
  ["BL", "BL", "FL", "FL", "PK", "PK", "PK", "PK", "BL", "BL"],
  [".", "BL", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "BL", "."],
  [".", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "."],
  [".", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "."],
  [".", ".", "BL", "BL", "C_HAPPY", "C_HAPPY", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

// DOG OVERFLOW STATE
const DOG_OVERFLOW_1: PixelFrame = [
  ["DR", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "DR"],
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "EY", "FC", "FC", "FC", "EY", "FC", "FC", "BL"],
  ["BL", "FL", "FL", "FL", "BK", "BL", "BL", "PK", "PK", "BL"],
  ["BL", "BL", "FL", "FL", "PK", "PK", "PK", "PK", "BL", "BL"],
  [".", "BL", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "BL", "."],
  [".", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "."],
  [".", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "."],
  [".", ".", "BL", "BL", "C_OVERFLOW", "C_OVERFLOW", "BL", "BL", ".", "DR"],
  [".", ".", "DR", "BL", "BL", "BL", "BL", "DR", ".", "."],
];

const DOG_OVERFLOW_2: PixelFrame = [
  [".", "DR", "BL", "BL", "BL", "BL", "BL", "BL", "DR", "."],
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "EY", "FC", "FC", "FC", "EY", "FC", "FC", "BL"],
  ["BL", "FL", "FL", "FL", "BK", "BL", "PK", "PK", "PK", "BL"],
  ["BL", "BL", "FL", "FL", "PK", "PK", "PK", "PK", "BL", "BL"],
  [".", "BL", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "BL", "."],
  [".", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "."],
  [".", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "."],
  [".", ".", "BL", "BL", "C_OVERFLOW", "C_OVERFLOW", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", "DR", "."],
];

// DOG DEHYDRATED STATE
const DOG_DEHYDRATED_1: PixelFrame = [
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "BL", "FC", "FC", "BL", "FC", "FC", "BL"],  // tired eyes
  ["BL", "FL", "FL", "FL", "BK", "FC", "FC", "FL", "FL", "BL"],
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "BL", "."],
  [".", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "."],
  [".", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "."],
  [".", ".", "BL", "BL", "C_WEAK", "C_WEAK", "BL", "BL", "SW", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", "SW", "."],
];

const DOG_DEHYDRATED_2: PixelFrame = [
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "BL", "FC", "FC", "BL", "FC", "FC", "BL"],
  ["BL", "FL", "FL", "FL", "BK", "BL", "FL", "FL", "FL", "BL"],  // wavy mouth
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "BL", "."],
  [".", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "."],
  [".", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "."],
  [".", ".", "BL", "BL", "C_WEAK", "C_WEAK", "BL", "BL", ".", "SW"],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "SW"],
];

// DOG DYING STATE
const DOG_DYING_1: PixelFrame = [
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "BL", "FC", "BL", "BL", "FC", "BL", "FC", "BL"],  // X eyes
  ["BL", "FL", "FL", "FL", "FL", "FL", "FL", "FL", "FL", "BL"],  // flat mouth
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "BL", "BL", "."],
  [".", "BL", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "BL", "."],
  [".", "BL", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "BL", "."],
  [".", ".", "BL", "BL", "C_DYING", "C_DYING", "BL", "BL", ".", "."],
  [".", ".", "ST", "BL", "BL", "BL", "BL", ".", ".", "."],  // smoke
];

const DOG_DYING_2: PixelFrame = [
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "BL", "FC", "BL", "BL", "FC", "BL", "FC", "BL"],
  ["BL", "FL", "FL", "FL", "FL", "FL", "FL", "FL", "FL", "BL"],
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "BL", "BL", "."],
  [".", "BL", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "BL", "."],
  [".", "BL", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "C_DYING", "BL", "."],
  [".", ".", "BL", "BL", "C_DYING", "C_DYING", "BL", "BL", "ST", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", "ST", "."],
];

// Export
export const DOG_ANIMATIONS: Record<PetState, AnimationConfig> = {
  dying: { frames: [DOG_DYING_1, DOG_DYING_2], interval: 800, loop: true },
  dehydrated: { frames: [DOG_DEHYDRATED_1, DOG_DEHYDRATED_2], interval: 600, loop: true },
  normal: { frames: [DOG_NORMAL_1, DOG_NORMAL_2], interval: 1000, loop: true },
  good: { frames: [DOG_GOOD_1, DOG_GOOD_2], interval: 800, loop: true },
  happy: { frames: [DOG_HAPPY_1, DOG_HAPPY_2], interval: 400, loop: true },
  overflow: { frames: [DOG_OVERFLOW_1, DOG_OVERFLOW_2], interval: 400, loop: true },
};