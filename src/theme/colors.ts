export const colors = {
  primary: '#7C3AED',
  primaryLight: '#A78BFA',
  primaryDark: '#5B21B6',

  background: '#F7F3EF',
  card: '#FFFFFF',
  cardBorder: '#EDE8E3',

  accentGreen: '#059669',
  accentAmber: '#D97706',
  accentPink: '#DB2777',

  text: '#2d2323',
  textMuted: '#9e8f8f',
  textLight: '#FFFFFF',

  error: '#DC2626',
  success: '#059669',
} as const;

export type ColorKey = keyof typeof colors;
