"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const load = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        setUser(authUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    void load();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isAuthenticated = !!user;

  return { user, loading, isAuthenticated };
}

export function useRequireAuth() {
  const auth = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const requireAuth = useCallback(
    (action: () => void) => {
      if (auth.loading) return;
      if (!auth.isAuthenticated) {
        setShowLoginModal(true);
        return;
      }
      action();
    },
    [auth.loading, auth.isAuthenticated]
  );

  return {
    ...auth,
    showLoginModal,
    setShowLoginModal,
    requireAuth,
  };
}
