import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Theme types
export type Theme = 'light' | 'dark' | 'system';
export type PrimaryColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink' | 'indigo' | 'teal' | 'custom';
export type GridSize = 'small' | 'medium' | 'large';
export type FontSize = 'small' | 'medium' | 'large';

// Phase 2 types
export type AnimationSpeed = 'none' | 'slow' | 'normal' | 'fast';
export type LayoutDensity = 'compact' | 'comfortable' | 'spacious';
export type CardStyle = 'minimal' | 'standard' | 'detailed';
export type BackgroundPattern = 'none' | 'dots' | 'grid' | 'waves' | 'gradient';

// Appearance settings interface
export interface AppearanceSettings {
  // Phase 1 settings
  theme: Theme;
  primaryColor: PrimaryColor;
  gridSize: GridSize;
  fontSize: FontSize;
  reducedMotion: boolean;
  highContrast: boolean;
  
  // Phase 2 settings
  animationSpeed: AnimationSpeed;
  layoutDensity: LayoutDensity;
  cardStyle: CardStyle;
  backgroundPattern: BackgroundPattern;
  customPrimaryColor?: string; // For custom color picker
  enableSmoothScrolling: boolean;
  enableHoverEffects: boolean;
  borderRadius: 'none' | 'small' | 'medium' | 'large';
}

// Store interface
interface AppearanceStore {
  // State
  settings: AppearanceSettings;
  isInitialized: boolean;
  
  // Phase 1 Actions
  setTheme: (theme: Theme) => void;
  setPrimaryColor: (color: PrimaryColor) => void;
  setGridSize: (size: GridSize) => void;
  setFontSize: (size: FontSize) => void;
  setReducedMotion: (enabled: boolean) => void;
  setHighContrast: (enabled: boolean) => void;
  
  // Phase 2 Actions
  setAnimationSpeed: (speed: AnimationSpeed) => void;
  setLayoutDensity: (density: LayoutDensity) => void;
  setCardStyle: (style: CardStyle) => void;
  setBackgroundPattern: (pattern: BackgroundPattern) => void;
  setCustomPrimaryColor: (color: string) => void;
  setSmoothScrolling: (enabled: boolean) => void;
  setHoverEffects: (enabled: boolean) => void;
  setBorderRadius: (radius: 'none' | 'small' | 'medium' | 'large') => void;
  
  // General Actions
  resetToDefaults: () => void;
  initializeSettings: () => void;
  exportTheme: () => string;
  importTheme: (themeJson: string) => boolean;
  
  // Computed
  getComputedTheme: () => 'light' | 'dark';
  getGridSizeClass: () => string;
  getFontSizeClass: () => string;
  getPrimaryColorCSS: () => Record<string, string>;
  getLayoutDensityClass: () => string;
  getCardStyleClass: () => string;
  getBorderRadiusClass: () => string;
  getAnimationDuration: () => string;
}

// Default settings
const defaultSettings: AppearanceSettings = {
  // Phase 1 settings
  theme: 'system',
  primaryColor: 'green',
  gridSize: 'medium',
  fontSize: 'medium',
  reducedMotion: false,
  highContrast: false,
  
  // Phase 2 settings
  animationSpeed: 'normal',
  layoutDensity: 'comfortable',
  cardStyle: 'standard',
  backgroundPattern: 'none',
  customPrimaryColor: undefined,
  enableSmoothScrolling: true,
  enableHoverEffects: true,
  borderRadius: 'medium',
};

