import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

const MOODS = [
  { value: 1 as const, label: 'Anxious' },
  { value: 2 as const, label: 'Low' },
  { value: 3 as const, label: 'Okay' },
  { value: 4 as const, label: 'Good' },
  { value: 5 as const, label: 'Great' },
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
    <View style={styles.container}>
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
            <View style={[styles.circle, selectedMood === mood.value && styles.circleActive]}>
              <Text style={[styles.circleText, selectedMood === mood.value && styles.circleTextActive]}>
                {mood.value}
              </Text>
            </View>
            <Text style={[styles.label, selectedMood === mood.value && styles.labelActive]}>
              {mood.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary,
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
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  circleActive: {
    backgroundColor: colors.textLight,
    borderColor: colors.textLight,
  },
  circleText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: colors.textLight,
  },
  circleTextActive: {
    color: colors.primary,
  },
  label: {
    ...typography.caption,
    fontSize: 12,
    color: colors.textLight,
  },
  labelActive: {
    fontFamily: 'Inter_600SemiBold',
  },
});
