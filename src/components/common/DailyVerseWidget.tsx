import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RefreshCw, Copy, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useSurahDetail } from "@/hooks/useQuranApi";
import { toast } from "sonner";

// Curated list of inspiring verses (surah:ayah)
const INSPIRING_VERSES = [
  { surah: 2, ayah: 286 }, // Allah does not burden a soul beyond capacity
  { surah: 94, ayah: 5 }, // With hardship comes ease
  { surah: 94, ayah: 6 }, // Indeed, with hardship comes ease
  { surah: 3, ayah: 139 }, // Do not weaken or grieve
  { surah: 2, ayah: 152 }, // Remember Me, I will remember you
  { surah: 13, ayah: 28 }, // Hearts find rest in remembrance of Allah
  { surah: 65, ayah: 3 }, // Whoever relies on Allah, He is sufficient
  { surah: 2, ayah: 186 }, // I am near, I respond to the caller
  { surah: 39, ayah: 53 }, // Do not despair of Allah's mercy
  { surah: 3, ayah: 173 }, // Allah is sufficient for us
  { surah: 9, ayah: 40 }, // Do not grieve, Allah is with us
  { surah: 8, ayah: 46 }, // Be patient, Allah is with the patient
  { surah: 16, ayah: 97 }, // Whoever does good, We will give them a good life
  { surah: 29, ayah: 69 }, // Those who strive, We guide to Our ways
  { surah: 2, ayah: 45 }, // Seek help through patience and prayer
  { surah: 3, ayah: 159 }, // Put your trust in Allah
  { surah: 42, ayah: 36 }, // What is with Allah is better
  { surah: 73, ayah: 8 }, // Devote yourself to Him completely
  { surah: 20, ayah: 114 }, // My Lord, increase me in knowledge
  { surah: 112, ayah: 1 }, // Say, He is Allah, the One
];

function getDailyVerse(): { surah: number; ayah: number } {
  // Use the current date as a seed to get a consistent verse for the day
  const today = new Date();
  const dateString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < dateString.length; i++) {
    const char = dateString.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }

  const index = Math.abs(hash) % INSPIRING_VERSES.length;
  return INSPIRING_VERSES[index];
}

export function DailyVerseWidget() {
  const [dailyVerse, setDailyVerse] = useState(getDailyVerse);
  const [copied, setCopied] = useState(false);

  const { data: surah, isLoading } = useSurahDetail(dailyVerse.surah);

  const ayah = surah?.ayat.find((a) => a.nomorAyat === dailyVerse.ayah);

  const handleCopy = async () => {
    if (!ayah || !surah) return;
    const text = `${ayah.teksArab}\n\n"${ayah.teksIndonesia}"\n\n— QS. ${surah.namaLatin} : ${ayah.nomorAyat}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success("Ayat disalin ke clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRefresh = () => {
    // Get a random verse (not date-based)
    const randomIndex = Math.floor(Math.random() * INSPIRING_VERSES.length);
    setDailyVerse(INSPIRING_VERSES[randomIndex]);
  };

  if (isLoading) {
    return (
      <div className="glass-card rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-secondary animate-pulse" />
          <span className="text-sm font-medium text-muted-foreground">
            Ayat Hari Ini
          </span>
        </div>
        <div className="space-y-4">
          <div className="h-12 skeleton-shimmer rounded-lg" />
          <div className="h-6 skeleton-shimmer rounded w-3/4" />
          <div className="h-4 skeleton-shimmer rounded w-1/2" />
        </div>
      </div>
    );
  }

  if (!ayah || !surah) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card rounded-3xl p-6 md:p-8 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-secondary" />
            <span className="text-sm font-medium text-muted-foreground">
              Ayat Hari Ini
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleRefresh}
              title="Ayat lainnya"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleCopy}
              title="Salin ayat"
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
        <p className="font-arabic text-2xl md:text-3xl text-foreground leading-loose text-right mb-6">
          {ayah.teksArab}
        </p>

        {/* Translation */}
        <p className="text-muted-foreground leading-relaxed mb-6 italic">
          "{ayah.teksIndonesia}"
        </p>

        {/* Source & Link */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <div>
            <p className="text-sm font-medium text-primary">
              QS. {surah.namaLatin} : {ayah.nomorAyat}
            </p>
            <p className="text-xs text-muted-foreground">{surah.arti}</p>
          </div>
          <Link to={`/surah/${dailyVerse.surah}#ayah-${dailyVerse.ayah}`}>
            <Button variant="outline" size="sm" className="gap-2">
              Baca Surah
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
