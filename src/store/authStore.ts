import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
  userId: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthActions {
  setSession: (userId: string, email: string) => void;
  clearSession: () => void;
  setLoading: (loading: boolean) => void;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set) => ({
  userId: null,
  email: null,
  isAuthenticated: false,
  isLoading: false,

  setSession: (userId: string, email: string) => {
    set({ userId, email, isAuthenticated: true });
  },

  clearSession: () => {
    set({ userId: null, email: null, isAuthenticated: false });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  signUp: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        return { error: error.message };
      }
      if (data.user) {
        set({
          userId: data.user.id,
          email: data.user.email ?? email,
          isAuthenticated: true,
        });
      }
      return { error: null };
    } finally {
      set({ isLoading: false });
    }
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        return { error: error.message };
      }
      if (data.user) {
        set({
          userId: data.user.id,
          email: data.user.email ?? email,
          isAuthenticated: true,
        });
      }
      return { error: null };
    } finally {
      set({ isLoading: false });
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ userId: null, email: null, isAuthenticated: false });
  },

  restoreSession: async () => {
    set({ isLoading: true });
    try {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        set({
          userId: data.session.user.id,
          email: data.session.user.email ?? null,
          isAuthenticated: true,
        });
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
