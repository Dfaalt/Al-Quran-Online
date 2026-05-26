export interface Surah {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: 'Mekah' | 'Madinah';
  arti: string;
  deskripsi: string;
  audioFull: Record<string, string>;
}

export interface Ayah {
  nomorAyat: number;
  teksArab: string;
  teksLatin: string;
  teksIndonesia: string;
  audio: Record<string, string>;
}

export interface SurahDetail extends Surah {
  ayat: Ayah[];
  suratSelanjutnya: { nomor: number; nama: string; namaLatin: string } | false;
  suratSebelumnya: { nomor: number; nama: string; namaLatin: string } | false;
}

export interface Tafsir {
  nomor: number;
  nama: string;
  namaLatin: string;
  jumlahAyat: number;
  tempatTurun: string;
  arti: string;
  deskripsi: string;
  tafsir: TafsirAyat[];
}

export interface TafsirAyat {
  ayat: number;
  teks: string;
}

export interface LastRead {
  surahNumber: number;
  surahName: string;
  surahNameLatin: string;
  ayahNumber: number;
  timestamp: number;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'sepia';
  arabicFontSize: 'sm' | 'md' | 'lg' | 'xl';
  showTransliteration: boolean;
  showTranslation: boolean;
}
