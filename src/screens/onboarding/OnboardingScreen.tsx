import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { useUserStore } from '../../store/userStore';

interface OnboardingStep {
  title: string;
  body: string;
}

const STEPS: OnboardingStep[] = [
  {
    title: 'Welcome to Mann Shanthi 🙏',
    body: 'A space for your mind to breathe. No judgement, no pressure — just tools to help you feel a little more like yourself.',
  },
  {
    title: 'Built with care',
    body: 'Every prompt, every affirmation is crafted by Manoshi — a licensed therapist who understands the unique pressures of our generation.',
  },
  {
    title: 'Your space, your pace',
    body: 'Breathe, journal, ground yourself, or just read something kind. Use what helps, skip what doesn\'t.',
  },
];

export default function OnboardingScreen() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const setUserName = useUserStore((state) => state.setUserName);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (step < STEPS.length) {
      setStep(step + 1);
    }
  };

  const handleStart = () => {
    if (!name.trim()) return;
    setUserName(name.trim());
    completeOnboarding();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  // Name entry step
  if (step === STEPS.length) {
    return (
      <View style={styles.container}>
        <View style={styles.centerContent}>
          <Text style={styles.title}>What should we call you?</Text>
          <TextInput
            style={styles.nameInput}
            placeholder="Your first name"
            placeholderTextColor={colors.textMuted}
            value={name}
            onChangeText={setName}
            autoFocus
            autoCapitalize="words"
          />
        </View>
        <TouchableOpacity
          style={[styles.button, !name.trim() && styles.buttonDisabled]}
          onPress={handleStart}
          disabled={!name.trim()}
        >
          <Text style={styles.buttonText}>Let's begin</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const currentStep = STEPS[step];

  return (
    <View style={styles.container}>
      <View style={styles.dotRow}>
        {[...STEPS, null].map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === step && styles.dotActive]}
          />
        ))}
      </View>

      <View style={styles.centerContent}>
        <Text style={styles.title}>{currentStep.title}</Text>
        <Text style={styles.body}>{currentStep.body}</Text>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    paddingTop: spacing.xxl,
    justifyContent: 'space-between',
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cardBorder,
  },
  dotActive: {
    backgroundColor: colors.primary,
    width: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
  },
  title: {
    ...typography.heading,
    fontSize: 26,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  body: {
    ...typography.body,
    textAlign: 'center',
    color: colors.textMuted,
    lineHeight: 26,
  },
  nameInput: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.input,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    width: '100%',
    textAlign: 'center',
    ...typography.bodyMedium,
    fontSize: 20,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    ...typography.button,
  },
});
