import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { useAuthStore } from '../../store/authStore';
import { useUserStore } from '../../store/userStore';
import { PillButton } from '../../components/common/PillButton';

type Mode = 'signIn' | 'signUp';

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { signIn, signUp, isLoading } = useAuthStore();
  const skipAuth = useUserStore((state) => state.skipAuth);

  const handleSubmit = async () => {
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please enter both email and password.');
      return;
    }

    if (mode === 'signUp' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (mode === 'signUp' && password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    const action = mode === 'signIn' ? signIn : signUp;
    const result = await action(email.trim(), password);

    if (result.error) {
      setError(result.error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const handleSkip = () => {
    skipAuth();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const toggleMode = () => {
    setMode(mode === 'signIn' ? 'signUp' : 'signIn');
    setError(null);
    setConfirmPassword('');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.header}>
            <Text style={styles.appName}>अंतरा</Text>
            <Text style={styles.appNameEnglish}>Antara</Text>
            <Text style={styles.tagline}>Your inner calm, always within reach</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.formTitle}>
              {mode === 'signIn' ? 'Welcome back' : 'Create your account'}
            </Text>

            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={colors.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={colors.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {mode === 'signUp' && (
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                placeholderTextColor={colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            )}

            {error && <Text style={styles.errorText}>{error}</Text>}

            {isLoading ? (
              <ActivityIndicator
                size="large"
                color={colors.primary}
                style={styles.loader}
              />
            ) : (
              <PillButton
                label={mode === 'signIn' ? 'Sign in' : 'Sign up'}
                onPress={handleSubmit}
                style={styles.submitButton}
              />
            )}

            <TouchableOpacity onPress={toggleMode} style={styles.toggleRow}>
              <Text style={styles.toggleText}>
                {mode === 'signIn'
                  ? "Don't have an account? "
                  : 'Already have an account? '}
              </Text>
              <Text style={styles.toggleLink}>
                {mode === 'signIn' ? 'Sign up' : 'Sign in'}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip for now</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    padding: spacing.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
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
    marginBottom: spacing.sm,
  },
  tagline: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  form: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
  },
  formTitle: {
    ...typography.heading,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.input,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...typography.body,
    color: colors.text,
  },
  errorText: {
    ...typography.caption,
    color: colors.error,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  loader: {
    marginVertical: spacing.md,
  },
  submitButton: {
    marginTop: spacing.sm,
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: spacing.lg,
  },
  toggleText: {
    ...typography.caption,
    color: colors.textMuted,
  },
  toggleLink: {
    ...typography.caption,
    color: colors.primary,
    fontFamily: 'Inter_600SemiBold',
  },
  skipButton: {
    alignItems: 'center',
    marginTop: spacing.lg,
    padding: spacing.md,
  },
  skipText: {
    ...typography.bodyMedium,
    color: colors.textMuted,
  },
});
