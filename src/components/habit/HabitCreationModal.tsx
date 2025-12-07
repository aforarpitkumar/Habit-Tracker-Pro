'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useHabitStore } from '@/lib/stores/habitStore';
import { IconPicker } from './IconPicker';
import { ColorPicker } from './ColorPicker';
import { FrequencySelector } from './FrequencySelector';
import { HabitTemplatesModal } from './HabitTemplatesModal';
import type { Habit, HabitTemplate } from '@/types';

interface HabitCreationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HabitCreationModal({ open, onOpenChange }: HabitCreationModalProps) {
  const { addHabit } = useHabitStore();
  const [isLoading, setIsLoading] = React.useState(false);
  const [showTemplates, setShowTemplates] = React.useState(false);
  const [formData, setFormData] = React.useState<{
    name: string;
    description: string;
    icon: string;
    color: string;
    frequency: Habit['frequency'];
  }>({
    name: '',
    description: '',
    icon: 'target',
    color: '#10B981',
    frequency: {
      type: 'daily',
      target: 1,
      period: 1,
    },
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    setIsLoading(true);
    try {
      await addHabit({
        ...formData,
        archived: false,
      });
      
      onOpenChange(false);
      // Reset form
      setFormData({
        name: '',
        description: '',
        icon: 'target',
        color: '#10B981',
        frequency: {
          type: 'daily',
          target: 1,
          period: 1,
        },
      });
    } catch (error) {
      console.error('Failed to create habit:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFrequencyChange = (frequency: Habit['frequency']) => {
    setFormData(prev => ({ ...prev, frequency }));
  };

  const handleTemplateSelect = (template: HabitTemplate) => {
    setFormData({
      name: template.name,
      description: template.description,
      icon: template.icon,
      color: template.color,
      frequency: template.frequency,
    });
    setShowTemplates(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-2 mb-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowTemplates(true)}
            className="flex-1"
          >
            📋 Choose Template
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setFormData({
              name: '',
              description: '',
              icon: 'target',
              color: '#10B981',
              frequency: {
                type: 'daily',
                target: 1,
                period: 1,
              },
            })}
            className="flex-1"
          >
            🆕 Start Fresh
          </Button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4 pb-2">
          <div className="space-y-2">
            <label className="text-sm font-medium">Habit Name</label>
            <Input
              placeholder="Enter habit name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <Textarea
              placeholder="What is this habit about?"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>
          
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
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Frequency</label>
            <FrequencySelector
              value={formData.frequency}
              onChange={handleFrequencyChange}
            />
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !formData.name.trim()}
              className="flex-1"
            >
              {isLoading ? 'Creating...' : 'Create Habit'}
            </Button>
          </div>
        </form>
      </DialogContent>
      
      <HabitTemplatesModal
        open={showTemplates}
        onOpenChange={setShowTemplates}
        onSelectTemplate={handleTemplateSelect}
      />
    </Dialog>
  );
}