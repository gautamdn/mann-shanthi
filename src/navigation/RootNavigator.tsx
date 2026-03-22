import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useUserStore } from '../store/userStore';
import OnboardingFlow from '../screens/onboarding/OnboardingFlow';
import { MainTabNavigator } from './MainTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const hasOnboarded = useUserStore((state) => state.hasOnboarded);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {hasOnboarded ? (
        <Stack.Screen name="MainTabs" component={MainTabNavigator} />
      ) : (
        <Stack.Screen name="Onboarding" component={OnboardingFlow} />
      )}
    </Stack.Navigator>
  );
}
