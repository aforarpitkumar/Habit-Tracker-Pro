'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { HABIT_ICONS } from '@/lib/constants/habits';
import { cn } from '@/lib/utils';

interface IconPickerProps {
  value: string;
  onChange: (icon: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [open, setOpen] = React.useState(false);
  
  const selectedIcon = HABIT_ICONS.find(icon => icon.id === value);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-12 h-16 p-1 flex flex-col items-center justify-between">
          <div className="text-lg flex-1 flex items-center">{selectedIcon?.icon || '🎯'}</div>
          <span className="text-xs leading-none">Icon</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Choose an Icon</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-8 gap-2 py-4">
          {HABIT_ICONS.map((icon) => (
            <Button
              key={icon.id}
              variant={value === icon.id ? "default" : "outline"}
              className={cn(
                "w-8 h-8 text-sm",
                value === icon.id && "ring-2 ring-primary"
              )}
              onClick={() => {
                onChange(icon.id);
                setOpen(false);
              }}
            >
              {icon.icon}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}