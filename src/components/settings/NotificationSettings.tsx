'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, Plus, Trash2, Clock } from 'lucide-react';
import { notificationService, type NotificationSettings, type CustomReminder } from '@/lib/services/notificationService';

export function NotificationSettings() {
  const [settings, setSettings] = useState<NotificationSettings>(notificationService.getSettings());
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    setPermission(Notification.permission);
  }, []);

  const handleRequestPermission = async () => {
    const granted = await notificationService.requestPermission();
    setPermission(granted ? 'granted' : 'denied');
    if (granted) {
      handleSettingChange('enabled', true);
    }
  };

  const handleSettingChange = (key: keyof NotificationSettings, value: any) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    notificationService.updateSettings(newSettings);
  };

  const handleTestNotification = () => {
    notificationService.showNotification('Test Notification', {
      body: 'This is a test notification from Habit Tracker Pro!'
    });
  };

  return (
    <div className="space-y-6">
      {/* Permission Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {permission === 'granted' ? 
              <Bell className="w-5 h-5 text-green-500" /> : 
              <BellOff className="w-5 h-5 text-red-500" />
            }
            Notification Permission
          </CardTitle>
          <CardDescription>
            {permission === 'granted' && 'Notifications are enabled'}
            {permission === 'denied' && 'Notifications are blocked'}
            {permission === 'default' && 'Click to enable notifications'}
          </CardDescription>
        </CardHeader>
        {permission !== 'granted' && (
          <CardContent>
            <Button onClick={handleRequestPermission}>
              <Bell className="w-4 h-4 mr-2" />
              Enable Notifications
            </Button>
          </CardContent>
        )}
      </Card>

      {/* Basic Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
          <CardDescription>
            Configure your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Daily Reminder</h4>
              <p className="text-sm text-muted-foreground">
                Get reminded to check your habits
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.dailyReminder}
              onChange={(e) => handleSettingChange('dailyReminder', e.target.checked)}
              disabled={!settings.enabled}
              className="w-4 h-4"
            />
          </div>

          {settings.dailyReminder && (
            <div className="ml-6 space-y-2">
              <label className="text-sm font-medium">Reminder Time</label>
              <Input
                type="time"
                value={settings.reminderTime}
                onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
                className="w-32"
              />
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Motivational Quotes</h4>
              <p className="text-sm text-muted-foreground">
                Receive daily inspiration
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.motivationalQuotes}
              onChange={(e) => handleSettingChange('motivationalQuotes', e.target.checked)}
              disabled={!settings.enabled}
              className="w-4 h-4"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">Streak Milestones</h4>
              <p className="text-sm text-muted-foreground">
                Celebrate your achievements
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.streakMilestones}
              onChange={(e) => handleSettingChange('streakMilestones', e.target.checked)}
              disabled={!settings.enabled}
              className="w-4 h-4"
            />
          </div>

          {settings.enabled && (
            <Button variant="outline" onClick={handleTestNotification}>
              Test Notification
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Custom Reminders */}
      <Card>
        <CardHeader>
          <CardTitle>Custom Reminders</CardTitle>
          <CardDescription>
            {settings.customReminders.length} custom reminders configured
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">
            Advanced reminder management coming soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}