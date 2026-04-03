import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { journalThemes, getDailyPrompt, getPromptByTheme } from '../../content/journalPrompts';
import type { JournalPrompt } from '../../content/journalPrompts';
import { useJournal } from '../../hooks/useJournal';
import { useContentMode } from '../../hooks/useContentMode';
import { formatDate } from '../../utils/dateUtils';
import { Card } from '../../components/common/Card';
import { PillButton } from '../../components/common/PillButton';

export default function JournalScreen() {
  const { journalEntries, addJournalEntry } = useJournal();
  const { getJournalPrompt } = useContentMode();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const { prompt: initialPrompt, isAssigned } = getJournalPrompt();
  const [currentPrompt, setCurrentPrompt] = useState<JournalPrompt>(initialPrompt);
  const [isCurrentAssigned, setIsCurrentAssigned] = useState(isAssigned);
  const [body, setBody] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleThemeSelect = (theme: string) => {
    if (selectedTheme === theme) {
      setSelectedTheme(null);
      const { prompt, isAssigned: assigned } = getJournalPrompt();
      setCurrentPrompt(prompt);
      setIsCurrentAssigned(assigned);
    } else {
      setSelectedTheme(theme);
      setCurrentPrompt(getPromptByTheme(theme));
      setIsCurrentAssigned(false);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleSave = () => {
    if (!body.trim()) return;
    addJournalEntry(currentPrompt.text, body.trim());
    setBody('');
    setShowSuccess(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setTimeout(() => setShowSuccess(false), 2500);
  };

  const truncate = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trimEnd() + '...';
  };

  const renderHeader = () => (
    <View>
      <Text style={styles.title}>Journal</Text>

      <View style={styles.themeRow}>
        {journalThemes.map((theme) => (
          <TouchableOpacity
            key={theme}
            style={[styles.themePill, selectedTheme === theme && styles.themePillActive]}
            onPress={() => handleThemeSelect(theme)}
          >
            <Text
              style={[
                styles.themePillText,
                selectedTheme === theme && styles.themePillTextActive,
              ]}
            >
              {theme}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Card style={styles.promptCard}>
        <Text style={styles.promptLabel}>
          {isCurrentAssigned ? 'Assigned by your therapist' : "Today's Prompt"}
        </Text>
        <Text style={styles.promptText}>{currentPrompt.text}</Text>
        <Text style={styles.attribution}>Prompt by Manoshi Vin, LCSW</Text>
      </Card>

      <TextInput
        style={styles.textArea}
        placeholder="Start writing here..."
        placeholderTextColor={colors.textMuted}
        multiline
        textAlignVertical="top"
        value={body}
        onChangeText={setBody}
      />

      {showSuccess ? (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>Entry saved.</Text>
        </View>
      ) : (
        <PillButton
          label="Save Entry"
          onPress={handleSave}
          color={colors.accentAmber}
          disabled={!body.trim()}
          style={styles.saveButton}
        />
      )}

      {journalEntries.length > 0 && (
        <Text style={styles.pastTitle}>Past Entries</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={journalEntries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No entries yet. Start writing!</Text>
        }
        renderItem={({ item }) => (
          <Card style={styles.entryCard}>
            <Text style={styles.entryDate}>{formatDate(item.date)}</Text>
            <Text style={styles.entryBody}>{truncate(item.body, 80)}</Text>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  title: {
    ...typography.heading,
    marginBottom: spacing.md,
  },
  themeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginBottom: spacing.lg,
  },
  themePill: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.pill,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  themePillActive: {
    backgroundColor: colors.accentAmber,
    borderColor: colors.accentAmber,
  },
  themePillText: {
    ...typography.caption,
    color: colors.text,
  },
  themePillTextActive: {
    color: colors.textLight,
  },
  promptCard: {
    marginBottom: spacing.lg,
  },
  promptLabel: {
    ...typography.caption,
    color: colors.accentAmber,
    marginBottom: spacing.sm,
  },
  promptText: {
    ...typography.bodyMedium,
    marginBottom: spacing.md,
  },
  attribution: {
    ...typography.caption,
    fontStyle: 'italic',
  },
  textArea: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    minHeight: 160,
    ...typography.body,
    marginBottom: spacing.lg,
  },
  saveButton: {
    marginBottom: spacing.lg,
  },
  successBanner: {
    backgroundColor: colors.accentGreen,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  successText: {
    ...typography.bodyMedium,
    color: colors.textLight,
  },
  pastTitle: {
    ...typography.bodyMedium,
    marginBottom: spacing.md,
  },
  entryCard: {
    marginBottom: spacing.md,
  },
  entryDate: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  entryBody: {
    ...typography.body,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
