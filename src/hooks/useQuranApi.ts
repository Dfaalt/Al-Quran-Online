import { useQuery } from '@tanstack/react-query';
import type { Surah, SurahDetail, Tafsir } from '@/types/quran';

const API_BASE = 'https://equran.id/api/v2';

async function fetchSurahList(): Promise<Surah[]> {
  const response = await fetch(`${API_BASE}/surat`);
  if (!response.ok) throw new Error('Failed to fetch surah list');
  const data = await response.json();
  return data.data;
}

async function fetchSurahDetail(surahNumber: number): Promise<SurahDetail> {
  const response = await fetch(`${API_BASE}/surat/${surahNumber}`);
  if (!response.ok) throw new Error('Failed to fetch surah detail');
  const data = await response.json();
  return data.data;
}

async function fetchTafsir(surahNumber: number): Promise<Tafsir> {
  const response = await fetch(`${API_BASE}/tafsir/${surahNumber}`);
  if (!response.ok) throw new Error('Failed to fetch tafsir');
  const data = await response.json();
  return data.data;
}

export function useSurahList() {
  return useQuery({
    queryKey: ['surahList'],
    queryFn: fetchSurahList,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useSurahDetail(surahNumber: number) {
  return useQuery({
    queryKey: ['surahDetail', surahNumber],
    queryFn: () => fetchSurahDetail(surahNumber),
    enabled: surahNumber > 0 && surahNumber <= 114,
    staleTime: 1000 * 60 * 60,
  });
}

export function useTafsir(surahNumber: number) {
  return useQuery({
    queryKey: ['tafsir', surahNumber],
    queryFn: () => fetchTafsir(surahNumber),
    enabled: surahNumber > 0 && surahNumber <= 114,
    staleTime: 1000 * 60 * 60,
  });
}
