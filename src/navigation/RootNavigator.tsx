import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useUserStore } from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import AuthScreen from '../screens/auth/AuthScreen';
import OnboardingFlow from '../screens/onboarding/OnboardingFlow';
import InviteCodeScreen from '../screens/settings/InviteCodeScreen';
import { MainTabNavigator } from './MainTabNavigator';
import { TherapistTabNavigator } from './TherapistTabNavigator';
import type { RootStackParamList } from './types';

const Stack = createStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const hasOnboarded = useUserStore((state) => state.hasOnboarded);
  const hasSkippedAuth = useUserStore((state) => state.hasSkippedAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const role = useAuthStore((state) => state.role);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isAuthenticated && !hasSkippedAuth ? (
        <Stack.Screen name="Auth" component={AuthScreen} />
      ) : !hasOnboarded ? (
        <Stack.Screen name="Onboarding" component={OnboardingFlow} />
      ) : role === 'therapist' ? (
        <>
          <Stack.Screen name="TherapistTabs" component={TherapistTabNavigator} />
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabNavigator} />
          <Stack.Screen
            name="InviteCode"
            component={InviteCodeScreen}
            options={{ presentation: 'modal' }}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
