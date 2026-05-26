import { useState, useEffect, useCallback } from 'react';
import type { LastRead, AppSettings } from '@/types/quran';

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'dark',
  arabicFontSize: 'md',
  showTransliteration: true,
  showTranslation: true,
};

export function useLastRead() {
  const [lastRead, setLastReadState] = useState<LastRead | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('quran-last-read');
    if (stored) {
      setLastReadState(JSON.parse(stored));
    }
  }, []);

  const setLastRead = useCallback((data: LastRead) => {
    localStorage.setItem('quran-last-read', JSON.stringify(data));
    setLastReadState(data);
  }, []);

  return { lastRead, setLastRead };
}

export function useBookmarks() {
  const [bookmarks, setBookmarksState] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('quran-bookmarks');
    if (stored) {
      setBookmarksState(JSON.parse(stored));
    }
  }, []);

  const addBookmark = useCallback((key: string) => {
    setBookmarksState((prev) => {
      const updated = [...prev, key];
      localStorage.setItem('quran-bookmarks', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeBookmark = useCallback((key: string) => {
    setBookmarksState((prev) => {
      const updated = prev.filter((b) => b !== key);
      localStorage.setItem('quran-bookmarks', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isBookmarked = useCallback(
    (key: string) => bookmarks.includes(key),
    [bookmarks]
  );

  return { bookmarks, addBookmark, removeBookmark, isBookmarked };
}

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const stored = localStorage.getItem('quran-settings');
    if (stored) {
      setSettingsState({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
    }
  }, []);

  useEffect(() => {
    // Apply theme
    document.documentElement.classList.remove('light', 'dark', 'sepia');
    document.documentElement.classList.add(settings.theme);
  }, [settings.theme]);

  const updateSettings = useCallback((updates: Partial<AppSettings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('quran-settings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return { settings, updateSettings };
}
