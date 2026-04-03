import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
  userId: string | null;
  email: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  role: 'public' | 'patient' | 'therapist';
}

interface AuthActions {
  setSession: (userId: string, email: string) => void;
  clearSession: () => void;
  setLoading: (loading: boolean) => void;
  signUp: (email: string, password: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  restoreSession: () => Promise<void>;
  setRole: (role: 'public' | 'patient' | 'therapist') => void;
  fetchRole: () => Promise<void>;
  redeemInviteCode: (code: string) => Promise<{ success: boolean; error: string | null }>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>((set, get) => ({
  userId: null,
  email: null,
  isAuthenticated: false,
  isLoading: false,
  role: 'public',

  setSession: (userId: string, email: string) => {
    set({ userId, email, isAuthenticated: true });
  },

  clearSession: () => {
    set({ userId: null, email: null, isAuthenticated: false, role: 'public' });
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
    set({ userId: null, email: null, isAuthenticated: false, role: 'public' });
  },

  setRole: (role) => {
    set({ role });
  },

  fetchRole: async () => {
    const userId = get().userId;
    if (!userId) return;
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single();
    if (data?.role) {
      set({ role: data.role as 'public' | 'patient' | 'therapist' });
    }
  },

  redeemInviteCode: async (code: string) => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.rpc('redeem_invite_code', {
        invite_code: code,
      });
      if (error) {
        return { success: false, error: error.message };
      }
      if (data === true) {
        set({ role: 'patient' });
        return { success: true, error: null };
      }
      return { success: false, error: 'Invalid or expired invite code.' };
    } finally {
      set({ isLoading: false });
    }
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

        // Fetch role from profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.session.user.id)
          .single();
        if (profile?.role) {
          set({ role: profile.role as 'public' | 'patient' | 'therapist' });
        }
      }
    } finally {
      set({ isLoading: false });
    }
  },
}));
