import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { useUserStore } from '../../store/userStore';
import { useAuthStore } from '../../store/authStore';
import { useMoodLog } from '../../hooks/useMoodLog';
import { MoodSelector } from '../../components/home/MoodSelector';
import { FeatureCard } from '../../components/home/FeatureCard';
import type { MainTabParamList } from '../../navigation/types';

type HomeNav = BottomTabNavigationProp<MainTabParamList, 'Home'>;

const FEATURES = [
  { key: 'Breathe' as const, title: 'Breathe', subtitle: 'Guided breathing', color: colors.primary },
  { key: 'Ground' as const, title: 'Ground', subtitle: 'Sensory grounding', color: colors.primary },
  { key: 'Journal' as const, title: 'Journal', subtitle: 'Reflective journaling', color: colors.primary },
  { key: 'Affirm' as const, title: 'Affirm', subtitle: 'Daily affirmations', color: colors.primary },
];

export default function HomeScreen() {
  const userName = useUserStore((state) => state.userName);
  const streak = useUserStore((state) => state.streak);
  const clearUserData = useUserStore((state) => state.clearUserData);
  const { isAuthenticated, email, signOut } = useAuthStore();
  const { todayMood, logMood } = useMoodLog();
  const navigation = useNavigation<HomeNav>();

  const handleSignOut = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    await signOut();
    await clearUserData();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.greeting}>Namaste, {userName}</Text>
          {isAuthenticated && (
            <TouchableOpacity onPress={handleSignOut} style={styles.signOutButton}>
              <Text style={styles.signOutText}>Sign out</Text>
            </TouchableOpacity>
          )}
        </View>

        {isAuthenticated && email && (
          <Text style={styles.emailText}>{email}</Text>
        )}

        <MoodSelector selectedMood={todayMood} onSelectMood={logMood} />

        {streak > 0 && (
          <View style={styles.streakCard}>
            <Text style={styles.streakText}>{streak}-day streak</Text>
            <Text style={styles.streakSubtext}>You are showing up for yourself.</Text>
          </View>
        )}

        <View style={styles.featureGrid}>
          {FEATURES.map((feature) => (
            <FeatureCard
              key={feature.key}
              title={feature.title}
              subtitle={feature.subtitle}
              color={feature.color}
              onPress={() => navigation.navigate(feature.key)}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.sosCard}
          onPress={() => navigation.navigate('Breathe')}
        >
          <Text style={styles.sosTitle}>Need a moment?</Text>
          <Text style={styles.sosSubtext}>Take a breath and return to yourself.</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  greeting: {
    ...typography.heading,
    fontSize: 26,
    flex: 1,
  },
  signOutButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.pill,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    backgroundColor: colors.card,
  },
  signOutText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  emailText: {
    ...typography.caption,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  streakCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.accentAmber,
  },
  streakText: {
    ...typography.bodyMedium,
    marginBottom: spacing.xs,
  },
  streakSubtext: {
    ...typography.caption,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  sosCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  sosTitle: {
    ...typography.bodyMedium,
    marginBottom: spacing.xs,
  },
  sosSubtext: {
    ...typography.caption,
  },
});
