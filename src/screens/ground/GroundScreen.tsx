import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { Card } from '../../components/common/Card';
import { PillButton } from '../../components/common/PillButton';

interface GroundingStep {
  count: number;
  sense: string;
  prompt: string;
}

const GROUNDING_STEPS: GroundingStep[] = [
  { count: 5, sense: 'SEE', prompt: '5 things you can see' },
  { count: 4, sense: 'TOUCH', prompt: '4 things you can touch' },
  { count: 3, sense: 'HEAR', prompt: '3 things you can hear' },
  { count: 2, sense: 'SMELL', prompt: '2 things you can smell' },
  { count: 1, sense: 'TASTE', prompt: '1 thing you can taste' },
];

export default function GroundScreen() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [responses, setResponses] = useState<string[][]>(
    GROUNDING_STEPS.map((step) => Array(step.count).fill(''))
  );

  const isStepComplete = (stepIndex: number): boolean => {
    return responses[stepIndex].every((r) => r.trim().length > 0);
  };

  const allComplete = GROUNDING_STEPS.every((_, i) => isStepComplete(i));

  const handleToggleStep = (index: number) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExpandedStep(expandedStep === index ? null : index);
  };

  const handleResponseChange = (stepIndex: number, inputIndex: number, value: string) => {
    const newResponses = [...responses];
    newResponses[stepIndex] = [...newResponses[stepIndex]];
    newResponses[stepIndex][inputIndex] = value;
    setResponses(newResponses);
  };

  const handleReset = () => {
    setExpandedStep(null);
    setResponses(GROUNDING_STEPS.map((s) => Array(s.count).fill('')));
  };

  if (allComplete) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.completeContainer}>
          <Text style={styles.completeTitle}>Well done.</Text>
          <Text style={styles.completeBody}>
            Take a moment to notice how you feel. You've reconnected with the present moment.
          </Text>
          <PillButton
            label="Do it again"
            onPress={handleReset}
            color={colors.accentGreen}
            style={styles.resetButton}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Ground Yourself</Text>
        <Text style={styles.intro}>
          Use your senses to anchor yourself in the present moment. Tap each step and name what you notice around you.
        </Text>

        {GROUNDING_STEPS.map((step, index) => {
          const isExpanded = expandedStep === index;
          const complete = isStepComplete(index);

          return (
            <View key={step.sense}>
              <TouchableOpacity
                style={[
                  styles.stepHeader,
                  complete && styles.stepHeaderComplete,
                ]}
                onPress={() => handleToggleStep(index)}
              >
                <View style={styles.stepHeaderLeft}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{step.count}</Text>
                  </View>
                  <View>
                    <Text style={styles.stepSense}>{step.sense}</Text>
                    <Text style={styles.stepPrompt}>{step.prompt}</Text>
                  </View>
                </View>
                {complete ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : (
                  <Text style={styles.chevron}>{isExpanded ? '▲' : '▼'}</Text>
                )}
              </TouchableOpacity>

              {isExpanded && (
                <Card style={styles.inputCard}>
                  {Array.from({ length: step.count }).map((_, inputIndex) => (
                    <TextInput
                      key={inputIndex}
                      style={styles.input}
                      placeholder={`${step.sense.charAt(0)}${step.sense.slice(1).toLowerCase()} #${inputIndex + 1}`}
                      placeholderTextColor={colors.textMuted}
                      value={responses[index][inputIndex]}
                      onChangeText={(value) => handleResponseChange(index, inputIndex, value)}
                    />
                  ))}
                </Card>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.heading,
    marginBottom: spacing.sm,
  },
  intro: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    marginBottom: spacing.sm,
  },
  stepHeaderComplete: {
    borderColor: colors.accentGreen,
    borderLeftWidth: 4,
    borderLeftColor: colors.accentGreen,
  },
  stepHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  stepNumber: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 16,
    color: colors.textLight,
  },
  stepSense: {
    ...typography.bodyMedium,
  },
  stepPrompt: {
    ...typography.caption,
  },
  checkmark: {
    fontSize: 18,
    color: colors.accentGreen,
    fontFamily: 'Inter_700Bold',
  },
  chevron: {
    fontSize: 12,
    color: colors.textMuted,
  },
  inputCard: {
    marginBottom: spacing.sm,
    marginTop: -spacing.xs,
  },
  input: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: borderRadius.input,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...typography.body,
  },
  completeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
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
    paddingHorizontal: spacing.xl,
  },
});
