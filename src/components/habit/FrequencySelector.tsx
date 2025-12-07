'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FREQUENCY_TYPES } from '@/lib/constants/habits';
import { cn } from '@/lib/utils';
import type { Habit } from '@/types';

type FrequencyData = Habit['frequency'];

interface FrequencySelectorProps {
  value: FrequencyData;
  onChange: (frequency: FrequencyData) => void;
}

const DAYS_OF_WEEK = [
  { value: 0, short: 'Sun', full: 'Sunday' },
  { value: 1, short: 'Mon', full: 'Monday' },
  { value: 2, short: 'Tue', full: 'Tuesday' },
  { value: 3, short: 'Wed', full: 'Wednesday' },
  { value: 4, short: 'Thu', full: 'Thursday' },
  { value: 5, short: 'Fri', full: 'Friday' },
  { value: 6, short: 'Sat', full: 'Saturday' },
];

const FREQUENCY_PRESETS = [
  {
    label: 'Every day',
    value: { type: 'daily' as const, target: 1, period: 1 }
  },
  {
    label: 'Weekdays only',
    value: { type: 'daily' as const, target: 1, period: 1, customPattern: 'weekdays-only' as const }
  },
  {
    label: '3 times/week',
    value: { type: 'weekly' as const, target: 3, period: 7, daysOfWeek: [1, 3, 5] }
  },
  {
    label: 'Weekend workout',
    value: { type: 'weekly' as const, target: 2, period: 7, daysOfWeek: [0, 6] }
  },
  {
    label: 'Every other day',
    value: { type: 'daily' as const, target: 1, period: 1, customPattern: 'every-other-day' as const }
  },
  {
    label: 'Twice monthly',
    value: { type: 'monthly' as const, target: 2, period: 30, daysOfMonth: [1, 15] }
  },
];

const DAILY_PATTERNS: Array<{ value: FrequencyData['customPattern']; label: string }> = [
  { value: undefined, label: 'Every day' },
  { value: 'weekdays-only', label: 'Weekdays only' },
  { value: 'every-other-day', label: 'Every other day' },
];

