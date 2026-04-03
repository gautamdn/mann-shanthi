import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import HomeScreen from '../screens/home/HomeScreen';
import BreatheScreen from '../screens/breathe/BreatheScreen';
import GroundScreen from '../screens/ground/GroundScreen';
import JournalScreen from '../screens/journal/JournalScreen';
import AffirmScreen from '../screens/affirm/AffirmScreen';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

const TAB_ICONS: Record<keyof MainTabParamList, React.ComponentProps<typeof Feather>['name']> = {
  Home: 'home',
  Breathe: 'wind',
  Ground: 'layers',
  Journal: 'book-open',
  Affirm: 'heart',
};

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ color, size }) => (
          <Feather name={TAB_ICONS[route.name]} size={size} color={color} />
        ),
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Breathe" component={BreatheScreen} />
      <Tab.Screen name="Ground" component={GroundScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Affirm" component={AffirmScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.card,
    borderTopColor: colors.cardBorder,
    paddingTop: spacing.xs,
    height: 85,
  },
  tabLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
  },
});
