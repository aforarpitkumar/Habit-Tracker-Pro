'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAppearanceStore, type Theme, type PrimaryColor, type GridSize, type FontSize, type CardStyle, type BackgroundPattern } from '@/lib/stores/appearanceStore';
import { CustomColorPicker } from '@/components/ui/custom-color-picker';
import { 
  Palette, 
  Monitor, 
  Sun, 
  Moon, 
  Grid3X3, 
  Type, 
  Eye, 
  RotateCcw,
  Check,
  CreditCard,
  Image,
  Download,
  Upload 
} from 'lucide-react';

const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: 'light', label: 'Light', icon: <Sun className="h-4 w-4" /> },
  { value: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" /> },
  { value: 'system', label: 'System', icon: <Monitor className="h-4 w-4" /> },
];

const colorOptions: { value: PrimaryColor; label: string; color: string }[] = [
  { value: 'blue', label: 'Blue', color: '#3b82f6' },
  { value: 'green', label: 'Green', color: '#10b981' },
  { value: 'purple', label: 'Purple', color: '#8b5cf6' },
  { value: 'orange', label: 'Orange', color: '#f97316' },
  { value: 'red', label: 'Red', color: '#ef4444' },
  { value: 'pink', label: 'Pink', color: '#ec4899' },
  { value: 'indigo', label: 'Indigo', color: '#6366f1' },
  { value: 'teal', label: 'Teal', color: '#14b8a6' },
];

const gridSizeOptions: { value: GridSize; label: string; description: string }[] = [
  { value: 'small', label: 'Small', description: '6 columns, compact' },
  { value: 'medium', label: 'Medium', description: '4 columns, balanced' },
  { value: 'large', label: 'Large', description: '3 columns, spacious' },
];

const cardStyleOptions: { value: CardStyle; label: string; description: string }[] = [
  { value: 'minimal', label: 'Minimal', description: 'Clean design with no borders or shadows' },
  { value: 'standard', label: 'Standard', description: 'Balanced design with subtle borders and shadows' },
  { value: 'detailed', label: 'Detailed', description: 'Rich design with prominent borders and shadows' },
];

const fontSizeOptions: { value: FontSize; label: string; description: string }[] = [
  { value: 'small', label: 'Small', description: 'Compact text' },
  { value: 'medium', label: 'Medium', description: 'Standard text' },
  { value: 'large', label: 'Large', description: 'Large text for accessibility' },
];

const backgroundPatternOptions: { value: BackgroundPattern; label: string; description: string }[] = [
  { value: 'none', label: 'None', description: 'Clean background without patterns' },
  { value: 'dots', label: 'Dots', description: 'Subtle dot pattern' },
  { value: 'grid', label: 'Grid', description: 'Grid line pattern' },
  { value: 'waves', label: 'Waves', description: 'Gentle wave pattern' },
  { value: 'gradient', label: 'Gradient', description: 'Animated gradient background' },
];

