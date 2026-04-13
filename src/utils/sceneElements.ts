import { PixelFrame, Palette } from "../types";

export const SCENE_PALETTE: Palette = {
  // 窗户
  WF: "#5a5a7a", // 窗框
  WG: "#4FC3F7", // 窗户玻璃
  WL: "#7dd8fc", // 窗户反光
  WD: "#2a4a6a", // 天空深色
  WU: "#4a6a8a", // 天空浅色
  WC: "#e8e8f0", // 云朵
  
  // 绿植
  PL: "#2ed573", // 叶子
  PD: "#1e9c56", // 叶子深色
  PT: "#a0522d", // 花盆
  PK: "#8b4513", // 花盆深色
  
  // 杯子
  CB: "#4FC3F7", // 杯子主体
  CD: "#3da8d6", // 杯子深色
  CW: "#ffffff", // 杯子高光
  
  // 电脑
  CM: "#2d2d44", // 显示器
  CS: "#4FC3F7", // 屏幕
  CK: "#1a1a2e", // 键盘
  CL: "#3d3d5c", // 键盘高光
  
  // 画框
  FB: "#2d2d44", // 画框边框
  FI: "#4FC3F7", // 画框内容
  FH: "#2ed573", // 画框高亮
  
  // 通用
  BG: "#1a1a2e", // 背景
  CR: "#2d2d44", // 卡片
  AC: "#4FC3F7", // 强调色
  
  ".": null, // 透明
};

