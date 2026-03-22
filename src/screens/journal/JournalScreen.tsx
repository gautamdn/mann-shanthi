import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  FlatList,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '../../theme/spacing';
import { journalPrompts, journalThemes } from '../../content/journalPrompts';
import { useJournal } from '../../hooks/useJournal';
import { formatDate } from '../../utils/dateUtils';

export default function JournalScreen() {
  const { journalEntries, addJournalEntry } = useJournal();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);
  const [body, setBody] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const todayPrompt = useMemo(() => {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
    );
    const filtered = selectedTheme
      ? journalPrompts.filter((p) => p.theme === selectedTheme)
      : journalPrompts;
    return filtered[dayOfYear % filtered.length];
  }, [selectedTheme]);

  const handleSave = () => {
    if (!body.trim()) return;
    addJournalEntry(todayPrompt.text, body.trim());
    setBody('');
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  if (showHistory) {
    return (
      <View style={styles.container}>
        <View style={styles.historyHeader}>
          <Text style={styles.title}>Journal History</Text>
          <TouchableOpacity onPress={() => setShowHistory(false)}>
            <Text style={styles.backLink}>Write</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={journalEntries}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.historyList}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No entries yet. Start writing!</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.historyCard}>
              <Text style={styles.historyDate}>{formatDate(item.date)}</Text>
              <Text style={styles.historyPrompt}>{item.prompt}</Text>
              <Text style={styles.historyBody}>{item.body}</Text>
            </View>
          )}
        />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Journal</Text>
        <TouchableOpacity onPress={() => setShowHistory(true)}>
          <Text style={styles.historyLink}>History ({journalEntries.length})</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.themeScroll}
        contentContainerStyle={styles.themeRow}
      >
        <TouchableOpacity
          style={[styles.themePill, !selectedTheme && styles.themePillActive]}
          onPress={() => setSelectedTheme(null)}
        >
          <Text style={[styles.themePillText, !selectedTheme && styles.themePillTextActive]}>
            All
          </Text>
        </TouchableOpacity>
        {journalThemes.map((theme) => (
          <TouchableOpacity
            key={theme}
            style={[styles.themePill, selectedTheme === theme && styles.themePillActive]}
            onPress={() => setSelectedTheme(theme)}
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
      </ScrollView>

      <View style={styles.promptCard}>
        <Text style={styles.promptLabel}>Today's Prompt</Text>
        <Text style={styles.promptText}>{todayPrompt.text}</Text>
      </View>

      <TextInput
        style={styles.textArea}
        placeholder="Start writing here..."
        placeholderTextColor={colors.textMuted}
        multiline
        textAlignVertical="top"
        value={body}
        onChangeText={setBody}
      />

      <TouchableOpacity
        style={[styles.saveButton, !body.trim() && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={!body.trim()}
      >
        <Text style={styles.saveButtonText}>Save Entry</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    ...typography.heading,
  },
  historyLink: {
    ...typography.caption,
    color: colors.accentAmber,
  },
  themeScroll: {
    marginBottom: spacing.lg,
  },
  themeRow: {
    gap: spacing.sm,
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
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  promptLabel: {
    ...typography.caption,
    color: colors.accentAmber,
    marginBottom: spacing.sm,
  },
  promptText: {
    ...typography.bodyMedium,
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
    backgroundColor: colors.accentAmber,
    borderRadius: borderRadius.pill,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    ...typography.button,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    paddingTop: spacing.xl,
  },
  backLink: {
    ...typography.caption,
    color: colors.accentAmber,
  },
  historyList: {
    padding: spacing.lg,
    paddingTop: 0,
  },
  historyCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.card,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  historyDate: {
    ...typography.caption,
    marginBottom: spacing.xs,
  },
  historyPrompt: {
    ...typography.caption,
    color: colors.accentAmber,
    fontStyle: 'italic',
    marginBottom: spacing.sm,
  },
  historyBody: {
    ...typography.body,
  },
  emptyText: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.xl,
  },
});