// Color mappings for CSS custom properties
const colorMappings: Record<PrimaryColor, Record<string, string>> = {
  blue: {
    '--primary': '221 83% 53%',
    '--primary-foreground': '210 40% 98%',
    '--primary-hover': '221 83% 45%',
    '--ring': '221 83% 53%',
  },
  green: {
    '--primary': '142 76% 36%',
    '--primary-foreground': '355 100% 97%',
    '--primary-hover': '142 76% 30%',
    '--ring': '142 76% 36%',
  },
  purple: {
    '--primary': '262 83% 58%',
    '--primary-foreground': '210 40% 98%',
    '--primary-hover': '262 83% 50%',
    '--ring': '262 83% 58%',
  },
  orange: {
    '--primary': '25 95% 53%',
    '--primary-foreground': '210 40% 98%',
    '--primary-hover': '25 95% 45%',
    '--ring': '25 95% 53%',
  },
  red: {
    '--primary': '0 84% 60%',
    '--primary-foreground': '210 40% 98%',
    '--primary-hover': '0 84% 52%',
    '--ring': '0 84% 60%',
  },
  pink: {
    '--primary': '326 78% 68%',
    '--primary-foreground': '210 40% 98%',
    '--primary-hover': '326 78% 60%',
    '--ring': '326 78% 68%',
  },
  indigo: {
    '--primary': '239 84% 67%',
    '--primary-foreground': '210 40% 98%',
    '--primary-hover': '239 84% 59%',
    '--ring': '239 84% 67%',
  },
  teal: {
    '--primary': '173 80% 40%',
    '--primary-foreground': '210 40% 98%',
    '--primary-hover': '173 80% 32%',
    '--ring': '173 80% 40%',
  },
  custom: {
    '--primary': '221 83% 53%', // Default to blue, will be overridden
    '--primary-foreground': '210 40% 98%',
    '--primary-hover': '221 83% 45%',
    '--ring': '221 83% 53%',
  },
};

// Grid size classes
const gridSizeClasses: Record<GridSize, string> = {
  small: 'grid-cols-6 gap-2',
  medium: 'grid-cols-4 gap-3',
  large: 'grid-cols-3 gap-4',
};

// Font size classes
const fontSizeClasses: Record<FontSize, string> = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
};

// Animation speed mappings
const animationDurations: Record<AnimationSpeed, string> = {
  none: '0ms',
  slow: '500ms',
  normal: '300ms',
  fast: '150ms',
};

// Layout density classes
const layoutDensityClasses: Record<LayoutDensity, string> = {
  compact: 'gap-1 p-2',
  comfortable: 'gap-3 p-4',
  spacious: 'gap-6 p-6',
};

// Card style classes
const cardStyleClasses: Record<CardStyle, string> = {
  minimal: 'border-none shadow-none',
  standard: 'border shadow-sm',
  detailed: 'border-2 shadow-lg',
};

// Utility function to convert hex to HSL
function hexToHsl(hex: string): string {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16) / 255;
  const g = parseInt(hex.substr(2, 2), 16) / 255;
  const b = parseInt(hex.substr(4, 2), 16) / 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  
  return `${h} ${s}% ${l}%`;
}

// Border radius classes
const borderRadiusClasses: Record<string, string> = {
  none: 'rounded-none',
  small: 'rounded-sm',
  medium: 'rounded-md',
  large: 'rounded-lg',
};

