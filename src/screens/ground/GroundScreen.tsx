import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface GroundingStep {
  count: number;
  sense: string;
  prompt: string;
}

const GROUNDING_STEPS: GroundingStep[] = [
  { count: 5, sense: 'See', prompt: 'Name 5 things you can see right now' },
  { count: 4, sense: 'Touch', prompt: 'Name 4 things you can touch' },
  { count: 3, sense: 'Hear', prompt: 'Name 3 things you can hear' },
  { count: 2, sense: 'Smell', prompt: 'Name 2 things you can smell' },
  { count: 1, sense: 'Taste', prompt: 'Name 1 thing you can taste' },
];

export default function GroundScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<string[][]>(
    GROUNDING_STEPS.map((step) => Array(step.count).fill(''))
  );
  const [isComplete, setIsComplete] = useState(false);

  const step = GROUNDING_STEPS[currentStep];

  const handleResponseChange = (index: number, value: string) => {
    const newResponses = [...responses];
    newResponses[currentStep] = [...newResponses[currentStep]];
    newResponses[currentStep][index] = value;
    setResponses(newResponses);
  };

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (currentStep < GROUNDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsComplete(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setResponses(GROUNDING_STEPS.map((s) => Array(s.count).fill('')));
    setIsComplete(false);
  };

  if (isComplete) {
    return (
      <View style={styles.container}>
        <View style={styles.completeContainer}>
          <Text style={styles.completeEmoji}>🌿</Text>
          <Text style={styles.completeTitle}>You did it!</Text>
          <Text style={styles.completeBody}>
            Take a moment to notice how you feel. You've reconnected with the present moment.
          </Text>
          <TouchableOpacity style={styles.resetButton} onPress={handleReset}>
            <Text style={styles.resetButtonText}>Do it again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Ground Yourself</Text>

      <View style={styles.progressRow}>
        {GROUNDING_STEPS.map((_, index) => (
          <View
            key={index}
            style={[
              styles.progressDot,
              index === currentStep && styles.progressDotActive,
              index < currentStep && styles.progressDotDone,
            ]}
          />
        ))}
      </View>

      <View style={styles.stepCard}>
        <Text style={styles.stepCount}>{step.count}</Text>
        <Text style={styles.stepSense}>things you can {step.sense.toLowerCase()}</Text>
        <Text style={styles.stepPrompt}>{step.prompt}</Text>

        {Array.from({ length: step.count }).map((_, index) => (
          <TextInput
            key={index}
            style={styles.input}
            placeholder={`${step.sense} #${index + 1}`}
            placeholderTextColor={colors.textMuted}
            value={responses[currentStep][index]}
            onChangeText={(value) => handleResponseChange(index, value)}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>
          {currentStep < GROUNDING_STEPS.length - 1 ? 'Next' : 'Done'}
        </Text>
      </TouchableOpacity>
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
  title: {
    ...typography.heading,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  progressDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.cardBorder,
  },
  progressDotActive: {
    backgroundColor: colors.accentGreen,
    width: 24,
    borderRadius: 5,
  },
  progressDotDone: {
    backgroundColor: colors.accentGreen,
  },
  stepCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  stepCount: {
    fontSize: 48,
    fontFamily: 'Inter_700Bold',
    color: colors.accentGreen,
    marginBottom: spacing.xs,
  },
  stepSense: {
    ...typography.bodyMedium,
    marginBottom: spacing.sm,
  },
  stepPrompt: {
    ...typography.caption,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  input: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.input,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...typography.body,
  },
  nextButton: {
    backgroundColor: colors.accentGreen,
    borderRadius: borderRadius.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  nextButtonText: {
    ...typography.button,
  },
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  completeEmoji: {
    fontSize: 64,
    marginBottom: spacing.lg,
  },
  completeTitle: {
    ...typography.heading,
    marginBottom: spacing.md,
  },
  completeBody: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textMuted,
    marginBottom: spacing.xl,
  },
  resetButton: {
    backgroundColor: colors.accentGreen,
    borderRadius: borderRadius.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
  resetButtonText: {
    ...typography.button,
  },
});
