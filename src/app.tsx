import '@/locales/i18n';

import { QueryClientProvider } from '@tanstack/react-query';
//import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';

import { GlobalBoundary } from '@/components/boundary';
import { ThemeProvider } from '@/components/layouts';
import { queryClient } from '@/config/query-client.ts';
import { Router } from '@/router';

import { DialogProvider } from './hooks/use-dialog';

export const App = () => {
  return (
    <ThemeProvider defaultTheme="system">
      <QueryClientProvider client={queryClient}>
        <GlobalBoundary>
          <DialogProvider>
            <Router />
          </DialogProvider>
        </GlobalBoundary>
        <Toaster richColors />
        {/* 개발 시 문제 원인 추적에 도움 */}
        {/*
        <ReactQueryDevtools initialIsOpen={false} />
        */}
      </QueryClientProvider>
    </ThemeProvider>
  );
};
