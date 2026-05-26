import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import type { Surah } from '@/types/quran';
import { cn } from '@/lib/utils';

interface SurahCardProps {
  surah: Surah;
  index: number;
}

export function SurahCard({ surah, index }: SurahCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.02 }}
    >
      <Link to={`/surah/${surah.nomor}`}>
        <div className="surah-card group">
          <div className="flex items-center gap-4">
            {/* Number Badge */}
            <div className="relative flex h-12 w-12 flex-shrink-0 items-center justify-center">
              <div className="absolute inset-0 rounded-xl gradient-primary opacity-10 group-hover:opacity-20 transition-opacity" />
              <span className="font-semibold text-primary">{surah.nomor}</span>
            </div>

            {/* Surah Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-foreground truncate">
                  {surah.namaLatin}
                </h3>
                <span className="font-arabic text-xl text-primary shrink-0">
                  {surah.nama}
                </span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full font-medium',
                  surah.tempatTurun === 'Mekah' 
                    ? 'bg-primary/15 text-primary' 
                    : 'bg-secondary/20 text-secondary'
                )}>
                  {surah.tempatTurun}
                </span>
                <span className="text-xs text-muted-foreground">
                  {surah.jumlahAyat} Ayat
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
                {surah.arti}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
