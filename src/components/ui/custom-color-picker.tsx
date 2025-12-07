'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';

interface CustomColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

const presetColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3',
  '#54A0FF', '#5F27CD', '#00D2D3', '#FF9F43', '#EE5A24', '#0984E3',
  '#6C5CE7', '#A29BFE', '#FD79A8', '#E17055', '#00B894', '#00CEC9',
  '#2D3436', '#636E72', '#DDD', '#74B9FF', '#A29BFE', '#6C5CE7'
];

export function CustomColorPicker({ value, onChange, className }: CustomColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleColorSelect = (color: string) => {
    setInputValue(color);
    onChange(color);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const color = e.target.value;
    setInputValue(color);
    
    // Only call onChange if it's a valid hex color
    if (/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)) {
      onChange(color);
    }
  };

  const handleInputBlur = () => {
    // Ensure the input value is valid, otherwise reset to current value
    if (!/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(inputValue)) {
      setInputValue(value);
    }
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="w-16 h-10 p-1 flex items-center justify-center"
            style={{ backgroundColor: value }}
            title="Pick a color"
          >
            <div 
              className="w-full h-full rounded border-2 border-white/20"
              style={{ backgroundColor: value }}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Custom Color</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  type="color"
                  value={value}
                  onChange={(e) => handleColorSelect(e.target.value)}
                  className="w-12 h-8 p-1 rounded cursor-pointer"
                />
                <Input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  onBlur={handleInputBlur}
                  placeholder="#000000"
                  className="flex-1 font-mono text-sm"
                  maxLength={7}
                />
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium">Preset Colors</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {presetColors.map((color, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-8 h-8 p-0 rounded-md border-2 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => handleColorSelect(color)}
                    title={color}
                  >
                    <span className="sr-only">{color}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
      
      <div className="flex-1">
        <Label htmlFor="color-input" className="text-sm font-medium">
          Custom Color
        </Label>
        <Input
          id="color-input"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          placeholder="#000000"
          className="mt-1 font-mono text-sm"
          maxLength={7}
        />
      </div>
    </div>
  );
}