// 装饰品定义
export interface Decoration {
  id: string;
  name: string;
  category: "hat" | "trail" | "aura" | "outfit" | "accessory";
  emoji: string;
  description: string;
  requiredDays: number;
}

// 所有可解锁的装饰品
export const DECORATIONS: Decoration[] = [
  // 帽子系列
  {
    id: "hat_cap",
    name: "棒球帽",
    category: "hat",
    emoji: "🧢",
    description: "运动风格的棒球帽",
    requiredDays: 3,
  },
  {
    id: "hat_party",
    name: "派对帽",
    category: "hat",
    emoji: "🎉",
    description: "欢乐的派对帽",
    requiredDays: 7,
  },
  {
    id: "hat_crown",
    name: "皇冠",
    category: "hat",
    emoji: "👑",
    description: "皇室的象征",
    requiredDays: 14,
  },
  {
    id: "hat_wizard",
    name: "巫师帽",
    category: "hat",
    emoji: "🧙",
    description: "神秘魔法帽",
    requiredDays: 21,
  },
  {
    id: "hat_santa",
    name: "圣诞帽",
    category: "hat",
    emoji: "🎅",
    description: "节日氛围帽",
    requiredDays: 28,
  },

  // 特效系列
  {
    id: "trail_stars",
    name: "星星轨迹",
    category: "trail",
    emoji: "✨",
    description: "闪烁的星星特效",
    requiredDays: 5,
  },
  {
    id: "trail_sparkle",
    name: "闪光轨迹",
    category: "trail",
    emoji: "💫",
    description: "梦幻闪光效果",
    requiredDays: 10,
  },
  {
    id: "trail_heart",
    name: "爱心轨迹",
    category: "trail",
    emoji: "💕",
    description: "飘落的爱心",
    requiredDays: 15,
  },

  // 光环系列
  {
    id: "aura_rainbow",
    name: "彩虹光环",
    category: "aura",
    emoji: "🌈",
    description: "美丽的彩虹光环",
    requiredDays: 30,
  },
  {
    id: "aura_angel",
    name: "天使光环",
    category: "aura",
    emoji: "😇",
    description: "神圣的天使光环",
    requiredDays: 45,
  },
  {
    id: "aura_cosmic",
    name: "宇宙光环",
    category: "aura",
    emoji: "🌌",
    description: "神秘的宇宙能量",
    requiredDays: 60,
  },

  // 服装系列
  {
    id: "outfit_scarf",
    name: "围巾",
    category: "outfit",
    emoji: "🧣",
    description: "温暖舒适的围巾",
    requiredDays: 7,
  },
  {
    id: "outfit_cape",
    name: "披风",
    category: "outfit",
    emoji: "🦸",
    description: "英雄的披风",
    requiredDays: 14,
  },
  {
    id: "outfit_wings",
    name: "翅膀",
    category: "outfit",
    emoji: "🦋",
    description: "梦幻的蝴蝶翅膀",
    requiredDays: 28,
  },

  // 配件系列
  {
    id: "accessory_glasses",
    name: "太阳镜",
    category: "accessory",
    emoji: "🕶️",
    description: "酷炫太阳镜",
    requiredDays: 10,
  },
  {
    id: "accessory_earrings",
    name: "耳环",
    category: "accessory",
    emoji: "💎",
    description: "闪耀的钻石耳环",
    requiredDays: 20,
  },
  {
    id: "accessory_necklace",
    name: "项链",
    category: "accessory",
    emoji: "📿",
    description: "珍贵的项链",
    requiredDays: 35,
  },
];

// 根据 ID 获取装饰品信息
export const getDecorationById = (id: string): Decoration | undefined => {
  return DECORATIONS.find((d) => d.id === id);
};

// 获取某个类别的装饰品
export const getDecorationsByCategory = (
  category: Decoration["category"]
): Decoration[] => {
  return DECORATIONS.filter((d) => d.category === category);
};

// 获取下一个可解锁的装饰品
export const getNextUnlock = (currentStreak: number): Decoration | undefined => {
  const sorted = DECORATIONS.filter((d) => d.requiredDays > currentStreak).sort(
    (a, b) => a.requiredDays - b.requiredDays
  );
  return sorted[0];
};

// 获取已解锁的装饰品（按类别分组）
export const getUnlockedDecorations = (
  unlockedIds: string[]
): Record<Decoration["category"], Decoration[]> => {
  const result: Record<Decoration["category"], Decoration[]> = {
    hat: [],
    trail: [],
    aura: [],
    outfit: [],
    accessory: [],
  };

  unlockedIds.forEach((id) => {
    const decoration = getDecorationById(id);
    if (decoration) {
      result[decoration.category].push(decoration);
    }
  });

  return result;
};

// 计算解锁进度
export const getUnlockProgress = (
  currentStreak: number
): { next: Decoration | undefined; progress: number } => {
  const next = getNextUnlock(currentStreak);
  if (!next) return { next: undefined, progress: 100 };

  const prevDays =
    DECORATIONS.filter((d) => d.requiredDays < next.requiredDays)
      .sort((a, b) => b.requiredDays - a.requiredDays)[0]?.requiredDays || 0;

  const progress =
    ((currentStreak - prevDays) / (next.requiredDays - prevDays)) * 100;

  return { next, progress: Math.min(100, Math.max(0, progress)) };
};
