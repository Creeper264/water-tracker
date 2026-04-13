import * as Haptics from 'expo-haptics';

/**
 * 振动反馈工具类
 * 使用 expo-haptics 提供触觉反馈
 */
export const HapticsService = {
  /**
   * 轻触反馈（用于按钮点击等轻量级交互）
   */
  light: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch (error) {
      // 静默失败，不影响用户体验
      console.warn('Haptics.light failed:', error);
    }
  },

  /**
   * 中等强度反馈（用于重要操作）
   */
  medium: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch (error) {
      console.warn('Haptics.medium failed:', error);
    }
  },

  /**
   * 重度反馈（用于关键操作）
   */
  heavy: async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    } catch (error) {
      console.warn('Haptics.heavy failed:', error);
    }
  },

  /**
   * 成功反馈（用于目标完成等成功场景）
   */
  success: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.warn('Haptics.success failed:', error);
    }
  },

  /**
   * 错误反馈（用于操作失败等错误场景）
   */
  error: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } catch (error) {
      console.warn('Haptics.error failed:', error);
    }
  },

  /**
   * 警告反馈（用于提醒用户注意）
   */
  warning: async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    } catch (error) {
      console.warn('Haptics.warning failed:', error);
    }
  },
};
