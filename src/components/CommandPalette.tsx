'use client';

import { useEffect, useState } from 'react';
import { Command } from 'cmdk';
import { useAppStore } from '@/lib/store';
import {
    Video, Image, MessageSquare, Music, Code,
    History, FolderOpen, Settings, Search, Command as CommandIcon, LayoutDashboard
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CommandPalette() {
    const [open, setOpen] = useState(false);
    const { setActiveTab, sidebarOpen, setSidebarOpen, setSettingsModalOpen } = useAppStore();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]">
            <div className="w-full max-w-lg bg-background border border-border rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <Command className="w-full">
                    <div className="flex items-center border-b border-border px-4" cmdk-input-wrapper="">
                        <Search className="w-5 h-5 text-muted-foreground mr-2" />
                        <Command.Input
                            placeholder="Type a command or search..."
                            className="flex-1 py-4 bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
                        />
                        <div className="flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                            <span className="text-xs">ESC</span>
                        </div>
                    </div>

                    <Command.List className="max-h-[300px] overflow-y-auto p-2">
                        <Command.Empty className="py-6 text-center text-muted-foreground">
                            No results found.
                        </Command.Empty>

                        <Command.Group heading="Navigation" className="text-xs font-medium text-muted-foreground px-2 py-1.5 mb-2">
                            <Command.Item
                                onSelect={() => runCommand(() => setActiveTab('video'))}
                                className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-foreground hover:bg-muted cursor-pointer aria-selected:bg-muted"
                            >
                                <Video className="w-4 h-4" />
                                <span>Video Generation</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => setActiveTab('image'))}
                                className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-foreground hover:bg-muted cursor-pointer aria-selected:bg-muted"
                            >
                                <Image className="w-4 h-4" />
                                <span>Image Generation</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => setActiveTab('text'))}
                                className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-foreground hover:bg-muted cursor-pointer aria-selected:bg-muted"
                            >
                                <MessageSquare className="w-4 h-4" />
                                <span>Text Generation</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => setActiveTab('music'))}
                                className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-foreground hover:bg-muted cursor-pointer aria-selected:bg-muted"
                            >
                                <Music className="w-4 h-4" />
                                <span>Music Generation</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => setActiveTab('code'))}
                                className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-foreground hover:bg-muted cursor-pointer aria-selected:bg-muted"
                            >
                                <Code className="w-4 h-4" />
                                <span>Code Sandbox</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => setActiveTab('history'))}
                                className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-foreground hover:bg-muted cursor-pointer aria-selected:bg-muted"
                            >
                                <History className="w-4 h-4" />
                                <span>History</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => setActiveTab('media'))}
                                className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-foreground hover:bg-muted cursor-pointer aria-selected:bg-muted"
                            >
                                <FolderOpen className="w-4 h-4" />
                                <span>Media Gallery</span>
                            </Command.Item>
                        </Command.Group>

                        <Command.Separator className="h-px bg-border my-2" />

                        <Command.Group heading="Settings" className="text-xs font-medium text-muted-foreground px-2 py-1.5 mb-2">
                            <Command.Item
                                onSelect={() => runCommand(() => setSettingsModalOpen(true))}
                                className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-foreground hover:bg-muted cursor-pointer aria-selected:bg-muted"
                            >
                                <Settings className="w-4 h-4" />
                                <span>Open Settings</span>
                            </Command.Item>
                            <Command.Item
                                onSelect={() => runCommand(() => setSidebarOpen(!sidebarOpen))}
                                className="flex items-center gap-2 px-2 py-2 rounded-lg text-sm text-foreground hover:bg-muted cursor-pointer aria-selected:bg-muted"
                            >
                                <CommandIcon className="w-4 h-4" />
                                <span>Toggle Sidebar</span>
                            </Command.Item>
                        </Command.Group>
                    </Command.List>
                </Command>
            </div>

            {/* Overlay to close on click outside */}
            <div
                className="absolute inset-0 -z-10"
                onClick={() => setOpen(false)}
            />
        </div>
    );
}
