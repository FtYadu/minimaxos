'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { db } from '@/lib/db';
import { X, Download, Upload } from 'lucide-react';

export default function SettingsModal() {
    const { settingsModalOpen, setSettingsModalOpen, loadGenerations, loadApiKey } = useAppStore();
    const [importing, setImporting] = useState(false);

    if (!settingsModalOpen) return null;

    const handleExport = async () => {
        try {
            const json = await db.exportDatabase();
            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `minimax-studio-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            alert('Export failed');
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm('This will overwrite your current data. Are you sure?')) {
            e.target.value = '';
            return;
        }

        setImporting(true);
        try {
            const text = await file.text();
            await db.importDatabase(text);
            await loadGenerations();
            await loadApiKey();
            alert('Import successful!');
            setSettingsModalOpen(false);
        } catch (error) {
            console.error('Import failed:', error);
            alert('Import failed: Invalid file');
        } finally {
            setImporting(false);
            e.target.value = '';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background border border-border rounded-2xl w-full max-w-md p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={() => setSettingsModalOpen(false)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-6">Settings & Data</h2>

                <div className="space-y-6">
                    {/* Data Management */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                            Data Management
                        </h3>

                        <button
                            onClick={handleExport}
                            className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-xl transition-colors group"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg group-hover:bg-blue-500/20">
                                    <Download className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium">Export Data</div>
                                    <div className="text-xs text-muted-foreground">Backup your history and settings</div>
                                </div>
                            </div>
                        </button>

                        <div className="relative">
                            <input
                                type="file"
                                accept=".json"
                                onChange={handleImport}
                                disabled={importing}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed z-10"
                            />
                            <div className="w-full flex items-center justify-between p-4 bg-muted/50 hover:bg-muted rounded-xl transition-colors group">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-500/10 text-green-500 rounded-lg group-hover:bg-green-500/20">
                                        <Upload className="w-5 h-5" />
                                    </div>
                                    <div className="text-left">
                                        <div className="font-medium">{importing ? 'Importing...' : 'Import Data'}</div>
                                        <div className="text-xs text-muted-foreground">Restore from a backup file</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
