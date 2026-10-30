import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Faltan VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY en .env.local');
}

const parsedSupabaseUrl = new URL(supabaseUrl);
if (parsedSupabaseUrl.pathname !== '/' || parsedSupabaseUrl.search || parsedSupabaseUrl.hash) {
  throw new Error('VITE_SUPABASE_URL debe ser la URL raíz del proyecto, sin /rest/v1 ni otras rutas');
}

const storageKey = `sb-${parsedSupabaseUrl.hostname.split('.')[0]}-auth-token`;
let rememberSession = true;

const authStorage = {
  getItem(key) {
    return localStorage.getItem(key) ?? sessionStorage.getItem(key);
  },
  setItem(key, value) {
    const storage = rememberSession ? localStorage : sessionStorage;
    storage.setItem(key, value);
    (rememberSession ? sessionStorage : localStorage).removeItem(key);
  },
  removeItem(key) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  },
};

export function setRememberSession(shouldRemember) {
  rememberSession = shouldRemember;
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: authStorage,
    storageKey,
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
