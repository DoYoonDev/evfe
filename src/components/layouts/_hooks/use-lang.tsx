import { useEffect, useState } from 'react';

import { LANG_STORAGE_KEY } from '@/constants/common';
import i18n from '@/locales/i18n';

export type Lang = 'ko' | 'en';

export const useLang = () => {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY) as Lang | null;
      if (stored === 'ko' || stored === 'en') return stored;
    }
    return 'ko';
  });

  useEffect(() => {
    window.localStorage.setItem(LANG_STORAGE_KEY, lang);
    i18n.changeLanguage(lang);
  }, [lang]);

  return { lang, setLang };
};
