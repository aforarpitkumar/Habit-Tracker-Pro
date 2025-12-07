'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DataManagementPanel } from '@/components/data/DataManagementPanel';
import { AppearanceSettings } from '@/components/settings/AppearanceSettings';
import { ArrowLeft, Settings as SettingsIcon, Database, Palette, Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-2">
              <SettingsIcon className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Settings</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Data Management Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Database className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Data Management</h2>
            </div>
            <DataManagementPanel />
          </section>

          {/* Appearance Section */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <Palette className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Appearance</h2>
            </div>
            <AppearanceSettings />
          </section>

          <section>
            <div className="flex items-center gap-2 mb-6">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>
            <Card>
              <CardContent className="p-6">
                <div className="text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">Notification Preferences</p>
                  <p className="text-sm">Coming Soon</p>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </main>
    </div>
  );
}