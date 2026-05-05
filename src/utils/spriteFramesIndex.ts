import { PetState, PetType, AnimationConfig } from "../types";
import { PET_ANIMATIONS, PALETTE } from "./spriteFrames";
import { CAT_ANIMATIONS, CAT_PALETTE } from "./spriteFramesCat";
import { DOG_ANIMATIONS, DOG_PALETTE } from "./spriteFramesDog";

// ─────────────────────────────────────────────
//  根据宠物类型获取动画配置
// ─────────────────────────────────────────────

export const getAnimationsByType = (petType: PetType): Record<PetState, AnimationConfig> => {
  switch (petType) {
    case 'cat':
      return CAT_ANIMATIONS;
    case 'dog':
      return DOG_ANIMATIONS;
    case 'human':
    default:
      return PET_ANIMATIONS;
  }
};

// ─────────────────────────────────────────────
//  根据宠物类型获取调色盘
// ─────────────────────────────────────────────

export const getPaletteByType = (petType: PetType) => {
  switch (petType) {
    case 'cat':
      return CAT_PALETTE;
    case 'dog':
      return DOG_PALETTE;
    case 'human':
    default:
      return PALETTE;
  }
};

// ─────────────────────────────────────────────
//  宠物类型显示名称
// ─────────────────────────────────────────────

export const PET_TYPE_NAMES: Record<PetType, { en: string; zh: string; emoji: string }> = {
  human: { en: "Human", zh: "小人", emoji: "🧑" },
  cat: { en: "Cat", zh: "小猫", emoji: "🐱" },
  dog: { en: "Dog", zh: "小狗", emoji: "🐕" },
};
