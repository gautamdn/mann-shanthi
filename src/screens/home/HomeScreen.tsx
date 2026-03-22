import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { useUserStore } from '../../store/userStore';
import { useMoodLog } from '../../hooks/useMoodLog';
import { getGreeting } from '../../utils/dateUtils';
import type { MainTabParamList } from '../../navigation/types';

type HomeNav = BottomTabNavigationProp<MainTabParamList, 'Home'>;

const MOODS = [
  { value: 1 as const, emoji: '😫', label: 'Rough' },
  { value: 2 as const, emoji: '😔', label: 'Low' },
  { value: 3 as const, emoji: '😐', label: 'Okay' },
  { value: 4 as const, emoji: '🙂', label: 'Good' },
  { value: 5 as const, emoji: '😊', label: 'Great' },
];

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>
        {getGreeting()}, {userName} 👋
      </Text>

      {streak > 0 && (
        <Text style={styles.streak}>🔥 {streak} day streak</Text>
      )}

      <View style={styles.moodCard}>
        <Text style={styles.moodTitle}>How are you feeling today?</Text>
        <View style={styles.moodRow}>
          {MOODS.map((mood) => (
            <TouchableOpacity
              key={mood.value}
              style={[
                styles.moodButton,
                todayMood === mood.value && styles.moodButtonActive,
              ]}
              onPress={() => logMood(mood.value)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.featureGrid}>
        {FEATURES.map((feature) => (
          <TouchableOpacity
            key={feature.key}
            style={styles.featureCard}
            onPress={() => navigation.navigate(feature.key)}
          >
            <View style={[styles.featureDot, { backgroundColor: feature.color }]} />
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  greeting: {
    ...typography.heading,
    fontSize: 26,
    marginBottom: spacing.xs,
  },
  streak: {
    ...typography.caption,
    fontSize: 14,
    marginBottom: spacing.lg,
  },
  moodCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  moodTitle: {
    ...typography.bodyMedium,
    marginBottom: spacing.md,
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodButton: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.input,
  },
  moodButtonActive: {
    backgroundColor: colors.background,
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  moodLabel: {
    ...typography.caption,
    fontSize: 12,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  featureCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    width: '47%',
  },
  featureDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: spacing.sm,
  },
  featureTitle: {
    ...typography.bodyMedium,
    marginBottom: spacing.xs,
  },
  featureSubtitle: {
    ...typography.caption,
  },
});
