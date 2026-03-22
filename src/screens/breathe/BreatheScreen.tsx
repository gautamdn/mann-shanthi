import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { breathingTechniques, BreathingTechnique } from '../../content/breathingTechniques';

export default function BreatheScreen() {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>(breathingTechniques[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);

  const circleScale = useSharedValue(0.5);
  const currentStep = selectedTechnique.steps[currentStepIndex];

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: circleScale.value }],
  }));

  const runStep = useCallback(() => {
    if (!isActive) return;

    const step = selectedTechnique.steps[currentStepIndex];
    const isInhale = step.label.includes('In');
    const isExhale = step.label.includes('Out');

    if (isInhale) {
      circleScale.value = withTiming(1, {
        duration: step.duration * 1000,
        easing: Easing.inOut(Easing.ease),
      });
    } else if (isExhale) {
      circleScale.value = withTiming(0.5, {
        duration: step.duration * 1000,
        easing: Easing.inOut(Easing.ease),
      });
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [isActive, currentStepIndex, selectedTechnique, circleScale]);

  useEffect(() => {
    if (!isActive) return;

    runStep();

    const timeout = setTimeout(() => {
      const nextStepIndex = currentStepIndex + 1;
      if (nextStepIndex < selectedTechnique.steps.length) {
        setCurrentStepIndex(nextStepIndex);
      } else {
        const nextRound = currentRound + 1;
        if (nextRound < selectedTechnique.rounds) {
          setCurrentRound(nextRound);
          setCurrentStepIndex(0);
        } else {
          setIsActive(false);
          setCurrentStepIndex(0);
          setCurrentRound(0);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    }, currentStep.duration * 1000);

    return () => clearTimeout(timeout);
  }, [isActive, currentStepIndex, currentRound, runStep, currentStep.duration, selectedTechnique]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentStepIndex(0);
    setCurrentRound(0);
    circleScale.value = 0.5;
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setCurrentRound(0);
    circleScale.value = withTiming(0.5, { duration: 300 });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Breathe</Text>

      {!isActive && (
        <View style={styles.techniqueRow}>
          {breathingTechniques.map((technique) => (
            <TouchableOpacity
              key={technique.id}
              style={[
                styles.techniquePill,
                selectedTechnique.id === technique.id && styles.techniquePillActive,
              ]}
              onPress={() => setSelectedTechnique(technique)}
            >
              <Text
                style={[
                  styles.techniquePillText,
                  selectedTechnique.id === technique.id && styles.techniquePillTextActive,
                ]}
              >
                {technique.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.circleContainer}>
        <Animated.View style={[styles.circle, animatedCircleStyle]} />
        <Text style={styles.stepLabel}>
          {isActive ? currentStep.label : selectedTechnique.description}
        </Text>
        {isActive && (
          <Text style={styles.roundLabel}>
            Round {currentRound + 1} of {selectedTechnique.rounds}
          </Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.actionButton, isActive && styles.stopButton]}
        onPress={isActive ? handleStop : handleStart}
      >
        <Text style={styles.actionButtonText}>
          {isActive ? 'Stop' : 'Start'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  title: {
    ...typography.heading,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  techniqueRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
    marginBottom: spacing.xl,
  },
  techniquePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  techniquePillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  techniquePillText: {
    ...typography.caption,
    color: colors.text,
  },
  techniquePillTextActive: {
    color: colors.textLight,
  },
  circleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.primary,
    opacity: 0.3,
    marginBottom: spacing.lg,
  },
  stepLabel: {
    ...typography.bodyMedium,
    textAlign: 'center',
    paddingHorizontal: spacing.xl,
  },
  roundLabel: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  actionButton: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  stopButton: {
    backgroundColor: colors.textMuted,
  },
  actionButtonText: {
    ...typography.button,
  },
});
