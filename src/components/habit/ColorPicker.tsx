'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HABIT_COLORS } from '@/lib/constants/habits';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  const [open, setOpen] = React.useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="w-12 h-16 p-1 flex flex-col items-center justify-between"
        >
          <div className="flex-1 flex items-center">
            <div className="w-6 h-6 rounded border-2 border-white/20" style={{ backgroundColor: value }} />
          </div>
          <span className="text-xs leading-none">Color</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Choose a Color</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-8 gap-2 py-4">
          {HABIT_COLORS.map((color) => (
            <Button
              key={color}
              variant="outline"
              className={cn(
                "w-8 h-8 p-1",
                value === color && "ring-2 ring-primary"
              )}
              style={{ backgroundColor: color }}
              onClick={() => {
                onChange(color);
                setOpen(false);
              }}
            >
              <div className="w-full h-full rounded border border-white/20" />
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}