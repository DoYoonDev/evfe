import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

export const LoadingView = ({ className = 'h-[40vh]' }: { className?: string }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground',
        className
      )}
    >
      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" aria-hidden="true" />
      <span className="sr-only">Loading...</span>
      <span>Loading...</span>
    </div>
  );
}