export function FrequencySelector({ value, onChange }: FrequencySelectorProps) {
  const handleTypeChange = (type: FrequencyData['type']) => {
    const defaults: Record<FrequencyData['type'], Partial<FrequencyData>> = {
      daily: { target: 1, period: 1, daysOfWeek: undefined, daysOfMonth: undefined, customPattern: undefined },
      weekly: { target: 3, period: 7, daysOfWeek: [1, 2, 3], daysOfMonth: undefined, customPattern: undefined },
      monthly: { target: 20, period: 30, daysOfWeek: undefined, daysOfMonth: undefined, customPattern: undefined },
      custom: { target: 1, period: 1, daysOfWeek: undefined, daysOfMonth: undefined, customPattern: 'custom-interval' },
    };
    
    onChange({
      type,
      ...defaults[type],
    } as FrequencyData);
  };

  const handleDayOfWeekToggle = (dayValue: number) => {
    const currentDays = value.daysOfWeek || [];
    const newDays = currentDays.includes(dayValue)
      ? currentDays.filter(d => d !== dayValue)
      : [...currentDays, dayValue].sort();
    
    onChange({
      ...value,
      daysOfWeek: newDays,
      target: Math.max(1, newDays.length), // Auto-adjust target based on selected days
    });
  };

  const handleDayOfMonthToggle = (day: number) => {
    const currentDays = value.daysOfMonth || [];
    const newDays = currentDays.includes(day)
      ? currentDays.filter(d => d !== day)
      : [...currentDays, day].sort((a, b) => a - b);
    
    onChange({
      ...value,
      daysOfMonth: newDays,
      target: Math.max(1, newDays.length),
    });
  };

  const getFrequencyPreview = () => {
    switch (value.type) {
      case 'daily':
        if (value.customPattern === 'weekdays-only') return 'Monday to Friday';
        if (value.customPattern === 'every-other-day') return 'Every other day';
        return 'Every day';
      case 'weekly':
        if (value.daysOfWeek && value.daysOfWeek.length > 0) {
          const dayNames = value.daysOfWeek.map(d => DAYS_OF_WEEK[d].short).join(', ');
          return `${dayNames} each week`;
        }
        return `${value.target} times per week`;
      case 'monthly':
        if (value.daysOfMonth && value.daysOfMonth.length > 0) {
          return `Days ${value.daysOfMonth.join(', ')} each month`;
        }
        return `${value.target} times per month`;
      case 'custom':
        return `${value.target} times every ${value.period} days`;
      default:
        return '';
    }
  };

  const [showPresets, setShowPresets] = React.useState(false);

  const applyPreset = (preset: typeof FREQUENCY_PRESETS[0]) => {
    onChange({ ...preset.value } as FrequencyData);
    setShowPresets(false); // Auto-close after selection
  };

  return (
    <div className="space-y-3">
      {/* Quick Presets - Collapsible */}
      <div className="space-y-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setShowPresets(!showPresets)}
          className="text-sm font-medium justify-start p-0 h-auto"
        >
          Quick Presets {showPresets ? '▼' : '▶'}
        </Button>
        {showPresets && (
          <div className="grid grid-cols-3 gap-1">
            {FREQUENCY_PRESETS.map((preset) => (
              <Button
                key={preset.label}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => applyPreset(preset)}
                className="justify-start text-xs h-7"
              >
                {preset.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Main frequency type selector */}
      <div className="grid grid-cols-4 gap-1">
        {FREQUENCY_TYPES.map((freq) => (
          <Button
            key={freq.value}
            type="button"
            variant={value.type === freq.value ? "default" : "outline"}
            size="sm"
            onClick={() => handleTypeChange(freq.value as FrequencyData['type'])}
            className={cn(
              "flex-1",
              value.type === freq.value && "ring-2 ring-primary"
            )}
          >
            {freq.label}
          </Button>
        ))}
      </div>

      {/* Preview */}
      <div className="text-xs text-muted-foreground bg-muted/50 p-2 rounded">
        <strong>Schedule:</strong> {getFrequencyPreview()}
      </div>

      {/* Daily pattern options */}
      {value.type === 'daily' && (
        <div className="space-y-2">
          <label className="text-xs font-medium">Pattern</label>
          <div className="grid grid-cols-1 gap-1">
            {DAILY_PATTERNS.map((pattern) => (
              <Button
                key={pattern.label}
                type="button"
                variant={value.customPattern === pattern.value ? "default" : "outline"}
                size="sm"
                onClick={() => onChange({ ...value, customPattern: pattern.value })}
                className="justify-start h-7 text-xs"
              >
                {pattern.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Weekly day selection */}
      {value.type === 'weekly' && (
        <div className="space-y-2">
          <label className="text-xs font-medium">Select Days</label>
          <div className="grid grid-cols-7 gap-1">
            {DAYS_OF_WEEK.map((day) => (
              <Button
                key={day.value}
                type="button"
                variant={(value.daysOfWeek || []).includes(day.value) ? "default" : "outline"}
                size="sm"
                onClick={() => handleDayOfWeekToggle(day.value)}
                className="h-7 text-xs"
              >
                {day.short}
              </Button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            {(value.daysOfWeek || []).length} days selected
          </div>
        </div>
      )}

      {/* Monthly day selection */}
      {value.type === 'monthly' && (
        <div className="space-y-2">
          <label className="text-xs font-medium">Select Days of Month</label>
          <div className="grid grid-cols-8 gap-1 max-h-32 overflow-y-auto">
            {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
              <Button
                key={day}
                type="button"
                variant={(value.daysOfMonth || []).includes(day) ? "default" : "outline"}
                size="sm"
                onClick={() => handleDayOfMonthToggle(day)}
                className="h-7 text-xs"
              >
                {day}
              </Button>
            ))}
          </div>
          <div className="text-xs text-muted-foreground">
            {(value.daysOfMonth || []).length} days selected
          </div>
        </div>
      )}

      {/* Custom interval settings */}
      {value.type === 'custom' && (
        <div className="space-y-2">
          <label className="text-xs font-medium">Custom Interval</label>
          <div className="flex items-center gap-2 text-sm">
            <Input
              type="number"
              min="1"
              value={value.target}
              onChange={(e) => onChange({
                ...value,
                target: parseInt(e.target.value) || 1,
              })}
              className="w-20"
            />
            <span>times every</span>
            <Input
              type="number"
              min="1"
              value={value.period}
              onChange={(e) => onChange({
                ...value,
                period: parseInt(e.target.value) || 1,
              })}
              className="w-20"
            />
            <span>days</span>
          </div>
        </div>
      )}

      {/* Legacy weekly/monthly target inputs (fallback for non-specific scheduling) */}
      {value.type === 'weekly' && (!value.daysOfWeek || value.daysOfWeek.length === 0) && (
        <div className="flex items-center gap-2 text-sm">
          <Input
            type="number"
            min="1"
            max="7"
            value={value.target}
            onChange={(e) => onChange({
              ...value,
              target: parseInt(e.target.value) || 1,
            })}
            className="w-20"
          />
          <span>times per week</span>
        </div>
      )}

      {value.type === 'monthly' && (!value.daysOfMonth || value.daysOfMonth.length === 0) && (
        <div className="flex items-center gap-2 text-sm">
          <Input
            type="number"
            min="1"
            max="31"
            value={value.target}
            onChange={(e) => onChange({
              ...value,
              target: parseInt(e.target.value) || 1,
            })}
            className="w-20"
          />
          <span>times per month</span>
        </div>
      )}
    </div>
  );
}