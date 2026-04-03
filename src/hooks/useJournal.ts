import { useUserStore } from '../store/userStore';

export function useJournal() {
  const journalEntries = useUserStore((state) => state.journalEntries);
  const addJournalEntry = useUserStore((state) => state.addJournalEntry);
  const deleteJournalEntry = useUserStore((state) => state.deleteJournalEntry);

  return { journalEntries, addJournalEntry, deleteJournalEntry };
}
