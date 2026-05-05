import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import HomeScreen from './screens/HomeScreen';
import StatsScreen from './screens/StatsScreen';
import SettingsScreen from './screens/SettingsScreen';
import PetScreen from './screens/PetScreen';
import { useWaterTracker } from './hooks/useWaterTracker';
import { getStreakData } from './utils/storage';
import { StreakData } from './types';
import { ThemeProvider } from './contexts/ThemeContext';
import { setLocale, useLocale, t } from './utils/i18n';

const Tab = createBottomTabNavigator();

function HomeIcon({ focused }: { focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.iconText, focused && styles.iconTextActive]}>H2O</Text>
    </View>
  );
}

function StatsIcon({ focused }: { focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.iconText, focused && styles.iconTextActive]}>#</Text>
    </View>
  );
}

function SettingsIcon({ focused }: { focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.iconText, focused && styles.iconTextActive]}>*</Text>
    </View>
  );
}

function PetIcon({ focused }: { focused: boolean }) {
  return (
    <View style={styles.iconContainer}>
      <Text style={[styles.iconText, focused && styles.iconTextActive]}>💧</Text>
    </View>
  );
}

export default function App() {
  const { todayLog, settings, loading, addWater, removeEntry, updateSettings, refresh } = useWaterTracker();
  const [streakData, setStreakData] = useState<StreakData | null>(null);
  useLocale(); // re-render on language change

  // Apply user's language preference whenever settings load/change
  useEffect(() => {
    if (settings?.language) {
      setLocale(settings.language);
    }
  }, [settings?.language]);

  useEffect(() => {
    const loadStreak = async () => {
      const data = await getStreakData();
      setStreakData(data);
    };
    loadStreak();
  }, [todayLog]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('app.loading')}</Text>
      </View>
    );
  }

  return (
    <ThemeProvider>
      <NavigationContainer>
        <StatusBar style="light" />
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: '#4FC3F7',
            tabBarInactiveTintColor: '#8b8b8b',
            headerStyle: styles.header,
            headerTitleStyle: styles.headerTitle,
          }}
        >
          <Tab.Screen
            name="Home"
            options={{
              tabBarIcon: HomeIcon,
              tabBarLabel: t('tab.home'),
              headerTitle: t('header.home'),
            }}
          >
            {() => (
              <HomeScreen
                todayLog={todayLog}
                settings={settings}
                onAddWater={addWater}
                onRemoveEntry={removeEntry}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Pet"
            options={{
              tabBarIcon: PetIcon,
              tabBarLabel: t('tab.pet'),
              headerTitle: t('header.pet'),
            }}
          >
            {() => (
              <PetScreen
                streakData={streakData}
                todayLog={todayLog}
                settings={settings}
              />
            )}
          </Tab.Screen>
          <Tab.Screen
            name="Stats"
            options={{
              tabBarIcon: StatsIcon,
              tabBarLabel: t('tab.stats'),
              headerTitle: t('header.stats'),
            }}
          >
            {() => <StatsScreen settings={settings} />}
          </Tab.Screen>
          <Tab.Screen
            name="Settings"
            options={{
              tabBarIcon: SettingsIcon,
              tabBarLabel: t('tab.settings'),
              headerTitle: t('header.settings'),
            }}
          >
            {() => (
              <SettingsScreen
                settings={settings}
                onUpdateSettings={updateSettings}
              />
            )}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
  },
  loadingText: {
    color: '#4FC3F7',
    fontSize: 18,
  },
  tabBar: {
    backgroundColor: '#2d2d44',
    borderTopColor: '#3d3d54',
    borderTopWidth: 1,
  },
  header: {
    backgroundColor: '#1a1a2e',
  },
  headerTitle: {
    color: '#4FC3F7',
    fontSize: 20,
    fontWeight: 'bold',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 18,
    color: '#8b8b8b',
  },
  iconTextActive: {
    color: '#4FC3F7',
  },
});
