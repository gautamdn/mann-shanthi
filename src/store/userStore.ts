import { create } from 'zustand';
import { KEYS, loadFromStorage, saveToStorage } from '../utils/storage';
import { getToday, isToday, isYesterday } from '../utils/dateUtils';

export interface MoodEntry {
  date: string;
  mood: 1 | 2 | 3 | 4 | 5;
}

export interface JournalEntry {
  id: string;
  date: string;
  prompt: string;
  body: string;
}

interface UserState {
  userName: string;
  hasOnboarded: boolean;
  moodLog: MoodEntry[];
  streak: number;
  lastActiveDate: string;
  journalEntries: JournalEntry[];
}

interface UserActions {
  setUserName: (name: string) => void;
  completeOnboarding: () => void;
  logMood: (mood: 1 | 2 | 3 | 4 | 5) => void;
  addJournalEntry: (prompt: string, body: string) => void;
  updateStreak: () => void;
  hydrate: () => Promise<void>;
}

type UserStore = UserState & UserActions;

const initialState: UserState = {
  userName: '',
  hasOnboarded: false,
  moodLog: [],
  streak: 0,
  lastActiveDate: '',
  journalEntries: [],
};

export const useUserStore = create<UserStore>((set, get) => ({
  ...initialState,

  setUserName: (name: string) => {
    set({ userName: name });
    persistState(get());
  },

  completeOnboarding: () => {
    set({ hasOnboarded: true });
    persistState(get());
  },

  logMood: (mood: 1 | 2 | 3 | 4 | 5) => {
    const today = getToday();
    const existing = get().moodLog;
    const filtered = existing.filter((entry) => entry.date !== today);
    set({ moodLog: [...filtered, { date: today, mood }] });
    get().updateStreak();
    persistState(get());
  },

  addJournalEntry: (prompt: string, body: string) => {
    const entry: JournalEntry = {
      id: Date.now().toString(),
      date: getToday(),
      prompt,
      body,
    };
    set((state) => ({
      journalEntries: [entry, ...state.journalEntries],
    }));
    persistState(get());
  },

  updateStreak: () => {
    const today = getToday();
    const { lastActiveDate, streak } = get();

    if (isToday(lastActiveDate)) return;

    if (isYesterday(lastActiveDate)) {
      set({ streak: streak + 1, lastActiveDate: today });
    } else {
      set({ streak: 1, lastActiveDate: today });
    }
    persistState(get());
  },

  hydrate: async () => {
    const stored = await loadFromStorage<UserState>(KEYS.USER_STORE);
    if (stored) {
      set(stored);
    }
  },
}));

function persistState(state: UserStore): void {
  const { userName, hasOnboarded, moodLog, streak, lastActiveDate, journalEntries } = state;
  saveToStorage(KEYS.USER_STORE, {
    userName,
    hasOnboarded,
    moodLog,
    streak,
    lastActiveDate,
    journalEntries,
  });
}
