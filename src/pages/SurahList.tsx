import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { SurahCard } from '@/components/common/SurahCard';
import { SurahListSkeleton } from '@/components/common/SkeletonCard';
import { useSurahList } from '@/hooks/useQuranApi';
import { cn } from '@/lib/utils';

type FilterType = 'all' | 'Mekah' | 'Madinah';

export default function SurahList() {
  const { data: surahs, isLoading } = useSurahList();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredSurahs = useMemo(() => {
    if (!surahs) return [];
    
    return surahs.filter((surah) => {
      const matchesSearch =
        surah.namaLatin.toLowerCase().includes(search.toLowerCase()) ||
        surah.nama.includes(search) ||
        surah.arti.toLowerCase().includes(search.toLowerCase()) ||
        surah.nomor.toString().includes(search);
      
      const matchesFilter = filter === 'all' || surah.tempatTurun === filter;
      
      return matchesSearch && matchesFilter;
    });
  }, [surahs, search, filter]);

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: 'Semua', value: 'all' },
    { label: 'Makkiyah', value: 'Mekah' },
    { label: 'Madaniyah', value: 'Madinah' },
  ];

  return (
    <Layout>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Daftar Surah</h1>
        <p className="text-muted-foreground">
          114 Surah dalam Al-Qur'an
        </p>
      </motion.div>

      {/* Search & Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card rounded-2xl p-4 mb-6 space-y-4"
      >
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari surah berdasarkan nama atau nomor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background/50"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-2">
            {filterButtons.map((btn) => (
              <Button
                key={btn.value}
                variant="ghost"
                size="sm"
                onClick={() => setFilter(btn.value)}
                className={cn(
                  'transition-all',
                  filter === btn.value
                    ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                    : 'hover:bg-primary/10'
                )}
              >
                {btn.label}
              </Button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Results Count */}
      {!isLoading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-muted-foreground mb-4"
        >
          Menampilkan {filteredSurahs.length} surah
        </motion.p>
      )}

      {/* Surah List */}
      {isLoading ? (
        <SurahListSkeleton />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredSurahs.map((surah, index) => (
            <SurahCard key={surah.nomor} surah={surah} index={index} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredSurahs.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground">
            Tidak ditemukan surah dengan pencarian "{search}"
          </p>
        </motion.div>
      )}
    </Layout>
  );
}
