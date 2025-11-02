import { create } from "zustand";
import { supabase } from "../utils/supabaseClient";
import api from "../utils/api";

const useAuthStore = create((set, get) => ({
  user: null,
  session: null,
  loading: true,
  error: null,

  setUser: (user) => set({ user }),
  setSession: (session) => set({ session }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),

  initializeAuth: async () => {
    try {
      const { loading } = get();
      if (!loading) return;

      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      const session = data?.session || null;
      const user = session?.user ?? null;
      set({ session, user, loading: false });

      // If a session exists (e.g. after OAuth redirect), tell backend to set cookie
      if (session) {
        try {
          await api.setCookie(session);
        } catch (e) {
          console.warn("setCookie on init failed:", e);
        }
      }

      // Subscribe to auth state changes
      supabase.auth.onAuthStateChange(async (event, newSession) => {
        try {
          if (event === "SIGNED_IN" && newSession) {
            set({ user: newSession.user, session: newSession });
            try {
              await api.setCookie(newSession);
            } catch (e) {
              console.warn("setCookie on SIGNED_IN failed:", e);
            }
          } else if (event === "SIGNED_OUT") {
            set({ user: null, session: null });
            try {
              await api.logout();
            } catch (e) {
              console.warn("backend logout failed:", e);
            }
          }
        } catch (e) {
          console.error("onAuthStateChange handler error:", e);
        }
      });
    } catch (err) {
      set({ error: err?.message ?? String(err), loading: false });
    }
  },

  signIn: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const session = data?.session || null;
      set({ session, user: session?.user ?? null, loading: false });

      if (session) {
        try {
          await api.setCookie(session);
        } catch (e) {
          console.warn("setCookie after signIn failed:", e);
        }
      }

      return session;
    } catch (err) {
      set({ error: err?.message ?? String(err), loading: false });
      throw err;
    }
  },

  signUp: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      const session = data?.session || null;
      set({ session, user: session?.user ?? null, loading: false });

      if (session) {
        try {
          await api.setCookie(session);
        } catch (e) {
          console.warn("setCookie after signUp failed:", e);
        }
      }

      return data;
    } catch (err) {
      set({ error: err?.message ?? String(err), loading: false });
      throw err;
    }
  },

  signInWithGoogle: async () => {
    try {
      set({ loading: true, error: null });
      const redirectTo = `${window.location.origin}/dashboard`;
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo },
      });
      set({ loading: false });
      if (error) throw error;
      return data;
    } catch (err) {
      set({ error: err?.message ?? String(err), loading: false });
      throw err;
    }
  },

  signOut: async () => {
    try {
      set({ loading: true, error: null });
      await supabase.auth.signOut();
      try {
        await api.logout();
      } catch (e) {
        console.warn("backend logout failed:", e);
      }
      set({ user: null, session: null, loading: false });
    } catch (err) {
      set({ error: err?.message ?? String(err), loading: false });
      throw err;
    }
  },

  clearError: () => set({ error: null }),

  isAuthenticated: () => {
    const { user, session } = get();
    return !!user && !!session;
  },
}));

export default useAuthStore;