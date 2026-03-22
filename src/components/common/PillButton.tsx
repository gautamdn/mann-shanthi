import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';

interface PillButtonProps {
  label: string;
  onPress: () => void;
  color?: string;
  disabled?: boolean;
  style?: ViewStyle;
}

export const PillButton: React.FC<PillButtonProps> = ({
  label,
  onPress,
  color = colors.primary,
  disabled = false,
  style,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color },
        disabled && styles.disabled,
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={styles.text}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    ...typography.button,
  },
});
