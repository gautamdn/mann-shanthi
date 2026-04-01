import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { RootNavigator } from './src/navigation/RootNavigator';
import { useUserStore } from './src/store/userStore';
import { useAuthStore } from './src/store/authStore';
import { migrateStorageKeys } from './src/utils/storage';
import { supabase } from './src/lib/supabase';
import { colors } from './src/theme/colors';

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const hydrate = useUserStore((state) => state.hydrate);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    async function prepare() {
      // 1. Restore auth session from Supabase's persisted token
      await useAuthStore.getState().restoreSession();
      // 2. Migrate storage keys (from Mann Shanthi → Antara rename)
      await migrateStorageKeys();
      // 3. Hydrate user store (includes remote sync if authenticated)
      await hydrate();
      setAppReady(true);
    }
    prepare();
  }, [hydrate]);

  // Listen for auth state changes (sign out, token refresh, etc.)
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: { user: { id: string; email?: string | null } } | null) => {
        if (session?.user) {
          useAuthStore.getState().setSession(
            session.user.id,
            session.user.email ?? '',
          );
        } else {
          useAuthStore.getState().clearSession();
        }
      },
    );
    return () => subscription.unsubscribe();
  }, []);

  if (!fontsLoaded || !appReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <NavigationContainer>
          <RootNavigator />
          <StatusBar style="dark" />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  loading: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
