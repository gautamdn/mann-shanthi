import { TextStyle } from 'react-native';
import { colors } from './colors';

export const typography = {
  heading: {
    fontFamily: 'Inter_700Bold',
    fontSize: 20,
    lineHeight: 30,
    color: colors.text,
  } as TextStyle,

  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  } as TextStyle,

  bodyMedium: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    lineHeight: 24,
    color: colors.text,
  } as TextStyle,

  subtitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  } as TextStyle,

  tagline: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
    color: colors.textMuted,
  } as TextStyle,

  caption: {
    fontFamily: 'Inter_400Regular',
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  } as TextStyle,

  button: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    lineHeight: 24,
    color: colors.textLight,
  } as TextStyle,
} as const;
