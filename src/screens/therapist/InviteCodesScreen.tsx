import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { supabase } from '../../lib/supabase';
import { useAuthStore } from '../../store/authStore';
import { PillButton } from '../../components/common/PillButton';
import { Card } from '../../components/common/Card';

interface InviteCode {
  id: string;
  code: string;
  usedBy: string | null;
  expiresAt: string;
  createdAt: string;
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export default function InviteCodesScreen() {
  const [codes, setCodes] = useState<InviteCode[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const userId = useAuthStore((state) => state.userId);

  const fetchCodes = useCallback(async () => {
    if (!userId) return;
    const { data } = await supabase
      .from('invite_codes')
      .select('id, code, used_by, expires_at, created_at')
      .eq('created_by', userId)
      .order('created_at', { ascending: false });

    if (data) {
      setCodes(data.map((row: { id: string; code: string; used_by: string | null; expires_at: string; created_at: string }) => ({
        id: row.id,
        code: row.code,
        usedBy: row.used_by,
        expiresAt: row.expires_at,
        createdAt: row.created_at,
      })));
    }
  }, [userId]);

  useEffect(() => {
    fetchCodes();
  }, [fetchCodes]);

  const handleCreate = async () => {
    if (!userId) return;
    setIsCreating(true);
    try {
      const code = generateCode();
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      const { error } = await supabase.from('invite_codes').insert({
        code,
        created_by: userId,
        expires_at: expiresAt.toISOString(),
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        await fetchCodes();
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <View style={styles.container}>
      <PillButton
        label={isCreating ? 'Creating...' : 'Create Code'}
        onPress={handleCreate}
        disabled={isCreating}
        style={styles.createButton}
      />

      <FlatList
        data={codes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No invite codes yet.</Text>
        }
        renderItem={({ item }) => (
          <Card style={styles.codeCard}>
            <Text style={styles.codeText}>{item.code}</Text>
            <Text style={styles.codeStatus}>
              {item.usedBy ? 'Used' : `Expires ${new Date(item.expiresAt).toLocaleDateString()}`}
            </Text>
          </Card>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  createButton: {
    marginBottom: spacing.lg,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
  codeCard: {
    marginBottom: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  codeText: {
    fontFamily: 'Inter_700Bold',
    fontSize: 18,
    color: colors.text,
    letterSpacing: 2,
  },
  codeStatus: {
    ...typography.caption,
  },
});