// 窗户帧 - 白天
export const WINDOW_DAY: PixelFrame = [
  ['.', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', '.'],
  ['WF', 'WU', 'WU', 'WU', 'WU', 'WU', 'WU', 'WF', 'WU', 'WU', 'WU', 'WU', 'WU', 'WU', 'WF'],
  ['WF', 'WU', 'WC', 'WC', 'WC', 'WU', 'WU', 'WF', 'WU', 'WU', 'WC', 'WC', 'WU', 'WU', 'WF'],
  ['WF', 'WU', 'WU', 'WC', 'WU', 'WU', 'WU', 'WF', 'WU', 'WU', 'WU', 'WU', 'WU', 'WU', 'WF'],
  ['WF', 'WU', 'WU', 'WU', 'WU', 'WU', 'WU', 'WF', 'WU', 'WC', 'WC', 'WU', 'WU', 'WU', 'WF'],
  ['WF', 'WU', 'WL', 'WU', 'WU', 'WU', 'WU', 'WF', 'WU', 'WU', 'WU', 'WU', 'WU', 'WU', 'WF'],
  ['WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF'],
  ['WF', 'WU', 'WU', 'WU', 'WU', 'WU', 'WU', 'WF', 'WU', 'WU', 'WU', 'WU', 'WU', 'WU', 'WF'],
  ['WF', 'WU', 'WU', 'WU', 'WL', 'WU', 'WU', 'WF', 'WU', 'WU', 'WU', 'WU', 'WU', 'WU', 'WF'],
  ['WF', 'WU', 'WU', 'WU', 'WU', 'WU', 'WU', 'WF', 'WU', 'WU', 'WL', 'WU', 'WU', 'WU', 'WF'],
  ['.', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', '.'],
];

// 窗户帧 - 黑夜
export const WINDOW_NIGHT: PixelFrame = [
  ['.', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', '.'],
  ['WF', 'WD', 'WD', 'WD', 'WD', 'WD', 'WD', 'WF', 'WD', 'WD', 'WD', 'WD', 'WD', 'WD', 'WF'],
  ['WF', 'WD', 'WC', 'WC', 'WD', 'WD', 'WD', 'WF', 'WD', 'WD', 'WC', 'WC', 'WD', 'WD', 'WF'],
  ['WF', 'WD', 'WD', 'WC', 'WD', 'WD', 'WD', 'WF', 'WD', 'WD', 'WD', 'WD', 'WD', 'WD', 'WF'],
  ['WF', 'WD', 'WD', 'WD', 'WD', 'WD', 'WD', 'WF', 'WD', 'WC', 'WC', 'WD', 'WD', 'WD', 'WF'],
  ['WF', 'WD', 'WL', 'WD', 'WD', 'WD', 'WD', 'WF', 'WD', 'WD', 'WD', 'WD', 'WD', 'WD', 'WF'],
  ['WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF'],
  ['WF', 'WD', 'WD', 'WD', 'WD', 'WD', 'WD', 'WF', 'WD', 'WD', 'WD', 'WD', 'WD', 'WD', 'WF'],
  ['WF', 'WD', 'WD', 'WD', 'WL', 'WD', 'WD', 'WF', 'WD', 'WD', 'WD', 'WD', 'WD', 'WD', 'WF'],
  ['WF', 'WD', 'WD', 'WD', 'WD', 'WD', 'WD', 'WF', 'WD', 'WD', 'WL', 'WD', 'WD', 'WD', 'WF'],
  ['.', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', 'WF', '.'],
];

// 绿植帧 - 正常
export const PLANT_NORMAL: PixelFrame = [
  ['.', '.', '.', 'PL', 'PL', 'PL', '.', '.', '.'],
  ['.', '.', 'PL', 'PL', 'PL', 'PL', 'PL', '.', '.'],
  ['.', 'PL', 'PL', 'PD', 'PL', 'PD', 'PL', 'PL', '.'],
  ['.', '.', 'PL', 'PL', 'PL', 'PL', 'PL', '.', '.'],
  ['.', '.', '.', 'PD', 'PL', 'PD', '.', '.', '.'],
  ['.', '.', '.', '.', 'PD', '.', '.', '.', '.'],
  ['.', '.', 'PT', 'PT', 'PT', 'PT', 'PT', '.', '.'],
  ['.', 'PT', 'PT', 'PT', 'PT', 'PT', 'PT', 'PT', '.'],
  ['.', 'PT', 'PK', 'PK', 'PK', 'PK', 'PK', 'PT', '.'],
  ['.', 'PT', 'PK', 'PK', 'PK', 'PK', 'PK', 'PT', '.'],
  ['.', '.', 'PK', 'PK', 'PK', 'PK', 'PK', '.', '.'],
];

// 绿植帧 - 生长
export const PLANT_GROW_1: PixelFrame = [
  ['.', '.', '.', '.', 'PL', '.', '.', '.', '.'],
  ['.', '.', '.', 'PL', 'PL', 'PL', '.', '.', '.'],
  ['.', '.', 'PL', 'PL', 'PL', 'PL', 'PL', '.', '.'],
  ['.', '.', '.', 'PD', 'PL', 'PD', '.', '.', '.'],
  ['.', '.', '.', '.', 'PD', '.', '.', '.', '.'],
  ['.', '.', 'PT', 'PT', 'PT', 'PT', 'PT', '.', '.'],
  ['.', 'PT', 'PT', 'PT', 'PT', 'PT', 'PT', 'PT', '.'],
  ['.', 'PT', 'PK', 'PK', 'PK', 'PK', 'PK', 'PT', '.'],
  ['.', '.', 'PK', 'PK', 'PK', 'PK', 'PK', '.', '.'],
];

export const PLANT_GROW_2: PixelFrame = [
  ['.', '.', '.', 'PL', 'PL', 'PL', '.', '.', '.'],
  ['.', '.', 'PL', 'PL', 'PL', 'PL', 'PL', '.', '.'],
  ['.', 'PL', 'PL', 'PD', 'PL', 'PD', 'PL', 'PL', '.'],
  ['.', '.', 'PL', 'PL', 'PL', 'PL', 'PL', '.', '.'],
  ['.', '.', '.', 'PD', 'PL', 'PD', '.', '.', '.'],
  ['.', '.', '.', '.', 'PD', '.', '.', '.', '.'],
  ['.', '.', 'PT', 'PT', 'PT', 'PT', 'PT', '.', '.'],
  ['.', 'PT', 'PT', 'PT', 'PT', 'PT', 'PT', 'PT', '.'],
  ['.', 'PT', 'PK', 'PK', 'PK', 'PK', 'PK', 'PT', '.'],
  ['.', '.', 'PK', 'PK', 'PK', 'PK', 'PK', '.', '.'],
];

export const PLANT_GROW_3: PixelFrame = [
  ['.', '.', 'PL', 'PL', 'PL', 'PL', 'PL', '.', '.'],
  ['.', 'PL', 'PL', 'PD', 'PL', 'PD', 'PL', 'PL', '.'],
  ['PL', 'PL', 'PL', 'PL', 'PL', 'PL', 'PL', 'PL', 'PL'],
  ['.', 'PL', 'PL', 'PD', 'PL', 'PD', 'PL', 'PL', '.'],
  ['.', '.', 'PL', 'PL', 'PL', 'PL', 'PL', '.', '.'],
  ['.', '.', '.', 'PD', 'PL', 'PD', '.', '.', '.'],
  ['.', '.', '.', '.', 'PD', '.', '.', '.', '.'],
  ['.', '.', 'PT', 'PT', 'PT', 'PT', 'PT', '.', '.'],
  ['.', 'PT', 'PT', 'PT', 'PT', 'PT', 'PT', 'PT', '.'],
  ['.', 'PT', 'PK', 'PK', 'PK', 'PK', 'PK', 'PT', '.'],
  ['.', '.', 'PK', 'PK', 'PK', 'PK', 'PK', '.', '.'],
];

// 杯子帧 - 正常
export const CUP_NORMAL: PixelFrame = [
  ['.', '.', 'CW', 'CW', 'CW', '.', '.'],
  ['.', 'CW', 'CB', 'CB', 'CB', 'CW', '.'],
  ['.', 'CB', 'CB', 'CB', 'CB', 'CB', '.'],
  ['.', 'CB', 'CD', 'CB', 'CD', 'CB', '.', 'CB'],
  ['.', 'CB', 'CB', 'CB', 'CB', 'CB', '.', 'CB'],
  ['.', '.', 'CB', 'CB', 'CB', '.', '.', '.'],
];

// 杯子帧 - 喝水
export const CUP_DRINK_1: PixelFrame = [
  ['.', '.', 'CW', 'CW', '.', '.', '.'],
  ['.', 'CW', 'CB', 'CB', 'CW', '.', '.'],
  ['.', 'CB', 'CB', 'CB', 'CB', 'CB', '.'],
  ['.', 'CB', 'CD', 'CB', 'CD', 'CB', '.', 'CB'],
  ['.', 'CB', 'CB', 'CB', 'CB', 'CB', '.', 'CB'],
  ['.', '.', 'CB', 'CB', 'CB', '.', '.', '.'],
];

export const CUP_DRINK_2: PixelFrame = [
  ['.', '.', '.', '.', '.', '.', '.'],
  ['.', '.', 'CW', 'CW', '.', '.', '.'],
  ['.', 'CW', 'CB', 'CB', 'CW', '.', '.'],
  ['.', 'CB', 'CD', 'CB', 'CD', 'CB', '.', 'CB'],
  ['.', 'CB', 'CB', 'CB', 'CB', 'CB', '.', 'CB'],
  ['.', '.', 'CB', 'CB', 'CB', '.', '.', '.'],
];

// 电脑帧 - 正常
export const COMPUTER_NORMAL: PixelFrame = [
  ['.', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', '.'],
  ['CM', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CM'],
  ['CM', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CM'],
  ['CM', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CM'],
  ['CM', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CM'],
  ['CM', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CM'],
  ['CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM'],
  ['.', '.', '.', '.', 'CM', 'CM', 'CM', '.', '.', '.', '.'],
  ['.', '.', '.', '.', 'CM', 'CM', 'CM', '.', '.', '.', '.'],
  ['.', '.', 'CK', 'CK', 'CK', 'CK', 'CK', 'CK', 'CK', '.', '.'],
  ['.', 'CK', 'CL', 'CK', 'CL', 'CK', 'CL', 'CK', 'CL', 'CK', '.'],
];

// 电脑帧 - 工作（屏幕闪烁）
export const COMPUTER_WORK_1: PixelFrame = [
  ['.', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', '.'],
  ['CM', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CM'],
  ['CM', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CM'],
  ['CM', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CM'],
  ['CM', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CM'],
  ['CM', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CM'],
  ['CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM'],
  ['.', '.', '.', '.', 'CM', 'CM', 'CM', '.', '.', '.', '.'],
  ['.', '.', '.', '.', 'CM', 'CM', 'CM', '.', '.', '.', '.'],
  ['.', '.', 'CK', 'CK', 'CK', 'CK', 'CK', 'CK', 'CK', '.', '.'],
  ['.', 'CK', 'CL', 'CK', 'CL', 'CK', 'CL', 'CK', 'CL', 'CK', '.'],
];

export const COMPUTER_WORK_2: PixelFrame = [
  ['.', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', '.'],
  ['CM', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CM'],
  ['CM', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CM'],
  ['CM', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CM'],
  ['CM', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CM'],
  ['CM', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CS', 'CM'],
  ['CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM', 'CM'],
  ['.', '.', '.', '.', 'CM', 'CM', 'CM', '.', '.', '.', '.'],
  ['.', '.', '.', '.', 'CM', 'CM', 'CM', '.', '.', '.', '.'],
  ['.', '.', 'CK', 'CK', 'CK', 'CK', 'CK', 'CK', 'CK', '.', '.'],
  ['.', 'CK', 'CL', 'CK', 'CL', 'CK', 'CL', 'CK', 'CL', 'CK', '.'],
];

// 画框帧 - 不同内容
export const FRAME_1: PixelFrame = [
  ['FB', 'FB', 'FB', 'FB', 'FB', 'FB', 'FB', 'FB'],
  ['FB', 'FI', 'FI', 'FI', 'FI', 'FI', 'FI', 'FB'],
  ['FB', 'FI', 'FH', 'FI', 'FI', 'FH', 'FI', 'FB'],
  ['FB', 'FI', 'FI', 'FH', 'FH', 'FI', 'FI', 'FB'],
  ['FB', 'FI', 'FI', 'FH', 'FH', 'FI', 'FI', 'FB'],
  ['FB', 'FI', 'FH', 'FI', 'FI', 'FH', 'FI', 'FB'],
  ['FB', 'FI', 'FI', 'FI', 'FI', 'FI', 'FI', 'FB'],
  ['FB', 'FB', 'FB', 'FB', 'FB', 'FB', 'FB', 'FB'],
];

export const FRAME_2: PixelFrame = [
  ['FB', 'FB', 'FB', 'FB', 'FB', 'FB', 'FB', 'FB'],
  ['FB', 'FI', 'FI', 'FI', 'FI', 'FI', 'FI', 'FB'],
  ['FB', 'FI', 'FI', 'FI', 'FH', 'FI', 'FI', 'FB'],
  ['FB', 'FI', 'FI', 'FH', 'FH', 'FH', 'FI', 'FB'],
  ['FB', 'FI', 'FH', 'FH', 'FH', 'FI', 'FI', 'FB'],
  ['FB', 'FI', 'FI', 'FH', 'FI', 'FI', 'FI', 'FB'],
  ['FB', 'FI', 'FI', 'FI', 'FI', 'FI', 'FI', 'FB'],
  ['FB', 'FB', 'FB', 'FB', 'FB', 'FB', 'FB', 'FB'],
];

export const FRAME_3: PixelFrame = [
  ['FB', 'FB', 'FB', 'FB', 'FB', 'FB', 'FB', 'FB'],
  ['FB', 'FI', 'FI', 'FH', 'FH', 'FI', 'FI', 'FB'],
  ['FB', 'FI', 'FH', 'FI', 'FI', 'FH', 'FI', 'FB'],
  ['FB', 'FH', 'FI', 'FI', 'FI', 'FI', 'FH', 'FB'],
  ['FB', 'FH', 'FI', 'FI', 'FI', 'FI', 'FH', 'FB'],
  ['FB', 'FI', 'FH', 'FI', 'FI', 'FH', 'FI', 'FB'],
  ['FB', 'FI', 'FI', 'FH', 'FH', 'FI', 'FI', 'FB'],
  ['FB', 'FB', 'FB', 'FB', 'FB', 'FB', 'FB', 'FB'],
];

// 场景元素动画配置
export const SCENE_ANIMATIONS = {
  window: {
    frames: [WINDOW_DAY, WINDOW_NIGHT],
    interval: 0, // 手动切换
    loop: false,
  },
  plant: {
    frames: [PLANT_NORMAL],
    interval: 0,
    loop: false,
  },
  plantGrow: {
    frames: [PLANT_GROW_1, PLANT_GROW_2, PLANT_GROW_3, PLANT_NORMAL],
    interval: 300,
    loop: false,
  },
  cup: {
    frames: [CUP_NORMAL],
    interval: 0,
    loop: false,
  },
  cupDrink: {
    frames: [CUP_NORMAL, CUP_DRINK_1, CUP_DRINK_2, CUP_DRINK_1, CUP_NORMAL],
    interval: 200,
    loop: false,
  },
  computer: {
    frames: [COMPUTER_NORMAL],
    interval: 0,
    loop: false,
  },
  computerWork: {
    frames: [COMPUTER_WORK_1, COMPUTER_WORK_2],
    interval: 500,
    loop: true,
  },
  frame: {
    frames: [FRAME_1, FRAME_2, FRAME_3],
    interval: 0,
    loop: false,
  },
};

// 场景元素位置配置
export const SCENE_ELEMENT_POSITIONS = {
  window: { x: 0.35, y: 0.08 },
  plant: { x: 0.02, y: 0.35 },
  cup: { x: 0.18, y: 0.3 },
  computer: { x: 0.5, y: 0.28 },
  frame: { x: 0.75, y: 0.12 },
};
