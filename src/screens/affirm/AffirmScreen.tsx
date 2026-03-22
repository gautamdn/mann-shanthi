import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { affirmations } from '../../content/affirmations';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;

export default function AffirmScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const translateX = useSharedValue(0);

  const current = affirmations[currentIndex];

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % affirmations.length);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + affirmations.length) % affirmations.length);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      translateX.value = event.translationX;
    })
    .onEnd((event) => {
      if (event.translationX < -SWIPE_THRESHOLD) {
        runOnJS(goToNext)();
      } else if (event.translationX > SWIPE_THRESHOLD) {
        runOnJS(goToPrev)();
      }
      translateX.value = withSpring(0, { damping: 20 });
    });

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <Text style={styles.title}>Daily Affirmation</Text>

      <View style={styles.cardContainer}>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.card, animatedCardStyle]}>
            <Text style={styles.emoji}>{current.emoji}</Text>
            <Text style={styles.affirmationText}>{current.text}</Text>
            <Text style={styles.subtext}>{current.subtext}</Text>
            <Text style={styles.author}>— {current.author}</Text>
          </Animated.View>
        </GestureDetector>
      </View>

      <View style={styles.dotRow}>
        {affirmations.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex && styles.dotActive,
            ]}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={goToNext}>
        <Text style={styles.nextButtonText}>Next →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...typography.heading,
    marginBottom: spacing.lg,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.xl,
    width: SCREEN_WIDTH - spacing.lg * 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  affirmationText: {
    ...typography.heading,
    fontSize: 22,
    lineHeight: 32,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  subtext: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  author: {
    ...typography.caption,
    color: colors.accentPink,
  },
  dotRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.cardBorder,
  },
  dotActive: {
    backgroundColor: colors.accentPink,
    width: 20,
  },
  nextButton: {
    backgroundColor: colors.accentPink,
    borderRadius: borderRadius.pill,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xxl,
    marginBottom: spacing.lg,
  },
  nextButtonText: {
    ...typography.button,
  },
});
