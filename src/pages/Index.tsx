import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { BookOpen, ArrowRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { SurahCard } from '@/components/common/SurahCard';
import { SurahListSkeleton } from '@/components/common/SkeletonCard';
import { DailyVerseWidget } from '@/components/common/DailyVerseWidget';
import { useSurahList } from '@/hooks/useQuranApi';
import { useLastRead } from '@/hooks/useLocalStorage';

export default function Index() {
  const { data: surahs, isLoading } = useSurahList();
  const { lastRead } = useLastRead();

  return (
    <Layout>
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-10"
      >
        <div className="relative overflow-hidden rounded-3xl gradient-primary p-8 md:p-12">
          {/* Decorative Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 border-2 border-current rounded-full" />
            <div className="absolute bottom-4 left-4 w-24 h-24 border-2 border-current rotate-45" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-current rounded-full" />
          </div>

          <div className="relative z-10 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-4"
            >
              <Star className="h-5 w-5 text-primary-foreground/80 fill-current" />
              <span className="text-sm text-primary-foreground/80 font-medium">
                Baca Al-Qur'an dengan Tenang
              </span>
            </motion.div>

            <h1 className="font-arabic text-4xl md:text-5xl text-primary-foreground mb-2">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </h1>
            <p className="text-primary-foreground/90 text-lg md:text-xl mt-4 leading-relaxed">
              Dengan nama Allah Yang Maha Pengasih, Maha Penyayang
            </p>

            <div className="flex flex-wrap gap-3 mt-8">
              <Link to="/surah">
                <Button 
                  size="lg" 
                  className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 shadow-lg"
                >
                  <BookOpen className="h-5 w-5" />
                  Mulai Membaca
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Daily Verse Widget */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-10"
      >
        <DailyVerseWidget />
      </motion.section>

      {/* Continue Reading */}
      {lastRead && (
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Lanjutkan Membaca
          </h2>
          <Link to={`/surah/${lastRead.surahNumber}#ayah-${lastRead.ayahNumber}`}>
            <div className="glass-card rounded-2xl p-6 group hover:shadow-glow transition-all">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Terakhir dibaca
                  </p>
                  <h3 className="font-semibold text-lg">{lastRead.surahNameLatin}</h3>
                  <p className="text-sm text-muted-foreground">
                    Surah {lastRead.surahNumber} : Ayat {lastRead.ayahNumber}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-arabic text-2xl text-primary">
                    {lastRead.surahName}
                  </span>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <ArrowRight className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.section>
      )}

      {/* Quick Access Surahs */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Daftar Surah</h2>
          <Link to="/surah">
            <Button variant="ghost" size="sm" className="gap-1 text-primary">
              Lihat Semua
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <SurahListSkeleton />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {surahs?.slice(0, 6).map((surah, index) => (
              <SurahCard key={surah.nomor} surah={surah} index={index} />
            ))}
          </div>
        )}
      </motion.section>
    </Layout>
  );
}
