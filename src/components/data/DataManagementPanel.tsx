'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useHabitStore } from '@/lib/stores/habitStore';
import { Download, Upload, FileText, AlertTriangle, CheckCircle, Copy, Trash2, RotateCcw, Archive } from 'lucide-react';
import { useState } from 'react';
import { ConfirmationDialog } from '@/components/ui/confirmation-dialog';
import { getHabitIconEmoji } from '@/lib/utils';

export function DataManagementPanel() {
  const { exportData, importData: importDataFunction, habits, completions, getArchivedHabits, restoreHabit, deleteHabit } = useHabitStore();
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportedData, setExportedData] = useState('');
  const [importDataValue, setImportDataValue] = useState('');
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importResult, setImportResult] = useState<{ success: boolean; message: string } | null>(null);
  const [habitToDelete, setHabitToDelete] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const data = await exportData();
      setExportedData(data);
      setShowExportDialog(true);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([exportedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habit-tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(exportedData);
      alert('Data copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      alert('Failed to copy to clipboard. Please copy manually.');
    }
  };

  const validateImportData = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      
      // Check if it has the expected structure
      if (!data || typeof data !== 'object') return false;
      
      // Check for required fields
      const hasValidStructure = 
        Array.isArray(data.habits) &&
        Array.isArray(data.completions) &&
        Array.isArray(data.settings) &&
        typeof data.exportedAt === 'string';
      
      return hasValidStructure;
    } catch {
      return false;
    }
  };

  const handleImport = async () => {
    if (!importDataValue.trim()) {
      setImportResult({ success: false, message: 'Please enter data to import.' });
      return;
    }

    if (!validateImportData(importDataValue)) {
      setImportResult({ 
        success: false, 
        message: 'Invalid data format. Please ensure you\'re using a valid habit tracker backup file.' 
      });
      return;
    }

    setIsImporting(true);
    try {
      await importDataFunction(importDataValue);
      setImportResult({ 
        success: true, 
        message: 'Data imported successfully! Your habits and progress have been restored.' 
      });
      setImportDataValue('');
      setTimeout(() => {
        setShowImportDialog(false);
        setImportResult(null);
      }, 2000);
    } catch (error) {
      console.error('Import failed:', error);
      setImportResult({ 
        success: false, 
        message: 'Failed to import data. Please check the format and try again.' 
      });
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
                  const content = e.target?.result as string;
                  setImportDataValue(content);
    };
    reader.readAsText(file);
  };

  const getDataSummary = () => {
    const totalHabits = habits.length;
    const activeHabits = habits.filter(h => !h.archived).length;
    const archivedHabits = habits.filter(h => h.archived).length;
    const totalCompletions = completions.filter(c => c.completed).length;
    
    return { totalHabits, activeHabits, archivedHabits, totalCompletions };
  };

  const stats = getDataSummary();

  return (
    <div className="space-y-6">
      {/* Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Your Data Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalHabits}</div>
              <div className="text-xs text-muted-foreground">Total Habits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{stats.activeHabits}</div>
              <div className="text-xs text-muted-foreground">Active Habits</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{stats.archivedHabits}</div>
              <div className="text-xs text-muted-foreground">Archived</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalCompletions}</div>
              <div className="text-xs text-muted-foreground">Completions</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Create a backup of all your habits, progress, and settings. This file can be used to restore your data later.
          </p>
          <Button 
            onClick={handleExport} 
            disabled={isExporting}
            className="w-full"
          >
            <Download className="h-4 w-4 mr-2" />
            {isExporting ? 'Creating Backup...' : 'Create Backup'}
          </Button>
        </CardContent>
      </Card>

      {/* Import Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Data
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-amber-800">
              <strong>Warning:</strong> Importing will replace all your current data. Make sure to export your current data first if you want to keep it.
            </div>
          </div>
          <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Import Backup
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Import Data</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Upload Backup File
                  </label>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </div>
                
                <div className="text-sm text-muted-foreground text-center">or</div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Paste Backup Data
                  </label>
                  <Textarea
                    value={importDataValue}
                    onChange={(e) => setImportDataValue(e.target.value)}
                    placeholder="Paste your exported backup data here..."
                    rows={8}
                    className="font-mono text-xs"
                  />
                </div>

                {importResult && (
                  <div className={`flex items-center gap-2 p-3 rounded-lg ${
                    importResult.success 
                      ? 'bg-green-50 border border-green-200 text-green-800' 
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    {importResult.success ? (
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    )}
                    <span className="text-sm">{importResult.message}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    onClick={handleImport}
                    disabled={isImporting || !importDataValue.trim()}
                    className="flex-1"
                  >
                    {isImporting ? 'Importing...' : 'Import Data'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowImportDialog(false);
                      setImportResult(null);
                      setImportDataValue('');
                    }}
                    disabled={isImporting}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Archive Habits Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Archive className="h-5 w-5" />
            Archive Habits
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(() => {
            const archivedHabits = getArchivedHabits();
            
            if (archivedHabits.length === 0) {
              return (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No archived habits found.
                </p>
              );
            }
            
            return (
              <div className="space-y-3">
                {archivedHabits.map((habit) => {
                  const habitIcon = getHabitIconEmoji(habit.icon);
                  
                  const handleRestore = async () => {
                    try {
                      await restoreHabit(habit.uuid);
                    } catch (error) {
                      console.error('Failed to restore habit:', error);
                      alert('Failed to restore habit. Please try again.');
                    }
                  };
                  
                  const handleDeleteClick = () => {
                    setHabitToDelete(habit.uuid);
                    setShowDeleteConfirm(true);
                  };
                  
                  return (
                    <div key={habit.uuid} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{habitIcon}</span>
                        <div>
                          <h4 className="font-medium">{habit.name}</h4>
                          {habit.description && (
                            <p className="text-sm text-muted-foreground">{habit.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleRestore}
                          className="flex items-center gap-1"
                        >
                          <RotateCcw className="h-4 w-4" />
                          Restore
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDeleteClick}
                          className="flex items-center gap-1 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </CardContent>
      </Card>

      {/* Export Dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Export Successful</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Your data has been exported successfully. You can download it as a file or copy it to clipboard.
            </p>
            
            <div className="flex gap-2">
              <Button onClick={handleDownload} className="flex-1">
                <Download className="h-4 w-4 mr-2" />
                Download File
              </Button>
              <Button onClick={handleCopyToClipboard} variant="outline" className="flex-1">
                <Copy className="h-4 w-4 mr-2" />
                Copy to Clipboard
              </Button>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">
                Backup Data (for manual copying)
              </label>
              <Textarea
                value={exportedData}
                readOnly
                rows={8}
                className="font-mono text-xs"
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Habit"
        description={(() => {
          const habit = habits.find(h => h.uuid === habitToDelete);
          return habit 
            ? `Do you really want to permanently delete "${habit.name}"? This action cannot be undone and will remove all progress data for this habit.`
            : 'Do you really want to permanently delete this habit?';
        })()}
        confirmText="Yes, Delete"
        cancelText="No, Keep It"
        onConfirm={async () => {
          if (habitToDelete) {
            try {
              await deleteHabit(habitToDelete);
              setHabitToDelete(null);
            } catch (error) {
              console.error('Failed to delete habit:', error);
              alert('Failed to delete habit. Please try again.');
            }
          }
        }}
        variant="destructive"
      />
    </div>
  );
}