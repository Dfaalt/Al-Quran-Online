import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, BookOpen, Eye, EyeOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { VerseCard } from '@/components/common/VerseCard';
import { VerseListSkeleton } from '@/components/common/SkeletonCard';
import { useSurahDetail, useTafsir } from '@/hooks/useQuranApi';
import { useLastRead, useSettings } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';

export default function SurahDetail() {
  const { surahNumber } = useParams<{ surahNumber: string }>();
  const location = useLocation();
  const number = parseInt(surahNumber || '1', 10);
  
  const { data: surah, isLoading } = useSurahDetail(number);
  const { data: tafsirData } = useTafsir(number);
  const { setLastRead } = useLastRead();
  const { settings } = useSettings();
  
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [showTransliteration, setShowTransliteration] = useState(settings.showTransliteration);
  const [showTranslation, setShowTranslation] = useState(settings.showTranslation);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Update last read position
  const updateLastRead = useCallback((ayahNumber: number) => {
    if (surah) {
      setLastRead({
        surahNumber: number,
        surahName: surah.nama,
        surahNameLatin: surah.namaLatin,
        ayahNumber,
        timestamp: Date.now(),
      });
    }
  }, [surah, number, setLastRead]);

  // Handle audio playback
  const handlePlayAyah = useCallback((ayahNumber: number, audioUrl: string) => {
    if (playingAyah === ayahNumber) {
      // Stop current playback
      audioRef.current?.pause();
      setPlayingAyah(null);
    } else {
      // Play new ayah
      if (audioRef.current) {
        audioRef.current.pause();
      }
      audioRef.current = new Audio(audioUrl);
      audioRef.current.play();
      setPlayingAyah(ayahNumber);
      updateLastRead(ayahNumber);

      audioRef.current.onended = () => {
        // Auto-play next ayah
        const currentIndex = surah?.ayat.findIndex(a => a.nomorAyat === ayahNumber);
        if (currentIndex !== undefined && currentIndex < (surah?.ayat.length || 0) - 1) {
          const nextAyah = surah?.ayat[currentIndex + 1];
          if (nextAyah) {
            handlePlayAyah(nextAyah.nomorAyat, nextAyah.audio['05']);
          }
        } else {
          setPlayingAyah(null);
        }
      };
    }
  }, [playingAyah, surah, updateLastRead]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  // Scroll to specific ayat from hash (e.g., #ayat-5)
  useEffect(() => {
    if (surah && location.hash) {
      const match = location.hash.match(/#ayat-(\d+)/);
      if (match) {
        const ayatNumber = parseInt(match[1], 10);
        // Small delay to ensure DOM is ready
        setTimeout(() => {
          const element = document.getElementById(`ayat-${ayatNumber}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    }
  }, [surah, location.hash]);

  // Get tafsir for specific ayah
  const getTafsir = (ayahNumber: number) => {
    return tafsirData?.tafsir.find((t) => t.ayat === ayahNumber);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto">
          <div className="h-32 skeleton-shimmer rounded-2xl mb-6" />
          <VerseListSkeleton />
        </div>
      </Layout>
    );
  }

  if (!surah) {
    return (
      <Layout>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Surah tidak ditemukan</p>
          <Link to="/surah">
            <Button className="mt-4">Kembali ke Daftar Surah</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Surah Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 md:p-8 mb-6 text-center"
        >
          <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary mb-4">
            {surah.tempatTurun === 'Mekah' ? 'Makkiyah' : 'Madaniyah'} • {surah.jumlahAyat} Ayat
          </span>
          
          <h1 className="font-arabic text-4xl md:text-5xl text-primary mb-2">
            {surah.nama}
          </h1>
          <h2 className="text-xl md:text-2xl font-semibold mb-1">
            {surah.namaLatin}
          </h2>
          <p className="text-muted-foreground">
            {surah.arti}
          </p>

          {/* Deskripsi Surah */}
          {surah.deskripsi && (
            <div
              className="mt-6 pt-6 border-t border-border/50 text-sm text-muted-foreground text-left leading-relaxed prose prose-sm max-w-none dark:prose-invert"
              dangerouslySetInnerHTML={{ __html: surah.deskripsi }}
            />
          )}

          {/* Bismillah for non-At-Taubah surahs */}
          {number !== 9 && number !== 1 && (
            <div className="mt-6 pt-6 border-t border-border/50">
              <p className="font-arabic text-2xl text-foreground/80">
                بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
              </p>
            </div>
          )}
        </motion.div>

        {/* Reading Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center justify-center gap-2 mb-6"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTransliteration(!showTransliteration)}
            className={cn(showTransliteration && 'bg-primary/10 border-primary/30')}
          >
            {showTransliteration ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
            Latin
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowTranslation(!showTranslation)}
            className={cn(showTranslation && 'bg-primary/10 border-primary/30')}
          >
            {showTranslation ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
            Terjemahan
          </Button>
          {playingAyah && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                audioRef.current?.pause();
                setPlayingAyah(null);
              }}
              className="bg-destructive/10 border-destructive/30 text-destructive"
            >
              <Volume2 className="h-4 w-4 mr-2 animate-pulse" />
              Stop Audio
            </Button>
          )}
        </motion.div>

        {/* Verses */}
        <div className="space-y-4">
          {surah.ayat.map((ayah) => (
            <div key={ayah.nomorAyat} id={`ayat-${ayah.nomorAyat}`}>
              <VerseCard
                ayah={ayah}
                surahNumber={number}
                tafsir={getTafsir(ayah.nomorAyat)}
                arabicSize={settings.arabicFontSize}
                showTransliteration={showTransliteration}
                showTranslation={showTranslation}
                isPlaying={playingAyah === ayah.nomorAyat}
                onPlay={() => handlePlayAyah(ayah.nomorAyat, ayah.audio['05'])}
                onAyahVisible={() => updateLastRead(ayah.nomorAyat)}
              />
            </div>
          ))}
        </div>

        {/* Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex items-center justify-between mt-8 pt-8 border-t border-border"
        >
          {surah.suratSebelumnya ? (
            <Link to={`/surah/${surah.suratSebelumnya.nomor}`}>
              <Button variant="outline" className="gap-2">
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">{surah.suratSebelumnya.namaLatin}</span>
                <span className="sm:hidden">Prev</span>
              </Button>
            </Link>
          ) : (
            <div />
          )}

          <Link to="/surah">
            <Button variant="ghost" size="sm">
              <BookOpen className="h-4 w-4 mr-2" />
              Daftar Surah
            </Button>
          </Link>

          {surah.suratSelanjutnya ? (
            <Link to={`/surah/${surah.suratSelanjutnya.nomor}`}>
              <Button variant="outline" className="gap-2">
                <span className="hidden sm:inline">{surah.suratSelanjutnya.namaLatin}</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          ) : (
            <div />
          )}
        </motion.div>
      </div>
    </Layout>
  );
}
