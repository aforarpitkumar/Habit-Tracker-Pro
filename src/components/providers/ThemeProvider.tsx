'use client';

import { useEffect } from 'react';
import { useAppearanceStore } from '@/lib/stores/appearanceStore';
import { AppearanceShortcuts } from '@/lib/hooks/useAppearanceShortcuts';

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const initializeSettings = useAppearanceStore((state) => state.initializeSettings);
  const isInitialized = useAppearanceStore((state) => state.isInitialized);
  const settings = useAppearanceStore((state) => state.settings);
  const setTheme = useAppearanceStore((state) => state.setTheme);
  const setPrimaryColor = useAppearanceStore((state) => state.setPrimaryColor);
  const setCustomPrimaryColor = useAppearanceStore((state) => state.setCustomPrimaryColor);
  const setFontSize = useAppearanceStore((state) => state.setFontSize);
  const setReducedMotion = useAppearanceStore((state) => state.setReducedMotion);
  const setHighContrast = useAppearanceStore((state) => state.setHighContrast);

  useEffect(() => {
    if (!isInitialized) {
      initializeSettings();
    }
  }, [initializeSettings, isInitialized]);



  return (
    <>
      <AppearanceShortcuts />
      {children}
    </>
  );
}