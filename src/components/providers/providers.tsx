'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { MotionProvider } from '@/components/providers/motion-provider';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider>
        <ThemeProvider defaultTheme="dark" storageKey="football-ui-theme">
          <MotionProvider>{children}</MotionProvider>
        </ThemeProvider>
      </SessionProvider>
    </QueryClientProvider>
  );
}
