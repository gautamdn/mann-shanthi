import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { breathingTechniques, BreathingTechnique } from '../../content/breathingTechniques';
import { PillButton } from '../../components/common/PillButton';
import { BreathingCircle } from '../../components/breathe/BreathingCircle';

export default function BreatheScreen() {
  const [selectedTechnique, setSelectedTechnique] = useState<BreathingTechnique>(breathingTechniques[0]);
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);

  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const circleScale = useRef(new Animated.Value(0.5)).current;
  const currentStep = selectedTechnique.steps[currentStepIndex];

  const startCountdown = useCallback((duration: number) => {
    setCountdown(duration);
    if (countdownRef.current) clearInterval(countdownRef.current);
    countdownRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          if (countdownRef.current) clearInterval(countdownRef.current);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const clearCountdown = useCallback(() => {
    if (countdownRef.current) clearInterval(countdownRef.current);
    setCountdown(null);
  }, []);

  const runStep = useCallback(() => {
    if (!isActive) return;

    const step = selectedTechnique.steps[currentStepIndex];
    const isInhale = step.label.includes('In');
    const isExhale = step.label.includes('Out');

    if (isInhale) {
      Animated.timing(circleScale, {
        toValue: 1,
        duration: step.duration * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else if (isExhale) {
      Animated.timing(circleScale, {
        toValue: 0.5,
        duration: step.duration * 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }

    startCountdown(step.duration);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, [isActive, currentStepIndex, selectedTechnique, circleScale, startCountdown]);

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
          clearCountdown();
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      }
    }, currentStep.duration * 1000);

    return () => clearTimeout(timeout);
  }, [isActive, currentStepIndex, currentRound, runStep, currentStep.duration, selectedTechnique, clearCountdown]);

  useEffect(() => {
    return () => clearCountdown();
  }, [clearCountdown]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentStepIndex(0);
    setCurrentRound(0);
    circleScale.setValue(0.5);
  };

  const handleStop = () => {
    setIsActive(false);
    setCurrentStepIndex(0);
    setCurrentRound(0);
    clearCountdown();
    Animated.timing(circleScale, {
      toValue: 0.5,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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
        <BreathingCircle
          scale={circleScale}
          phaseLabel={isActive ? currentStep.label : selectedTechnique.description}
          countdown={isActive ? countdown : null}
        />
        {isActive && (
          <Text style={styles.roundLabel}>
            Round {currentRound + 1} of {selectedTechnique.rounds}
          </Text>
        )}
      </View>

      <PillButton
        label={isActive ? 'Stop' : 'Start'}
        onPress={isActive ? handleStop : handleStart}
        color={isActive ? colors.textMuted : colors.primary}
        style={styles.actionButton}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
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
  roundLabel: {
    ...typography.caption,
    marginTop: spacing.sm,
  },
  actionButton: {
    marginBottom: spacing.lg,
  },
});
