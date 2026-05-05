import { Palette, PixelFrame, AnimationConfig, PetState } from "../types";

// 8-BIT CAT PALETTE (Limited colors with black outline)
export const CAT_PALETTE: Palette = {
  BL: "#000000",  // Black outline (ESSENTIAL!)
  FC: "#F8A848",  // Fur color (orange cat)
  FL: "#FFE8D0", // Light fur (belly)
  PK: "#FFB0C0", // Pink (nose, ears)
  EY: "#000000", // Eyes (black)
  WH: "#FFFFFF", // White highlight

  // State colors
  C_DYING: "#787878",
  C_WEAK: "#E8A030",
  C_NORMAL: "#F8A848",
  C_GOOD: "#50C878",
  C_HAPPY: "#70E090",
  C_OVERFLOW: "#B078D8",

  // Effects
  ST: "#F8D830",
  SW: "#A04040",
  DR: "#B078D8",

  ".": null,
};

// CAT NORMAL STATE
const CAT_NORMAL_1: PixelFrame = [
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],  // ears
  ["BL", "FC", "PK", "FC", "FC", "FC", "FC", "PK", "FC", "BL"],  // head with pink ears
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "EY", "FC", "FC", "FC", "EY", "FC", "FC", "BL"],  // eyes
  ["BL", "FL", "FL", "FC", "PK", "FC", "FC", "FL", "FL", "BL"],  // nose
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "BL", "."],
  [".", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "."],
  [".", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "."],
  [".", ".", "BL", "BL", "C_NORMAL", "C_NORMAL", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

const CAT_NORMAL_2: PixelFrame = [
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  ["BL", "FC", "PK", "FC", "FC", "FC", "FC", "PK", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "EY", "FC", "FC", "FC", "EY", "FC", "FC", "BL"],
  ["BL", "FL", "FL", "FC", "PK", "BL", "FL", "FL", "FL", "BL"],  // small mouth
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "BL", "."],
  [".", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "."],
  [".", "BL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "C_NORMAL", "BL", "."],
  [".", ".", "BL", "BL", "C_NORMAL", "C_NORMAL", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

// CAT GOOD STATE
const CAT_GOOD_1: PixelFrame = [
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  ["BL", "FC", "PK", "FC", "FC", "FC", "FC", "PK", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],  // closed eyes
  ["BL", "FL", "FL", "FL", "PK", "BL", "BL", "FL", "FL", "BL"],  // smile
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "BL", "."],
  [".", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "."],
  [".", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "."],
  [".", ".", "BL", "BL", "C_GOOD", "C_GOOD", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

const CAT_GOOD_2: PixelFrame = [
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  ["BL", "FC", "PK", "FC", "FC", "FC", "FC", "PK", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FL", "FL", "FL", "PK", "BL", "BL", "FL", "FL", "BL"],
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "BL", "."],
  [".", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "."],
  [".", "BL", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "C_GOOD", "BL", "."],
  [".", ".", "BL", "BL", "C_GOOD", "C_GOOD", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

// CAT HAPPY STATE
const CAT_HAPPY_1: PixelFrame = [
  ["ST", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "ST"],
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  ["BL", "FC", "PK", "FC", "FC", "FC", "FC", "PK", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],  // closed eyes
  ["BL", "FL", "FL", "FL", "PK", "BL", "BL", "BL", "FL", "BL"],  // big smile
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "BL", "."],
  [".", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "."],
  [".", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "."],
  [".", ".", "BL", "BL", "C_HAPPY", "C_HAPPY", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

const CAT_HAPPY_2: PixelFrame = [
  [".", "ST", "BL", "BL", "BL", "BL", "BL", "BL", "ST", "."],
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  ["BL", "FC", "PK", "FC", "FC", "FC", "FC", "PK", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FL", "FL", "FL", "PK", "BL", "BL", "FL", "FL", "BL"],
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "BL", "."],
  [".", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "."],
  [".", "BL", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "C_HAPPY", "BL", "."],
  [".", ".", "BL", "BL", "C_HAPPY", "C_HAPPY", "BL", "BL", ".", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "."],
];

// CAT OVERFLOW STATE
const CAT_OVERFLOW_1: PixelFrame = [
  ["DR", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "DR"],
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  ["BL", "FC", "PK", "FC", "FC", "FC", "FC", "PK", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "EY", "FC", "FC", "FC", "EY", "FC", "FC", "BL"],
  ["BL", "FL", "FL", "FL", "PK", "BL", "BL", "BL", "FL", "BL"],
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "BL", "."],
  [".", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "."],
  [".", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "."],
  [".", ".", "BL", "BL", "C_OVERFLOW", "C_OVERFLOW", "BL", "BL", ".", "."],
  [".", ".", "DR", "BL", "BL", "BL", "BL", "DR", ".", "."],
];

const CAT_OVERFLOW_2: PixelFrame = [
  [".", "DR", "BL", "BL", "BL", "BL", "BL", "BL", "DR", "."],
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  ["BL", "FC", "PK", "FC", "FC", "FC", "FC", "PK", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "EY", "FC", "FC", "FC", "EY", "FC", "FC", "BL"],
  ["BL", "FL", "FL", "FL", "PK", "BL", "BL", "FL", "FL", "BL"],
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "BL", "."],
  [".", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "."],
  [".", "BL", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "C_OVERFLOW", "BL", "."],
  [".", ".", "BL", "BL", "C_OVERFLOW", "C_OVERFLOW", "BL", "BL", ".", "DR"],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", "DR", "."],
];

// CAT DEHYDRATED STATE
const CAT_DEHYDRATED_1: PixelFrame = [
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  ["BL", "FC", "PK", "FC", "FC", "FC", "FC", "PK", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "BL", "FC", "FC", "BL", "FC", "FC", "BL"],  // tired eyes
  ["BL", "FL", "FL", "FC", "PK", "FC", "FC", "FL", "FL", "BL"],
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "BL", "."],
  [".", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "."],
  [".", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "."],
  [".", ".", "BL", "BL", "C_WEAK", "C_WEAK", "BL", "BL", "SW", "."],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", "SW", "."],
];

const CAT_DEHYDRATED_2: PixelFrame = [
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  ["BL", "FC", "PK", "FC", "FC", "FC", "FC", "PK", "FC", "BL"],
  ["BL", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "FC", "BL"],
  ["BL", "FC", "FC", "BL", "FC", "FC", "BL", "FC", "FC", "BL"],
  ["BL", "FL", "FL", "FC", "PK", "BL", "FL", "FL", "FL", "BL"],  // wavy mouth
  ["BL", "BL", "FL", "FL", "FL", "FL", "FL", "FL", "BL", "BL"],
  [".", "BL", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "BL", "."],
  [".", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "."],
  [".", "BL", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "C_WEAK", "BL", "."],
  [".", ".", "BL", "BL", "C_WEAK", "C_WEAK", "BL", "BL", ".", "SW"],
  [".", ".", ".", "BL", "BL", "BL", "BL", ".", ".", "SW"],
];

// CAT DYING STATE
const CAT_DYING_1: PixelFrame = [
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  ["BL", "FC", "PK", "FC", "FC", "FC", "FC", "PK", "FC", "BL"],
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

const CAT_DYING_2: PixelFrame = [
  [".", ".", "BL", "BL", "BL", "BL", "BL", "BL", ".", "."],
  [".", "BL", "FC", "FC", ".", ".", "FC", "FC", "BL", "."],
  ["BL", "FC", "PK", "FC", "FC", "FC", "FC", "PK", "FC", "BL"],
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
export const CAT_ANIMATIONS: Record<PetState, AnimationConfig> = {
  dying: { frames: [CAT_DYING_1, CAT_DYING_2], interval: 800, loop: true },
  dehydrated: { frames: [CAT_DEHYDRATED_1, CAT_DEHYDRATED_2], interval: 600, loop: true },
  normal: { frames: [CAT_NORMAL_1, CAT_NORMAL_2], interval: 1000, loop: true },
  good: { frames: [CAT_GOOD_1, CAT_GOOD_2], interval: 800, loop: true },
  happy: { frames: [CAT_HAPPY_1, CAT_HAPPY_2], interval: 400, loop: true },
  overflow: { frames: [CAT_OVERFLOW_1, CAT_OVERFLOW_2], interval: 400, loop: true },
};
