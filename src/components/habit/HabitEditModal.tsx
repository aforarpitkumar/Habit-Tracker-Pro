'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IconPicker } from './IconPicker';
import { ColorPicker } from './ColorPicker';
import { FrequencySelector } from './FrequencySelector';
import { useHabitStore } from '@/lib/stores/habitStore';
import type { Habit } from '@/types';

interface HabitEditModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  habit: Habit;
}

export function HabitEditModal({ open, onOpenChange, habit }: HabitEditModalProps) {
  const { updateHabit } = useHabitStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [formData, setFormData] = React.useState<{
    name: string;
    description: string;
    icon: string;
    color: string;
    frequency: Habit['frequency'];
  }>({
    name: habit.name,
    description: habit.description,
    icon: habit.icon,
    color: habit.color,
    frequency: habit.frequency,
  });
  
  // Reset form data when habit changes
  React.useEffect(() => {
    setFormData({
      name: habit.name,
      description: habit.description,
      icon: habit.icon,
      color: habit.color,
      frequency: habit.frequency,
    });
  }, [habit]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setIsLoading(true);
    try {
      await updateHabit(habit.uuid, {
        name: formData.name.trim(),
        description: formData.description.trim(),
        icon: formData.icon,
        color: formData.color,
        frequency: formData.frequency,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update habit:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Habit Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Habit Name</label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter habit name"
              required
            />
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Description (Optional)</label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add a description for your habit"
              rows={3}
            />
          </div>
          
          {/* Icon and Color */}
          <div className="flex gap-4">
            <div>
              <IconPicker
                value={formData.icon}
                onChange={(icon) => setFormData(prev => ({ ...prev, icon }))}
              />
            </div>
            
            <div>
              <ColorPicker
                value={formData.color}
                onChange={(color) => setFormData(prev => ({ ...prev, color }))}
              />
            </div>
          </div>
          
          {/* Frequency */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Frequency</label>
            <FrequencySelector
              value={formData.frequency}
              onChange={(frequency) => setFormData(prev => ({ ...prev, frequency }))}
            />
          </div>
          
          {/* Submit Button */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name.trim()}>
              {isLoading ? 'Updating...' : 'Update Habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}