export const useAppearanceStore = create<AppearanceStore>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: defaultSettings,
      isInitialized: false,
      
      // Actions
      setTheme: (theme: Theme) => {
        set((state) => ({
          settings: { ...state.settings, theme }
        }));
        
        // Apply theme immediately
        const computedTheme = theme === 'system' 
          ? window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
          : theme;
          
        document.documentElement.classList.toggle('dark', computedTheme === 'dark');
      },
      
      setPrimaryColor: (primaryColor: PrimaryColor) => {
        set((state) => ({
          settings: { ...state.settings, primaryColor }
        }));
        
        // Apply color CSS variables immediately
        const root = document.documentElement;
        const colors = colorMappings[primaryColor];
        Object.entries(colors).forEach(([property, value]) => {
          root.style.setProperty(property, value);
        });
      },
      
      setGridSize: (gridSize: GridSize) => {
        set((state) => ({
          settings: { ...state.settings, gridSize }
        }));
      },
      
      setFontSize: (fontSize: FontSize) => {
        set((state) => ({
          settings: { ...state.settings, fontSize }
        }));
        
        // Apply font size class to body element
        const body = document.body;
        body.classList.remove('text-sm', 'text-base', 'text-lg');
        body.classList.add(fontSizeClasses[fontSize]);
      },
      
      setReducedMotion: (reducedMotion: boolean) => {
        set((state) => ({
          settings: { ...state.settings, reducedMotion }
        }));
        
        // Apply reduced motion preference
        document.documentElement.style.setProperty(
          '--motion-reduce',
          reducedMotion ? '0' : '1'
        );
      },
      
      setHighContrast: (highContrast: boolean) => {
        set((state) => ({
          settings: { ...state.settings, highContrast }
        }));
        
        // Apply high contrast class
        document.documentElement.classList.toggle('high-contrast', highContrast);
      },
      
      // Phase 2 Actions
      setAnimationSpeed: (animationSpeed: AnimationSpeed) => {
        set((state) => ({
          settings: { ...state.settings, animationSpeed }
        }));
        
        // Apply animation duration CSS variable
        const duration = animationDurations[animationSpeed];
        document.documentElement.style.setProperty('--animation-duration', duration);
      },
      
      setLayoutDensity: (layoutDensity: LayoutDensity) => {
        set((state) => ({
          settings: { ...state.settings, layoutDensity }
        }));
      },
      
      setCardStyle: (cardStyle: CardStyle) => {
        set((state) => ({
          settings: { ...state.settings, cardStyle }
        }));
      },
      
      setBackgroundPattern: (backgroundPattern: BackgroundPattern) => {
        set((state) => ({
          settings: { ...state.settings, backgroundPattern }
        }));
        
        // Apply background pattern class
        const body = document.body;
        body.classList.remove('bg-pattern-dots', 'bg-pattern-grid', 'bg-pattern-waves', 'bg-pattern-gradient');
        if (backgroundPattern !== 'none') {
          body.classList.add(`bg-pattern-${backgroundPattern}`);
        }
      },
      
      setCustomPrimaryColor: (customPrimaryColor: string) => {
        set((state) => ({
          settings: { ...state.settings, customPrimaryColor, primaryColor: 'custom' }
        }));
        
        // Apply custom color CSS variables immediately
        const root = document.documentElement;
        // Convert hex to HSL for consistency
        const hslColor = hexToHsl(customPrimaryColor);
        root.style.setProperty('--primary', hslColor);
        root.style.setProperty('--ring', hslColor);
      },
      
      setSmoothScrolling: (enableSmoothScrolling: boolean) => {
        set((state) => ({
          settings: { ...state.settings, enableSmoothScrolling }
        }));
        
        // Apply smooth scrolling
        document.documentElement.style.scrollBehavior = enableSmoothScrolling ? 'smooth' : 'auto';
      },
      
      setHoverEffects: (enableHoverEffects: boolean) => {
        set((state) => ({
          settings: { ...state.settings, enableHoverEffects }
        }));
        
        // Apply hover effects class
        document.documentElement.classList.toggle('no-hover-effects', !enableHoverEffects);
      },
      
      setBorderRadius: (borderRadius: 'none' | 'small' | 'medium' | 'large') => {
        set((state) => ({
          settings: { ...state.settings, borderRadius }
        }));
        
        // Apply border radius CSS variable
        const radiusValues = {
          none: '0px',
          small: '0.125rem',
          medium: '0.375rem',
          large: '0.5rem'
        };
        document.documentElement.style.setProperty('--radius', radiusValues[borderRadius]);
      },
      
      resetToDefaults: () => {
        set({ settings: { ...defaultSettings } });
        
        // Reset all applied styles
        const { setTheme, setPrimaryColor, setFontSize, setReducedMotion, setHighContrast } = get();
        setTheme(defaultSettings.theme);
        setPrimaryColor(defaultSettings.primaryColor);
        setFontSize(defaultSettings.fontSize);
        setReducedMotion(defaultSettings.reducedMotion);
        setHighContrast(defaultSettings.highContrast);
      },
      
      initializeSettings: () => {
        if (get().isInitialized) return;
        
        const { settings, setTheme, setPrimaryColor, setFontSize, setReducedMotion, setHighContrast, setCustomPrimaryColor } = get();
        
        // Apply all current settings to DOM
        setTheme(settings.theme);
        setFontSize(settings.fontSize);
        setReducedMotion(settings.reducedMotion);
        setHighContrast(settings.highContrast);
        
        // Apply primary color (handle custom color case)
        if (settings.primaryColor === 'custom' && settings.customPrimaryColor) {
          setCustomPrimaryColor(settings.customPrimaryColor);
        } else {
          setPrimaryColor(settings.primaryColor);
        }
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = () => {
          if (settings.theme === 'system') {
            document.documentElement.classList.toggle('dark', mediaQuery.matches);
          }
        };
        
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        
        set({ isInitialized: true });
      },
      
      // Computed functions
      getComputedTheme: () => {
        const { settings } = get();
        if (settings.theme === 'system') {
          return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return settings.theme;
      },
      
      getGridSizeClass: () => {
        const { settings } = get();
        return gridSizeClasses[settings.gridSize];
      },
      
      getFontSizeClass: () => {
        const { settings } = get();
        return fontSizeClasses[settings.fontSize];
      },
      
      getPrimaryColorCSS: () => {
        const { settings } = get();
        return colorMappings[settings.primaryColor];
      },
      
      getLayoutDensityClass: () => {
        const { settings } = get();
        return layoutDensityClasses[settings.layoutDensity];
      },
      
      getCardStyleClass: () => {
        const { settings } = get();
        return cardStyleClasses[settings.cardStyle];
      },
      
      getBorderRadiusClass: () => {
        const { settings } = get();
        return borderRadiusClasses[settings.borderRadius];
      },
      
      getAnimationDuration: () => {
        const { settings } = get();
        return animationDurations[settings.animationSpeed];
      },
      
      // Export/Import functionality
      exportTheme: () => {
        const { settings } = get();
        const themeData = {
          name: 'Custom Theme',
          version: '1.0.0',
          createdAt: new Date().toISOString(),
          settings: settings,
        };
        return JSON.stringify(themeData, null, 2);
      },
      
      importTheme: (themeJson: string) => {
        try {
          const themeData = JSON.parse(themeJson);
          
          // Validate the theme data structure
          if (!themeData.settings || typeof themeData.settings !== 'object') {
            return false;
          }
          
          const newSettings = { ...defaultSettings, ...themeData.settings };
          set({ settings: newSettings });
          
          // Apply all settings immediately
          const { 
            setTheme, setPrimaryColor, setGridSize, setFontSize, 
            setReducedMotion, setHighContrast, setAnimationSpeed,
            setLayoutDensity, setCardStyle, setBackgroundPattern,
            setCustomPrimaryColor, setSmoothScrolling, setHoverEffects, setBorderRadius
          } = get();
          
          setTheme(newSettings.theme);
          setPrimaryColor(newSettings.primaryColor);
          setGridSize(newSettings.gridSize);
          setFontSize(newSettings.fontSize);
          setReducedMotion(newSettings.reducedMotion);
          setHighContrast(newSettings.highContrast);
          setAnimationSpeed(newSettings.animationSpeed);
          setLayoutDensity(newSettings.layoutDensity);
          setCardStyle(newSettings.cardStyle);
          setBackgroundPattern(newSettings.backgroundPattern);
          setSmoothScrolling(newSettings.enableSmoothScrolling);
          setHoverEffects(newSettings.enableHoverEffects);
          setBorderRadius(newSettings.borderRadius);
          
          if (newSettings.primaryColor === 'custom' && newSettings.customPrimaryColor) {
            setCustomPrimaryColor(newSettings.customPrimaryColor);
          }
          
          return true;
        } catch (error) {
          console.error('Failed to import theme:', error);
          return false;
        }
      },
    }),
    {
      name: 'habit-tracker-appearance',
      version: 3, // Increment version to force re-initialization
      // Only persist the settings, not the isInitialized flag
      partialize: (state) => ({ settings: state.settings }),
    }
  )
);

