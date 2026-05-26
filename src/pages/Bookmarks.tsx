import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Bookmark, Trash2, ExternalLink, BookOpen } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { useBookmarks } from '@/hooks/useLocalStorage';
import { useSurahList } from '@/hooks/useQuranApi';
import { toast } from 'sonner';

interface ParsedBookmark {
  key: string;
  surahNumber: number;
  ayahNumber: number;
}

export default function Bookmarks() {
  const { bookmarks, removeBookmark } = useBookmarks();
  const { data: surahs } = useSurahList();
  const [removingKey, setRemovingKey] = useState<string | null>(null);

  const parsedBookmarks: ParsedBookmark[] = bookmarks.map((key) => {
    const [surahNumber, ayahNumber] = key.split(':').map(Number);
    return { key, surahNumber, ayahNumber };
  });

  const getSurahInfo = (surahNumber: number) => {
    return surahs?.find((s) => s.nomor === surahNumber);
  };

  const handleRemove = (key: string) => {
    setRemovingKey(key);
    setTimeout(() => {
      removeBookmark(key);
      setRemovingKey(null);
      toast.success('Bookmark removed');
    }, 300);
  };

  const handleClearAll = () => {
    bookmarks.forEach((key) => removeBookmark(key));
    toast.success('All bookmarks cleared');
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-6 md:p-8 mb-6 text-center"
        >
          <div className="flex items-center justify-center gap-3 mb-2">
            <Bookmark className="h-8 w-8 text-secondary" />
            <h1 className="text-2xl md:text-3xl font-bold">Bookmarks</h1>
          </div>
          <p className="text-muted-foreground">
            {bookmarks.length === 0
              ? 'Belum ada bookmark'
              : `${bookmarks.length} ayat tersimpan`}
          </p>
        </motion.div>

        {/* Clear All Button */}
        {bookmarks.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-end mb-4"
          >
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </motion.div>
        )}

        {/* Bookmarks List */}
        {bookmarks.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <BookOpen className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground mb-4">
              Mulai membaca dan simpan ayat favorit Anda
            </p>
            <Link to="/surah">
              <Button className="gradient-primary">
                Browse Surahs
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {parsedBookmarks.map((bookmark, index) => {
                const surah = getSurahInfo(bookmark.surahNumber);
                const isRemoving = removingKey === bookmark.key;

                return (
                  <motion.div
                    key={bookmark.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: isRemoving ? 0 : 1, 
                      y: 0,
                      scale: isRemoving ? 0.95 : 1,
                    }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="glass-card rounded-2xl p-4 md:p-5"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 min-w-0">
                        {/* Verse Number Badge */}
                        <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl gradient-primary text-sm font-semibold text-primary-foreground">
                          {bookmark.ayahNumber}
                        </div>

                        {/* Surah Info */}
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-arabic text-lg text-primary">
                              {surah?.nama || '...'}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {surah?.namaLatin || `Surah ${bookmark.surahNumber}`}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Ayat {bookmark.ayahNumber} • {surah?.arti || ''}
                          </p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Link to={`/surah/${bookmark.surahNumber}#ayat-${bookmark.ayahNumber}`}>
                          <Button variant="ghost" size="icon" className="h-9 w-9">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 text-destructive hover:bg-destructive/10"
                          onClick={() => handleRemove(bookmark.key)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        {/* Back to Surah List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mt-8"
        >
          <Link to="/surah">
            <Button variant="ghost">
              <BookOpen className="h-4 w-4 mr-2" />
              Browse All Surahs
            </Button>
          </Link>
        </motion.div>
      </div>
    </Layout>
  );
}
