import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
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

  const currentAffirmation = affirmations[currentIndex % affirmations.length];

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
    <View style={styles.container}>
      <Text style={styles.title}>Daily Affirmation</Text>
      <Text style={styles.subtitle}>Swipe for more</Text>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.card, animatedCardStyle]}>
          <Text style={styles.affirmationText}>{currentAffirmation.text}</Text>
          <Text style={styles.author}>— {currentAffirmation.author}</Text>
        </Animated.View>
      </GestureDetector>

      <View style={styles.dotRow}>
        {affirmations.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              index === currentIndex % affirmations.length && styles.dotActive,
            ]}
          />
        ))}
      </View>

      <View style={styles.navRow}>
        <TouchableOpacity style={styles.navButton} onPress={goToPrev}>
          <Text style={styles.navButtonText}>← Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navButton} onPress={goToNext}>
          <Text style={styles.navButtonText}>Next →</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    paddingTop: spacing.xl,
    alignItems: 'center',
  },
  title: {
    ...typography.heading,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
    marginBottom: spacing.xl,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.xl,
    width: SCREEN_WIDTH - spacing.lg * 2,
    minHeight: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  affirmationText: {
    ...typography.bodyMedium,
    fontSize: 20,
    lineHeight: 30,
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
    marginTop: spacing.xl,
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
  navRow: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  navButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  navButtonText: {
    ...typography.caption,
    color: colors.accentPink,
  },
});
