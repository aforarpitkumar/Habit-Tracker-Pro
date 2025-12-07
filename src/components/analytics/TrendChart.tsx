'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import type { TrendData } from '@/lib/utils/analytics';

interface TrendChartProps {
  data: TrendData[];
  title?: string;
  height?: number;
}

export function TrendChart({ data, title = "Completion Trends", height = 200 }: TrendChartProps) {
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-muted-foreground">
            No data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const maxCompletions = Math.max(...data.map(d => d.completions), 1);
  const maxHeight = height - 40; // Account for labels

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative" style={{ height: height }}>
          {/* Chart bars */}
          <div className="flex items-end justify-between h-full gap-1">
            {data.map((point, index) => {
              const barHeight = (point.completions / maxCompletions) * maxHeight;
              const isWeekend = new Date(point.date).getDay() % 6 === 0;
              
              return (
                <div
                  key={point.date}
                  className="flex flex-col items-center flex-1 group relative"
                >
                  {/* Bar */}
                  <div
                    className={`w-full transition-all duration-200 rounded-t ${
                      point.completions > 0
                        ? isWeekend 
                          ? 'bg-blue-400 hover:bg-blue-500'
                          : 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-200'
                    }`}
                    style={{ height: Math.max(barHeight, 2) }}
                  />
                  
                  {/* Date label */}
                  <div className="text-xs text-muted-foreground mt-1 transform -rotate-45 origin-center">
                    {format(new Date(point.date), 'MM/dd')}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 
                                bg-black text-white text-xs rounded px-2 py-1 opacity-0 
                                group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                    {format(new Date(point.date), 'MMM dd')}: {point.completions} completions
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-muted-foreground">
            <span>{maxCompletions}</span>
            <span>{Math.floor(maxCompletions / 2)}</span>
            <span>0</span>
          </div>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-500 rounded" />
            <span>Weekdays</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-blue-400 rounded" />
            <span>Weekends</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-gray-200 rounded" />
            <span>No completions</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}