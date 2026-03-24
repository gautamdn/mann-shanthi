import React from 'react';
import { View, Text, Animated, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

interface BreathingCircleProps {
  scale: Animated.Value;
  phaseLabel: string;
  countdown: number | null;
}

export const BreathingCircle: React.FC<BreathingCircleProps> = ({
  scale,
  phaseLabel,
  countdown,
}) => {
  const animatedStyle: Animated.WithAnimatedObject<ViewStyle> = {
    transform: [{ scale }],
  };

  return (
    <View style={styles.wrapper}>
      <Animated.View style={[styles.circle, animatedStyle]} />
      <View style={styles.labelContainer}>
        <Text style={styles.phaseLabel}>{phaseLabel}</Text>
        {countdown !== null && (
          <Text style={styles.countdown}>{countdown}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: 220,
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  circle: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 110,
    backgroundColor: colors.primary,
    opacity: 0.25,
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  phaseLabel: {
    ...typography.bodyMedium,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  countdown: {
    fontFamily: 'Inter_700Bold',
    fontSize: 36,
    color: colors.primary,
  },
});
