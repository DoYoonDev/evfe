import { useEffect } from 'react';

export const LightOnly = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const root = document.documentElement;
    const hadDark = root.classList.contains('dark');

    if (hadDark) root.classList.remove('dark');
    root.dataset.themeLocked = 'light';

    return () => {
      if (hadDark) root.classList.add('dark');
      delete root.dataset.themeLocked;
    };
  }, []);

  return <>{children}</>;
}
