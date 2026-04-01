import { create } from 'zustand';
import { KEYS, loadFromStorage, saveToStorage, removeFromStorage } from '../utils/storage';
import { getToday, isToday, isYesterday } from '../utils/dateUtils';
import { useAuthStore } from './authStore';
import {
  pushProfileToSupabase,
  pushMoodLogsToSupabase,
  pushJournalEntriesToSupabase,
  syncAll,
} from '../services/syncService';

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
  hasSkippedAuth: boolean;
  moodLog: MoodEntry[];
  streak: number;
  lastActiveDate: string;
  journalEntries: JournalEntry[];
}

interface UserActions {
  setUserName: (name: string) => void;
  completeOnboarding: () => void;
  skipAuth: () => void;
  logMood: (mood: 1 | 2 | 3 | 4 | 5) => void;
  addJournalEntry: (prompt: string, body: string) => void;
  updateStreak: () => void;
  hydrate: () => Promise<void>;
  clearUserData: () => Promise<void>;
}

type UserStore = UserState & UserActions;

const initialState: UserState = {
  userName: '',
  hasOnboarded: false,
  hasSkippedAuth: false,
  moodLog: [],
  streak: 0,
  lastActiveDate: '',
  journalEntries: [],
};

function getProfileData(state: UserState) {
  return {
    userName: state.userName,
    hasOnboarded: state.hasOnboarded,
    hasSkippedAuth: state.hasSkippedAuth,
    streak: state.streak,
    lastActiveDate: state.lastActiveDate,
  };
}

function tryRemoteSync(fn: () => Promise<unknown>): void {
  const userId = useAuthStore.getState().userId;
  if (userId) {
    fn().catch(() => {});
  }
}

export const useUserStore = create<UserStore>((set, get) => ({
  ...initialState,

  setUserName: (name: string) => {
    set({ userName: name });
    persistState(get());
    tryRemoteSync(() =>
      pushProfileToSupabase(useAuthStore.getState().userId!, getProfileData(get())),
    );
  },

  completeOnboarding: () => {
    set({ hasOnboarded: true });
    persistState(get());
    tryRemoteSync(() =>
      pushProfileToSupabase(useAuthStore.getState().userId!, getProfileData(get())),
    );
  },

  skipAuth: () => {
    set({ hasSkippedAuth: true });
    persistState(get());
  },

  logMood: (mood: 1 | 2 | 3 | 4 | 5) => {
    const today = getToday();
    const existing = get().moodLog;
    const filtered = existing.filter((entry) => entry.date !== today);
    set({ moodLog: [...filtered, { date: today, mood }] });
    get().updateStreak();
    persistState(get());
    tryRemoteSync(() =>
      pushMoodLogsToSupabase(useAuthStore.getState().userId!, get().moodLog),
    );
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
    tryRemoteSync(() =>
      pushJournalEntriesToSupabase(useAuthStore.getState().userId!, get().journalEntries),
    );
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

    // If authenticated, sync with remote
    const userId = useAuthStore.getState().userId;
    if (userId) {
      try {
        const currentState = get();
        const merged = await syncAll(userId, {
          userName: currentState.userName,
          hasOnboarded: currentState.hasOnboarded,
          hasSkippedAuth: currentState.hasSkippedAuth,
          streak: currentState.streak,
          lastActiveDate: currentState.lastActiveDate,
          moodLog: currentState.moodLog,
          journalEntries: currentState.journalEntries,
        });
        set(merged);
        persistState({ ...get(), ...merged });
      } catch {
        // offline — use local data
      }
    }
  },

  clearUserData: async () => {
    set(initialState);
    await removeFromStorage(KEYS.USER_STORE);
  },
}));

function persistState(state: UserStore): void {
  const {
    userName,
    hasOnboarded,
    hasSkippedAuth,
    moodLog,
    streak,
    lastActiveDate,
    journalEntries,
  } = state;
  saveToStorage(KEYS.USER_STORE, {
    userName,
    hasOnboarded,
    hasSkippedAuth,
    moodLog,
    streak,
    lastActiveDate,
    journalEntries,
  });
}
