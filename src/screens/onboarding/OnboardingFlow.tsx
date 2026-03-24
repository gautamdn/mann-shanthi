import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { useUserStore } from '../../store/userStore';
import { PillButton } from '../../components/common/PillButton';

const TOTAL_STEPS = 5;

export default function OnboardingFlow() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const setUserName = useUserStore((state) => state.setUserName);
  const completeOnboarding = useUserStore((state) => state.completeOnboarding);

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(step + 1);
  };

  const handleNameSubmit = () => {
    if (!name.trim()) return;
    setUserName(name.trim());
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setStep(step + 1);
  };

  const handleBegin = () => {
    completeOnboarding();
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const renderDots = () => (
    <View style={styles.dotRow}>
      {Array.from({ length: TOTAL_STEPS }).map((_, index) => (
        <View
          key={index}
          style={[styles.dot, index === step && styles.dotActive]}
        />
      ))}
    </View>
  );

  // Screen 1: Welcome
  if (step === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {renderDots()}
        <View style={styles.centerContent}>
          <Text style={styles.appName}>मन शांति</Text>
          <Text style={styles.appNameEnglish}>Mann Shanthi</Text>
          <Text style={styles.tagline}>Peace of mind, in your pocket</Text>
        </View>
        <PillButton
          label="Get started"
          onPress={handleNext}
          style={styles.bottomButton}
        />
      </SafeAreaView>
    );
  }

  // Screen 2: Name entry
  if (step === 1) {
    return (
      <SafeAreaView style={styles.container}>
        {renderDots()}
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
        <PillButton
          label="Continue"
          onPress={handleNameSubmit}
          disabled={!name.trim()}
          style={styles.bottomButton}
        />
      </SafeAreaView>
    );
  }

  // Screen 3: Value prop
  if (step === 2) {
    return (
      <SafeAreaView style={styles.container}>
        {renderDots()}
        <View style={styles.centerContent}>
          <Text style={styles.title}>Your toolkit for calm</Text>
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🌬️</Text>
              <View style={styles.featureTextGroup}>
                <Text style={styles.featureTitle}>Breathe</Text>
                <Text style={styles.featureDesc}>Guided breathing to calm your nervous system</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>📝</Text>
              <View style={styles.featureTextGroup}>
                <Text style={styles.featureTitle}>Journal</Text>
                <Text style={styles.featureDesc}>Therapist-crafted prompts to process your thoughts</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>💜</Text>
              <View style={styles.featureTextGroup}>
                <Text style={styles.featureTitle}>Affirm</Text>
                <Text style={styles.featureDesc}>Daily affirmations to remind you of your worth</Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <Text style={styles.featureEmoji}>🌿</Text>
              <View style={styles.featureTextGroup}>
                <Text style={styles.featureTitle}>Ground</Text>
                <Text style={styles.featureDesc}>Sensory exercises to anchor you in the present</Text>
              </View>
            </View>
          </View>
        </View>
        <PillButton
          label="Continue"
          onPress={handleNext}
          style={styles.bottomButton}
        />
      </SafeAreaView>
    );
  }

  // Screen 4: Meet Manoshi
  if (step === 3) {
    return (
      <SafeAreaView style={styles.container}>
        {renderDots()}
        <View style={styles.centerContent}>
          <Image
            source={require('../../../assets/manoshi.jpg')}
            style={styles.manoshiPhoto}
          />
          <Text style={styles.title}>Meet Manoshi</Text>
          <Text style={styles.manoshiCredential}>
            Board Certified Licensed Clinical Social Worker
          </Text>
          <Text style={styles.body}>
            With 15+ years in mental health, Manoshi specializes in anxiety, depression, and intergenerational trauma — the kind that shows up as family pressure, comparison, and burnout.
          </Text>
          <Text style={styles.bodySecondary}>
            Every prompt and affirmation in this app is crafted by her with empathy, warmth, and zero judgement. This is therapy-informed content you can trust.
          </Text>
        </View>
        <PillButton
          label="Continue"
          onPress={handleNext}
          style={styles.bottomButton}
        />
      </SafeAreaView>
    );
  }

  // Screen 5: Final CTA
  return (
    <SafeAreaView style={styles.container}>
      {renderDots()}
      <View style={styles.centerContent}>
        <Text style={styles.readyEmoji}>🙏</Text>
        <Text style={styles.title}>You're all set, {name}!</Text>
        <Text style={styles.body}>
          No pressure, no streaks to chase. Just show up when you need it. This space is yours.
        </Text>
      </View>
      <PillButton
        label="Begin your journey"
        onPress={handleBegin}
        style={styles.bottomButton}
      />
    </SafeAreaView>
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
    paddingHorizontal: spacing.md,
  },
  appName: {
    fontFamily: 'Inter_700Bold',
    fontSize: 40,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  appNameEnglish: {
    ...typography.bodyMedium,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  tagline: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
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
    marginBottom: spacing.md,
  },
  bodySecondary: {
    ...typography.caption,
    textAlign: 'center',
    lineHeight: 20,
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
  featureList: {
    width: '100%',
    gap: spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  featureEmoji: {
    fontSize: 28,
  },
  featureTextGroup: {
    flex: 1,
  },
  featureTitle: {
    ...typography.bodyMedium,
    marginBottom: spacing.xs,
  },
  featureDesc: {
    ...typography.caption,
  },
  manoshiPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: spacing.lg,
  },
  manoshiCredential: {
    ...typography.caption,
    color: colors.primary,
    textAlign: 'center',
    marginTop: -spacing.sm,
    marginBottom: spacing.lg,
  },
  readyEmoji: {
    fontSize: 56,
    marginBottom: spacing.lg,
  },
  bottomButton: {
    marginBottom: spacing.lg,
  },
});