export function AppearanceSettings() {
  const {
    settings,
    setTheme,
    setPrimaryColor,
    setGridSize,
    setFontSize,
    setReducedMotion,
    setHighContrast,
    setCustomPrimaryColor,
    setCardStyle,
    setBackgroundPattern,
    resetToDefaults,
    exportTheme,
    importTheme,
  } = useAppearanceStore();

  const handleExportTheme = () => {
    const themeJson = exportTheme();
    const blob = new Blob([themeJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'habit-tracker-theme.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportTheme = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const content = e.target?.result as string;
          const success = importTheme(content);
          if (success) {
            // Show success notification
            alert('Theme imported successfully!');
          } else {
            alert('Failed to import theme. Please check the file format.');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Theme
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {themeOptions.map((option) => (
              <Button
                key={option.value}
                variant={settings.theme === option.value ? "default" : "outline"}
                className="flex items-center justify-center gap-2 h-12"
                onClick={() => setTheme(option.value)}
              >
                {option.icon}
                <span>{option.label}</span>
                {settings.theme === option.value && <Check className="h-4 w-4 ml-auto" />}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Primary Color Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Primary Color
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {colorOptions.map((option) => (
              <Button
                key={option.value}
                variant="outline"
                className={`h-12 w-full p-1 ${
                  settings.primaryColor === option.value 
                    ? 'ring-2 ring-offset-2 ring-current' 
                    : ''
                }`}
                onClick={() => setPrimaryColor(option.value)}
                title={option.label}
              >
                <div className="flex flex-col items-center gap-1">
                  <div 
                    className="w-6 h-6 rounded-full border-2 border-white/20"
                    style={{ backgroundColor: option.color }}
                  />
                  <span className="text-xs">{option.label}</span>
                </div>
              </Button>
            ))}
            
            {/* Custom Color Button */}
            <Button
              variant="outline"
              className={`h-12 w-full p-1 ${
                settings.primaryColor === 'custom' 
                  ? 'ring-2 ring-offset-2 ring-current' 
                  : ''
              }`}
              onClick={() => setPrimaryColor('custom')}
              title="Custom"
            >
              <div className="flex flex-col items-center gap-1">
                <div className="w-6 h-6 rounded-full border-2 border-dashed border-current flex items-center justify-center">
                  <Palette className="h-3 w-3" />
                </div>
                <span className="text-xs">Custom</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Custom Color Picker */}
      {settings.primaryColor === 'custom' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Custom Color
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomColorPicker
              value={settings.customPrimaryColor || '#3b82f6'}
              onChange={setCustomPrimaryColor}
            />
          </CardContent>
        </Card>
      )}

      {/* Grid Size Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Grid3X3 className="h-5 w-5" />
            Grid Size
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {gridSizeOptions.map((option) => (
            <div
              key={option.value}
              className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                settings.gridSize === option.value 
                  ? 'bg-primary/10 border-primary' 
                  : ''
              }`}
              onClick={() => setGridSize(option.value)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
                {settings.gridSize === option.value && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Font Size Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Font Size
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {fontSizeOptions.map((option) => (
            <div
              key={option.value}
              className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                settings.fontSize === option.value 
                  ? 'bg-primary/10 border-primary' 
                  : ''
              }`}
              onClick={() => setFontSize(option.value)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
                {settings.fontSize === option.value && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Card Style Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Card Style
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {cardStyleOptions.map((option) => (
            <div
              key={option.value}
              className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                settings.cardStyle === option.value 
                  ? 'bg-primary/10 border-primary' 
                  : ''
              }`}
              onClick={() => setCardStyle(option.value)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
                {settings.cardStyle === option.value && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Background Pattern Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Background Pattern
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {backgroundPatternOptions.map((option) => (
            <div
              key={option.value}
              className={`p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                settings.backgroundPattern === option.value 
                  ? 'bg-primary/10 border-primary' 
                  : ''
              }`}
              onClick={() => setBackgroundPattern(option.value)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm text-muted-foreground">{option.description}</div>
                </div>
                {settings.backgroundPattern === option.value && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Accessibility Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Accessibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="reduced-motion">Reduced Motion</Label>
              <p className="text-sm text-muted-foreground">
                Minimize animations and transitions
              </p>
            </div>
            <Switch
              id="reduced-motion"
              checked={settings.reducedMotion}
              onCheckedChange={setReducedMotion}
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="high-contrast">High Contrast</Label>
              <p className="text-sm text-muted-foreground">
                Increase contrast for better visibility
              </p>
            </div>
            <Switch
              id="high-contrast"
              checked={settings.highContrast}
              onCheckedChange={setHighContrast}
            />
          </div>
        </CardContent>
      </Card>

      {/* Reset to Defaults */}
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium">Reset to Defaults</div>
              <div className="text-sm text-muted-foreground">
                Restore all appearance settings to their default values
              </div>
            </div>
            <Button variant="outline" onClick={resetToDefaults}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-medium">Export Theme</div>
                <div className="text-sm text-muted-foreground">
                  Save your current appearance settings as a file
                </div>
              </div>
              <Button variant="outline" onClick={handleExportTheme}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">Import Theme</div>
                <div className="text-sm text-muted-foreground">
                  Load appearance settings from a theme file
                </div>
              </div>
              <Button variant="outline" onClick={handleImportTheme}>
                <Upload className="h-4 w-4 mr-2" />
                Import
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}