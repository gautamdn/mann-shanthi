import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { useAuthStore } from '../../store/authStore';
import { PillButton } from '../../components/common/PillButton';

export default function InviteCodeScreen() {
  const navigation = useNavigation();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { redeemInviteCode, isLoading } = useAuthStore();

  const handleRedeem = async () => {
    setError(null);
    if (!code.trim()) {
      setError('Please enter an invite code.');
      return;
    }

    const result = await redeemInviteCode(code.trim());
    if (result.success) {
      setSuccess(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setError(result.error ?? 'Something went wrong.');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  if (success) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContent}>
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.body}>
            Your account has been upgraded. You now have access to personalized content from your therapist.
          </Text>
          <PillButton label="Done" onPress={() => navigation.goBack()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
          <Text style={styles.closeText}>Close</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Invite Code</Text>
        <Text style={styles.body}>
          If your therapist gave you an invite code, enter it below to unlock personalized content.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Enter invite code"
          placeholderTextColor={colors.textMuted}
          value={code}
          onChangeText={setCode}
          autoCapitalize="none"
          autoCorrect={false}
        />

        {error && <Text style={styles.errorText}>{error}</Text>}

        <PillButton
          label={isLoading ? 'Redeeming...' : 'Redeem'}
          onPress={handleRedeem}
          disabled={isLoading || !code.trim()}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    paddingTop: spacing.md,
  },
  closeButton: {
    alignSelf: 'flex-end',
    padding: spacing.sm,
    marginBottom: spacing.md,
  },
  closeText: {
    ...typography.bodyMedium,
    color: colors.primary,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  title: {
    ...typography.heading,
    marginBottom: spacing.md,
  },
  body: {
    ...typography.body,
    color: colors.textMuted,
    marginBottom: spacing.lg,
  },
  input: {
    backgroundColor: colors.card,
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
    marginBottom: spacing.md,
  },
});
