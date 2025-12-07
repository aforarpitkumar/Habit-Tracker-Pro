'use client';

import { useEffect } from 'react';
import { useAppearanceStore } from '@/lib/stores/appearanceStore';

// Keyboard shortcuts for appearance settings
export function useAppearanceShortcuts() {
  const { 
    settings, 
    setTheme, 
    setPrimaryColor, 
    setGridSize, 
    setFontSize, 
    setBackgroundPattern 
  } = useAppearanceStore();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only trigger if Ctrl/Cmd + Shift are pressed
      if (!(event.ctrlKey || event.metaKey) || !event.shiftKey) return;
      
      switch (event.key.toLowerCase()) {
        case 't':
          // Ctrl/Cmd + Shift + T: Toggle theme
          event.preventDefault();
          const nextTheme = settings.theme === 'light' ? 'dark' : settings.theme === 'dark' ? 'system' : 'light';
          setTheme(nextTheme);
          showShortcutNotification(`Theme: ${nextTheme}`);
          break;
          
        case 'c':
          // Ctrl/Cmd + Shift + C: Cycle through colors
          event.preventDefault();
          const colors = ['blue', 'green', 'purple', 'orange', 'red', 'pink', 'indigo', 'teal'] as const;
          const currentIndex = colors.indexOf(settings.primaryColor as any);
          const nextIndex = (currentIndex + 1) % colors.length;
          setPrimaryColor(colors[nextIndex]);
          showShortcutNotification(`Color: ${colors[nextIndex]}`);
          break;
          
        case 'g':
          // Ctrl/Cmd + Shift + G: Cycle grid size
          event.preventDefault();
          const gridSizes = ['small', 'medium', 'large'] as const;
          const currentGridIndex = gridSizes.indexOf(settings.gridSize);
          const nextGridIndex = (currentGridIndex + 1) % gridSizes.length;
          setGridSize(gridSizes[nextGridIndex]);
          showShortcutNotification(`Grid: ${gridSizes[nextGridIndex]}`);
          break;
          
        case 'f':
          // Ctrl/Cmd + Shift + F: Cycle font size
          event.preventDefault();
          const fontSizes = ['small', 'medium', 'large'] as const;
          const currentFontIndex = fontSizes.indexOf(settings.fontSize);
          const nextFontIndex = (currentFontIndex + 1) % fontSizes.length;
          setFontSize(fontSizes[nextFontIndex]);
          showShortcutNotification(`Font: ${fontSizes[nextFontIndex]}`);
          break;
          
        case 'b':
          // Ctrl/Cmd + Shift + B: Cycle background patterns
          event.preventDefault();
          const patterns = ['none', 'dots', 'grid', 'waves', 'gradient'] as const;
          const currentPatternIndex = patterns.indexOf(settings.backgroundPattern);
          const nextPatternIndex = (currentPatternIndex + 1) % patterns.length;
          setBackgroundPattern(patterns[nextPatternIndex]);
          showShortcutNotification(`Background: ${patterns[nextPatternIndex]}`);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [settings, setTheme, setPrimaryColor, setGridSize, setFontSize, setBackgroundPattern]);
}

// Simple notification function for shortcuts
function showShortcutNotification(message: string) {
  // Create a temporary notification element
  const notification = document.createElement('div');
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: hsl(var(--primary));
    color: hsl(var(--primary-foreground));
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 500;
    z-index: 9999;
    pointer-events: none;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  requestAnimationFrame(() => {
    notification.style.opacity = '1';
    notification.style.transform = 'translateY(0)';
  });
  
  // Remove after 2 seconds
  setTimeout(() => {
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 2000);
}

// Component to initialize shortcuts
export function AppearanceShortcuts() {
  useAppearanceShortcuts();
  return null;
}