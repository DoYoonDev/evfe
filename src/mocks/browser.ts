import { setupWorker } from 'msw/browser';
import { sampleHandlers } from './handlers/sample-handlers.ts';
// import { menuHandlers } from './handlers/menu-handlers.ts';

export const worker = setupWorker(
  ...sampleHandlers,
  // ...menuHandlers
);
