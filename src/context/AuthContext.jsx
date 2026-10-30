import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { loadProfile } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const initialize = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        throw new Error(`No se pudo recuperar la sesión: ${error.message}`);
      }

      if (!active) return;
      setSession(data.session);
      if (data.session?.user) {
        setProfile(await loadProfile(data.session.user.id));
      }
      setLoading(false);
    };

    initialize().catch((error) => {
      console.error(error);
      if (active) setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((event, nextSession) => {
      if (!active) return;
      setSession(nextSession);
      if (!nextSession?.user) {
        setProfile(null);
        setLoading(false);
        return;
      }

      loadProfile(nextSession.user.id)
        .then((nextProfile) => {
          if (active) setProfile(nextProfile);
        })
        .catch((error) => console.error(error))
        .finally(() => {
          if (active) setLoading(false);
        });
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo(() => ({
    session,
    profile,
    loading,
    signOut: () => supabase.auth.signOut(),
  }), [session, profile, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Auth context consumers must share this hook with the provider.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
