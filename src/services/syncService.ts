import { supabase } from '../lib/supabase';
import type { MoodEntry, JournalEntry } from '../store/userStore';

interface ProfileData {
  userName: string;
  hasOnboarded: boolean;
  hasSkippedAuth: boolean;
  streak: number;
  lastActiveDate: string;
}

interface SyncableState extends ProfileData {
  moodLog: MoodEntry[];
  journalEntries: JournalEntry[];
}

export async function pushProfileToSupabase(
  userId: string,
  profile: ProfileData,
): Promise<void> {
  await supabase.from('profiles').upsert({
    id: userId,
    user_name: profile.userName,
    has_onboarded: profile.hasOnboarded,
    streak: profile.streak,
    last_active_date: profile.lastActiveDate,
    updated_at: new Date().toISOString(),
  });
}

export async function pushMoodLogsToSupabase(
  userId: string,
  moodLog: MoodEntry[],
): Promise<void> {
  if (moodLog.length === 0) return;

  const rows = moodLog.map((entry) => ({
    user_id: userId,
    date: entry.date,
    mood: entry.mood,
  }));

  await supabase
    .from('mood_logs')
    .upsert(rows, { onConflict: 'user_id,date' });
}

export async function pushJournalEntriesToSupabase(
  userId: string,
  entries: JournalEntry[],
): Promise<void> {
  if (entries.length === 0) return;

  const rows = entries.map((entry) => ({
    id: entry.id,
    user_id: userId,
    date: entry.date,
    prompt: entry.prompt,
    body: entry.body,
  }));

  await supabase
    .from('journal_entries')
    .upsert(rows, { onConflict: 'id' });
}

async function pullProfileFromSupabase(
  userId: string,
): Promise<ProfileData | null> {
  const { data } = await supabase
    .from('profiles')
    .select('user_name, has_onboarded, streak, last_active_date')
    .eq('id', userId)
    .single();

  if (!data) return null;

  return {
    userName: data.user_name ?? '',
    hasOnboarded: data.has_onboarded ?? false,
    hasSkippedAuth: false,
    streak: data.streak ?? 0,
    lastActiveDate: data.last_active_date ?? '',
  };
}

async function pullMoodLogsFromSupabase(
  userId: string,
): Promise<MoodEntry[]> {
  const { data } = await supabase
    .from('mood_logs')
    .select('date, mood')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (!data) return [];

  return data.map((row: { date: string; mood: number }) => ({
    date: row.date,
    mood: row.mood as 1 | 2 | 3 | 4 | 5,
  }));
}

async function pullJournalEntriesFromSupabase(
  userId: string,
): Promise<JournalEntry[]> {
  const { data } = await supabase
    .from('journal_entries')
    .select('id, date, prompt, body')
    .eq('user_id', userId)
    .order('date', { ascending: false });

  if (!data) return [];

  return data.map((row: { id: string; date: string; prompt: string; body: string }) => ({
    id: row.id,
    date: row.date,
    prompt: row.prompt,
    body: row.body,
  }));
}

function mergeMoodLogs(local: MoodEntry[], remote: MoodEntry[]): MoodEntry[] {
  const byDate = new Map<string, MoodEntry>();
  // Remote first, then local overwrites (local wins on conflict)
  for (const entry of remote) {
    byDate.set(entry.date, entry);
  }
  for (const entry of local) {
    byDate.set(entry.date, entry);
  }
  return Array.from(byDate.values()).sort(
    (a, b) => b.date.localeCompare(a.date),
  );
}

function mergeJournalEntries(
  local: JournalEntry[],
  remote: JournalEntry[],
): JournalEntry[] {
  const byId = new Map<string, JournalEntry>();
  for (const entry of remote) {
    byId.set(entry.id, entry);
  }
  // Local wins on conflict
  for (const entry of local) {
    byId.set(entry.id, entry);
  }
  return Array.from(byId.values()).sort(
    (a, b) => b.date.localeCompare(a.date),
  );
}

export async function syncAll(
  userId: string,
  localState: SyncableState,
): Promise<SyncableState> {
  // Push local data to remote
  await Promise.all([
    pushProfileToSupabase(userId, localState),
    pushMoodLogsToSupabase(userId, localState.moodLog),
    pushJournalEntriesToSupabase(userId, localState.journalEntries),
  ]);

  // Pull remote data
  const [remoteProfile, remoteMoods, remoteJournals] = await Promise.all([
    pullProfileFromSupabase(userId),
    pullMoodLogsFromSupabase(userId),
    pullJournalEntriesFromSupabase(userId),
  ]);

  // Merge: local wins for conflicts, union for new entries
  const mergedMoodLog = mergeMoodLogs(localState.moodLog, remoteMoods);
  const mergedJournals = mergeJournalEntries(
    localState.journalEntries,
    remoteJournals,
  );

  return {
    userName: localState.userName || remoteProfile?.userName || '',
    hasOnboarded: localState.hasOnboarded || remoteProfile?.hasOnboarded || false,
    hasSkippedAuth: localState.hasSkippedAuth,
    streak: Math.max(localState.streak, remoteProfile?.streak ?? 0),
    lastActiveDate:
      localState.lastActiveDate > (remoteProfile?.lastActiveDate ?? '')
        ? localState.lastActiveDate
        : (remoteProfile?.lastActiveDate ?? ''),
    moodLog: mergedMoodLog,
    journalEntries: mergedJournals,
  };
}
