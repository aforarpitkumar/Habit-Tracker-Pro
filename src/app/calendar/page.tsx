'use client';

import React from 'react';
import { CalendarView } from '@/components/habit/CalendarView';
import { HabitEditModal } from '@/components/habit/HabitEditModal';
import { useHabitStore } from '@/lib/stores/habitStore';
import { useAppearanceStore } from '@/lib/stores/appearanceStore';
import { getHabitIconEmoji } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarIcon, Grid3X3, ArrowLeft, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CalendarPage() {
  const router = useRouter();
  const { getActiveHabits, loadHabits, loadCompletions, isLoading } = useHabitStore();
  const { getGridSizeClass } = useAppearanceStore();
  const [selectedHabitIndex, setSelectedHabitIndex] = React.useState(0);
  const [editingHabit, setEditingHabit] = React.useState<any>(null);

  const activeHabits = getActiveHabits();
  const selectedHabit = activeHabits[selectedHabitIndex];

  // Load data on mount
  React.useEffect(() => {
    const loadData = async () => {
      await loadHabits();
      await loadCompletions();
    };
    loadData();
  }, [loadHabits, loadCompletions]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <CalendarIcon className="w-8 h-8 animate-pulse mx-auto mb-2" />
          <p className="text-muted-foreground">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (activeHabits.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="text-foreground hover:text-foreground/80">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Calendar View</h1>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          <Card className="max-w-md mx-auto text-center">
            <CardHeader>
              <CalendarIcon className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <CardTitle>No Habits to Display</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Create some habits first to view them in calendar format.
              </p>
              <Button onClick={() => router.push('/')}>
                Go to Dashboard
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => router.push('/')} className="text-foreground hover:text-foreground/80">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Calendar View</h1>
              </div>
            </div>
            <Button variant="outline" onClick={() => router.push('/')}>
              <Grid3X3 className="w-4 h-4 mr-2" />
              Grid View
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {/* Habit Selector */}
          {activeHabits.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Habit</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {activeHabits.map((habit, index) => (
                    <Button
                      key={habit.uuid}
                      variant={selectedHabitIndex === index ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedHabitIndex(index)}
                      className="flex items-center gap-2"
                    >
                      <span className="text-lg">{getHabitIconEmoji(habit.icon)}</span>
                      <span>{habit.name}</span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Calendar View */}
          {selectedHabit && (
            <CalendarView habit={selectedHabit} />
          )}

          {/* Multiple Habits View */}
          {activeHabits.length > 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">All Habits Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`grid ${getGridSizeClass()}`}>
                  {activeHabits.map((habit) => (
                    <div key={habit.uuid} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getHabitIconEmoji(habit.icon)}</span>
                          <span className="font-medium">{habit.name}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setEditingHabit(habit)}
                          title="Edit habit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {habit.frequency.type === 'daily' ? 'Daily' :
                          habit.frequency.type === 'weekly' ? `${habit.frequency.target}/week` :
                            habit.frequency.type === 'monthly' ? `${habit.frequency.target}/month` :
                              `${habit.frequency.target}/${habit.frequency.period} days`}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2 w-full"
                        onClick={() => {
                          const index = activeHabits.findIndex(h => h.uuid === habit.uuid);
                          setSelectedHabitIndex(index);
                        }}
                      >
                        View Calendar
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Edit Modal */}
          {editingHabit && (
            <HabitEditModal
              open={!!editingHabit}
              onOpenChange={(open) => !open && setEditingHabit(null)}
              habit={editingHabit}
            />
          )}
        </div>
      </main>
    </div>
  );
}