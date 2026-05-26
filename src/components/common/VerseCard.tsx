import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Bookmark, BookmarkCheck, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Ayah, TafsirAyat } from '@/types/quran';
import { cn } from '@/lib/utils';
import { useBookmarks } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';

interface VerseCardProps {
  ayah: Ayah;
  surahNumber: number;
  tafsir?: TafsirAyat;
  arabicSize: 'sm' | 'md' | 'lg' | 'xl';
  showTransliteration: boolean;
  showTranslation: boolean;
  isPlaying: boolean;
  onPlay: () => void;
  onAyahVisible?: () => void;
}

export function VerseCard({
  ayah,
  surahNumber,
  tafsir,
  arabicSize,
  showTransliteration,
  showTranslation,
  isPlaying,
  onPlay,
  onAyahVisible,
}: VerseCardProps) {
  const [showTafsir, setShowTafsir] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isBookmarked, addBookmark, removeBookmark } = useBookmarks();
  const cardRef = useRef<HTMLDivElement>(null);
  
  const bookmarkKey = `${surahNumber}:${ayah.nomorAyat}`;
  const bookmarked = isBookmarked(bookmarkKey);

  useEffect(() => {
    if (isPlaying && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      onAyahVisible?.();
    }
    // Only re-run when playback state toggles, so the user can scroll freely
    // while audio continues to play.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying]);

  const handleBookmark = () => {
    if (bookmarked) {
      removeBookmark(bookmarkKey);
      toast.success('Bookmark removed');
    } else {
      addBookmark(bookmarkKey);
      toast.success('Ayah bookmarked');
    }
  };

  const handleCopy = async () => {
    const text = `${ayah.teksArab}\n\n${ayah.teksIndonesia}\n\n(QS. ${surahNumber}:${ayah.nomorAyat})`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'verse-card',
        isPlaying && 'ring-2 ring-primary/30 bg-verse-highlight'
      )}
    >
      {/* Verse Number & Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full gradient-primary text-xs font-semibold text-primary-foreground">
          {ayah.nomorAyat}
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onPlay}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-primary" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleBookmark}
          >
            {bookmarked ? (
              <BookmarkCheck className="h-4 w-4 text-secondary" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {/* Arabic Text */}
      <p className={cn('arabic-text mb-4', `arabic-${arabicSize}`)}>
        {ayah.teksArab}
      </p>

      {/* Transliteration */}
      <AnimatePresence>
        {showTransliteration && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-sm italic text-primary/80 mb-3"
          >
            {ayah.teksLatin}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Translation */}
      <AnimatePresence>
        {showTranslation && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-muted-foreground leading-relaxed"
          >
            {ayah.teksIndonesia}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Tafsir Toggle */}
      {tafsir && (
        <div className="mt-4 pt-4 border-t border-border/50">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-between text-primary"
            onClick={() => setShowTafsir(!showTafsir)}
          >
            <span>Tafsir</span>
            {showTafsir ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          <AnimatePresence>
            {showTafsir && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div 
                  className="mt-3 p-4 rounded-xl bg-muted/50 text-sm text-muted-foreground leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: tafsir.teks }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
