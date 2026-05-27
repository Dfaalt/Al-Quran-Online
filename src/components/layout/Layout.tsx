import type { ReactNode } from 'react';
import { Header } from './Header';
import { ScrollToTop } from '@/components/common/ScrollToTop';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background islamic-pattern">
      <Header />
      <main className="container py-6 md:py-8">
        {children}
      </main>
      <ScrollToTop />
    </div>
  );
}
