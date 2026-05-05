import * as Updates from 'expo-updates';
import { Alert, Platform } from 'react-native';
import { t } from './i18n';

/**
 * 检查是否有可用更新
 */
export async function checkForUpdate(): Promise<boolean> {
  if (__DEV__ || Platform.OS === 'web') {
    console.log('[Updates] 开发模式或 Web 平台，跳过更新检查');
    return false;
  }

  try {
    const update = await Updates.checkForUpdateAsync();
    console.log('[Updates] 检查结果:', update.isAvailable ? '有更新' : '已是最新');
    return update.isAvailable;
  } catch (error) {
    console.error('[Updates] 检查更新失败:', error);
    return false;
  }
}

/**
 * 下载更新
 */
export async function downloadUpdate(): Promise<boolean> {
  if (__DEV__ || Platform.OS === 'web') {
    return false;
  }

  try {
    const result = await Updates.fetchUpdateAsync();
    console.log('[Updates] 下载结果:', result.isNew ? '成功' : '无新更新');
    return result.isNew;
  } catch (error) {
    console.error('[Updates] 下载更新失败:', error);
    return false;
  }
}

/**
 * 应用更新（重启应用）
 */
export async function applyUpdate(): Promise<void> {
  if (__DEV__ || Platform.OS === 'web') {
    return;
  }

  try {
    await Updates.reloadAsync();
  } catch (error) {
    console.error('[Updates] 应用更新失败:', error);
  }
}

/**
 * 检查并提示用户更新
 */
export async function checkAndPromptUpdate(
  showNoUpdateAlert: boolean = false
): Promise<void> {
  if (__DEV__ || Platform.OS === 'web') {
    if (showNoUpdateAlert) {
      Alert.alert(t('updates.devMode'), t('updates.devModeHint'));
    }
    return;
  }

  try {
    const hasUpdate = await checkForUpdate();

    if (hasUpdate) {
      Alert.alert(
        t('updates.found'),
        t('updates.foundMessage'),
        [
          {
            text: t('updates.later'),
            style: 'cancel',
          },
          {
            text: t('updates.update'),
            onPress: async () => {
              const downloaded = await downloadUpdate();
              if (downloaded) {
                Alert.alert(
                  t('updates.downloaded'),
                  t('updates.downloadedMessage'),
                  [
                    { text: t('updates.later'), style: 'cancel' },
                    { text: t('updates.restart'), onPress: applyUpdate },
                  ]
                );
              } else {
                Alert.alert(t('updates.failed'), t('updates.failedMessage'));
              }
            },
          },
        ]
      );
    } else if (showNoUpdateAlert) {
      Alert.alert(t('updates.latest'), t('updates.latestMessage'));
    }
  } catch (error) {
    console.error('[Updates] 更新检查出错:', error);
    if (showNoUpdateAlert) {
      Alert.alert(t('updates.error'), t('updates.errorMessage'));
    }
  }
}

/**
 * 静默更新（后台下载，下次启动应用）
 */
export async function silentUpdate(): Promise<void> {
  if (__DEV__ || Platform.OS === 'web') {
    return;
  }

  try {
    const hasUpdate = await checkForUpdate();
    if (hasUpdate) {
      await downloadUpdate();
      console.log('[Updates] 更新已下载，将在下次启动时应用');
    }
  } catch (error) {
    console.error('[Updates] 静默更新失败:', error);
  }
}

/**
 * 获取当前更新信息
 */
export function getUpdateInfo() {
  return {
    updateId: Updates.updateId,
    channel: Updates.channel,
    runtimeVersion: Updates.runtimeVersion,
    isEmbeddedLaunch: Updates.isEmbeddedLaunch,
    isEmergencyLaunch: Updates.isEmergencyLaunch,
  };
}
