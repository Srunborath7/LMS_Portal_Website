'use client';

import { useContext } from 'react';
import { LanguageContext } from '@/src/shared/providers/LanguageProvider';

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
