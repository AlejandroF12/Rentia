import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'rentia.preferences.v1';
const DEFAULT_PREFERENCES = { darkMode: false, reduceMotion: false };
const PreferencesContext = createContext(null);

function readPreferences() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { preferences: DEFAULT_PREFERENCES, error: '' };
    const parsed = JSON.parse(saved);
    return {
      preferences: {
        darkMode: typeof parsed.darkMode === 'boolean' ? parsed.darkMode : false,
        reduceMotion: typeof parsed.reduceMotion === 'boolean' ? parsed.reduceMotion : false,
      },
      error: '',
    };
  } catch (error) {
    console.error('No se pudieron leer las preferencias guardadas.', error);
    return {
      preferences: DEFAULT_PREFERENCES,
      error: 'No se pudieron leer los ajustes guardados en este navegador.',
    };
  }
}

export function PreferencesProvider({ children }) {
  const [stored, setStored] = useState(readPreferences);
  const { darkMode, reduceMotion } = stored.preferences;

  useEffect(() => {
    document.documentElement.dataset.theme = darkMode ? 'dark' : 'light';
    document.documentElement.dataset.reduceMotion = reduceMotion ? 'true' : 'false';
  }, [darkMode, reduceMotion]);

  const setPreference = useCallback((key, value) => {
    const nextPreferences = { ...stored.preferences, [key]: value };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPreferences));
      setStored({ preferences: nextPreferences, error: '' });
      return true;
    } catch (error) {
      console.error('No se pudo guardar la preferencia.', error);
      setStored((current) => ({
        ...current,
        error: 'No se pudo guardar el ajuste. Revisa el almacenamiento del navegador e inténtalo de nuevo.',
      }));
      return false;
    }
  }, [stored.preferences]);

  const value = useMemo(() => ({
    ...stored.preferences,
    error: stored.error,
    setPreference,
  }), [stored, setPreference]);

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

// Preference consumers must share this hook with the provider.
// eslint-disable-next-line react-refresh/only-export-components
export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) throw new Error('usePreferences debe usarse dentro de PreferencesProvider');
  return context;
}
