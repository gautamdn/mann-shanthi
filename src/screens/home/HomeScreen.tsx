import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { useUserStore } from '../../store/userStore';
import { useMoodLog } from '../../hooks/useMoodLog';
import { MoodSelector } from '../../components/home/MoodSelector';
import { FeatureCard } from '../../components/home/FeatureCard';
import type { MainTabParamList } from '../../navigation/types';

type HomeNav = BottomTabNavigationProp<MainTabParamList, 'Home'>;

const FEATURES = [
  { key: 'Breathe' as const, title: 'Breathe', subtitle: 'Calm your mind', color: colors.primary },
  { key: 'Ground' as const, title: 'Ground', subtitle: '5-4-3-2-1 senses', color: colors.accentGreen },
  { key: 'Journal' as const, title: 'Journal', subtitle: 'Write it out', color: colors.accentAmber },
  { key: 'Affirm' as const, title: 'Affirm', subtitle: 'Daily wisdom', color: colors.accentPink },
];

export default function HomeScreen() {
  const userName = useUserStore((state) => state.userName);
  const streak = useUserStore((state) => state.streak);
  const { todayMood, logMood } = useMoodLog();
  const navigation = useNavigation<HomeNav>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.greeting}>Namaste, {userName} 🙏</Text>

        <MoodSelector selectedMood={todayMood} onSelectMood={logMood} />

        {streak > 0 && (
          <View style={styles.streakCard}>
            <Text style={styles.streakText}>🔥 {streak}-day streak</Text>
            <Text style={styles.streakSubtext}>Keep showing up for yourself!</Text>
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
          <Text style={styles.sosTitle}>Feeling overwhelmed?</Text>
          <Text style={styles.sosSubtext}>Tap here to breathe and calm down</Text>
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
  greeting: {
    ...typography.heading,
    fontSize: 26,
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
    backgroundColor: colors.errorLight,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.errorBorder,
    padding: spacing.lg,
  },
  sosTitle: {
    ...typography.bodyMedium,
    color: colors.error,
    marginBottom: spacing.xs,
  },
  sosSubtext: {
    ...typography.caption,
    color: colors.error,
  },
});
