export const colors = {
  primary: '#8B7355',
  primaryLight: '#A89880',
  primaryDark: '#6B5B47',

  background: '#F5F0EB',
  card: '#FFFFFF',
  cardBorder: '#E5E0DB',

  accentGreen: '#7C6E60',
  accentAmber: '#8B7355',
  accentPink: '#8B7355',

  text: '#2D2D2D',
  textMuted: '#7C6E60',
  textLight: '#FFFFFF',

  error: '#DC2626',
  errorLight: '#FEF2F2',
  errorBorder: '#FECACA',
  success: '#7C6E60',
} as const;

export type ColorKey = keyof typeof colors;
