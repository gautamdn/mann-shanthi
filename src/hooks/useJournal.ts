import { useUserStore } from '../store/userStore';

export function useJournal() {
  const journalEntries = useUserStore((state) => state.journalEntries);
  const addJournalEntry = useUserStore((state) => state.addJournalEntry);

  return { journalEntries, addJournalEntry };
}
