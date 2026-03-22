import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const MOODS = [
  { value: 1 as const, emoji: '😰', label: 'Anxious' },
  { value: 2 as const, emoji: '😔', label: 'Low' },
  { value: 3 as const, emoji: '😐', label: 'Okay' },
  { value: 4 as const, emoji: '🙂', label: 'Good' },
  { value: 5 as const, emoji: '😊', label: 'Great' },
] as const;

type MoodValue = 1 | 2 | 3 | 4 | 5;

interface MoodSelectorProps {
  selectedMood: MoodValue | null;
  onSelectMood: (value: MoodValue) => void;
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMood,
  onSelectMood,
}) => {
  const handleSelect = (value: MoodValue) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onSelectMood(value);
  };

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradient}
    >
      <Text style={styles.title}>How are you feeling today?</Text>
      <View style={styles.row}>
        {MOODS.map((mood) => (
          <TouchableOpacity
            key={mood.value}
            style={[
              styles.button,
              selectedMood === mood.value && styles.buttonActive,
            ]}
            onPress={() => handleSelect(mood.value)}
          >
            <Text style={styles.emoji}>{mood.emoji}</Text>
            <Text style={styles.label}>{mood.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.bodyMedium,
    color: colors.textLight,
    marginBottom: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    alignItems: 'center',
    padding: spacing.sm,
    borderRadius: borderRadius.input,
  },
  buttonActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  emoji: {
    fontSize: 28,
    marginBottom: spacing.xs,
  },
  label: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textLight,
  },
});
