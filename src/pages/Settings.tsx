import { motion } from 'framer-motion';
import { Sun, Moon, BookOpen, Type, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/layout/Layout';
import { useSettings } from '@/hooks/useLocalStorage';
import { cn } from '@/lib/utils';
import type { AppSettings } from '@/types/quran';

export default function Settings() {
  const { settings, updateSettings } = useSettings();

  const themes: { value: AppSettings['theme']; label: string; icon: React.ReactNode; description: string }[] = [
    { value: 'light', label: 'Terang', icon: <Sun className="h-5 w-5" />, description: 'Tema terang yang nyaman untuk membaca di siang hari' },
    { value: 'dark', label: 'Gelap', icon: <Moon className="h-5 w-5" />, description: 'Tema gelap yang nyaman untuk membaca di malam hari' },
    { value: 'sepia', label: 'Sepia', icon: <BookOpen className="h-5 w-5" />, description: 'Tema hangat seperti kertas klasik' },
  ];

  const fontSizes: { value: AppSettings['arabicFontSize']; label: string; preview: string }[] = [
    { value: 'sm', label: 'Kecil', preview: 'بِسْمِ' },
    { value: 'md', label: 'Sedang', preview: 'بِسْمِ' },
    { value: 'lg', label: 'Besar', preview: 'بِسْمِ' },
    { value: 'xl', label: 'Sangat Besar', preview: 'بِسْمِ' },
  ];

  return (
    <Layout>
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Pengaturan</h1>
          <p className="text-muted-foreground">
            Sesuaikan tampilan dan pengalaman membaca Anda
          </p>
        </motion.div>

        {/* Theme Selection */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Sun className="h-5 w-5 text-primary" />
            Tema
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {themes.map((theme) => (
              <button
                key={theme.value}
                onClick={() => updateSettings({ theme: theme.value })}
                className={cn(
                  'relative p-4 rounded-xl border-2 transition-all text-left',
                  settings.theme === theme.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                {settings.theme === theme.value && (
                  <div className="absolute top-2 right-2 h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-3 w-3 text-primary-foreground" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div className={cn(
                    'h-10 w-10 rounded-lg flex items-center justify-center',
                    settings.theme === theme.value ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  )}>
                    {theme.icon}
                  </div>
                  <span className="font-medium">{theme.label}</span>
                </div>
                <p className="text-xs text-muted-foreground">{theme.description}</p>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Font Size */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card rounded-2xl p-6 mb-6"
        >
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            Ukuran Font Arab
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {fontSizes.map((size) => (
              <button
                key={size.value}
                onClick={() => updateSettings({ arabicFontSize: size.value })}
                className={cn(
                  'relative p-4 rounded-xl border-2 transition-all text-center',
                  settings.arabicFontSize === size.value
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                )}
              >
                {settings.arabicFontSize === size.value && (
                  <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary flex items-center justify-center">
                    <Check className="h-2.5 w-2.5 text-primary-foreground" />
                  </div>
                )}
                <p className={cn(
                  'font-arabic mb-2',
                  size.value === 'sm' && 'text-lg',
                  size.value === 'md' && 'text-2xl',
                  size.value === 'lg' && 'text-3xl',
                  size.value === 'xl' && 'text-4xl',
                )}>
                  {size.preview}
                </p>
                <p className="text-xs text-muted-foreground">{size.label}</p>
              </button>
            ))}
          </div>
        </motion.section>

        {/* Display Options */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card rounded-2xl p-6"
        >
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Tampilan
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tampilkan Transliterasi</p>
                <p className="text-sm text-muted-foreground">Teks latin untuk membantu membaca</p>
              </div>
              <Button
                variant={settings.showTransliteration ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSettings({ showTransliteration: !settings.showTransliteration })}
              >
                {settings.showTransliteration ? 'Aktif' : 'Nonaktif'}
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Tampilkan Terjemahan</p>
                <p className="text-sm text-muted-foreground">Terjemahan Bahasa Indonesia</p>
              </div>
              <Button
                variant={settings.showTranslation ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateSettings({ showTranslation: !settings.showTranslation })}
              >
                {settings.showTranslation ? 'Aktif' : 'Nonaktif'}
              </Button>
            </div>
          </div>
        </motion.section>
      </div>
    </Layout>
  );
}
