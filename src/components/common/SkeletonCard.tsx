import { motion } from 'framer-motion';

export function SurahCardSkeleton() {
  return (
    <div className="surah-card">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 skeleton-shimmer rounded-xl" />
        <div className="flex-1 space-y-2">
          <div className="flex justify-between">
            <div className="h-5 w-24 skeleton-shimmer" />
            <div className="h-5 w-16 skeleton-shimmer" />
          </div>
          <div className="flex gap-2">
            <div className="h-4 w-16 skeleton-shimmer rounded-full" />
            <div className="h-4 w-12 skeleton-shimmer" />
          </div>
          <div className="h-3 w-32 skeleton-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function VerseCardSkeleton() {
  return (
    <div className="verse-card">
      <div className="flex items-center justify-between mb-4">
        <div className="h-8 w-8 skeleton-shimmer rounded-full" />
        <div className="flex gap-1">
          <div className="h-8 w-8 skeleton-shimmer rounded" />
          <div className="h-8 w-8 skeleton-shimmer rounded" />
          <div className="h-8 w-8 skeleton-shimmer rounded" />
        </div>
      </div>
      <div className="h-12 w-full skeleton-shimmer mb-4" />
      <div className="h-4 w-3/4 skeleton-shimmer mb-3" />
      <div className="space-y-2">
        <div className="h-4 w-full skeleton-shimmer" />
        <div className="h-4 w-5/6 skeleton-shimmer" />
      </div>
    </div>
  );
}

export function SurahListSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <SurahCardSkeleton key={i} />
      ))}
    </motion.div>
  );
}

export function VerseListSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-4"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <VerseCardSkeleton key={i} />
      ))}
    </motion.div>
  );
}
