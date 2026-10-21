import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { useLocation } from 'react-router';

import { GlobalErrorFallback } from './global-error-fallback';

export const GlobalBoundary = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  return (
    <ErrorBoundary
      FallbackComponent={GlobalErrorFallback}
      resetKeys={[location.pathname]}
      onError={(error, info) => {
        if (import.meta.env.DEV) {
          console.error('[GlobalBoundary]', error, info);
        }
      }}
    >
      <Suspense>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};
