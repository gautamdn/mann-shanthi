import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface FeatureCardProps {
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}

export const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  subtitle,
  color,
  onPress,
}) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    width: '47%',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: spacing.sm,
  },
  title: {
    ...typography.bodyMedium,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.caption,
  },
});
