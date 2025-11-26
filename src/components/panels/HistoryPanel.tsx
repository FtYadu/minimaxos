'use client';

import { useState, useMemo } from 'react';
import { useAppStore } from '@/lib/store';
import { Generation } from '@/lib/db';
import {
    Search, Filter, Calendar, Video, Image,
    MessageSquare, Music, Code, Trash2, ExternalLink,
    CheckCircle2, XCircle, Clock, Loader2
} from 'lucide-react';

const TYPE_ICONS = {
    video: Video,
    image: Image,
    text: MessageSquare,
    music: Music,
    code: Code,
};

const STATUS_ICONS = {
    queued: Clock,
    processing: Loader2,
    completed: CheckCircle2,
    failed: XCircle,
    pending: Clock,
};

export default function HistoryPanel() {
    const { generations, deleteGeneration } = useAppStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

    const filteredGenerations = useMemo(() => {
        return generations
            .filter((gen) => {
                const matchesSearch = gen.prompt.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesType = typeFilter === 'all' || gen.type === typeFilter;
                const matchesStatus = statusFilter === 'all' || gen.status === statusFilter;
                return matchesSearch && matchesType && matchesStatus;
            })
            .sort((a, b) => {
                return sortOrder === 'desc'
                    ? b.createdAt - a.createdAt
                    : a.createdAt - b.createdAt;
            });
    }, [generations, searchTerm, typeFilter, statusFilter, sortOrder]);

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this generation?')) {
            await deleteGeneration(id);
        }
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleString();
    };

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold gradient-text mb-2">History</h2>
                <p className="text-muted-foreground">
                    View and manage your generation history
                </p>
            </div>

            {/* Filters */}
            <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search prompts..."
                        className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                    />
                </div>

                <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">All Types</option>
                        <option value="video">Video</option>
                        <option value="image">Image</option>
                        <option value="text">Text</option>
                        <option value="music">Music</option>
                        <option value="code">Code</option>
                    </select>

                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">All Status</option>
                        <option value="completed">Completed</option>
                        <option value="processing">Processing</option>
                        <option value="queued">Queued</option>
                        <option value="failed">Failed</option>
                    </select>

                    <button
                        onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
                        className="px-3 py-2 bg-muted border border-border rounded-lg text-sm hover:bg-muted/80 transition-colors flex items-center gap-2"
                    >
                        <Calendar className="w-4 h-4" />
                        {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
                    </button>
                </div>
            </div>

            {/* List */}
            <div className="space-y-4">
                {filteredGenerations.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">
                        <Filter className="w-12 h-12 mx-auto mb-3 opacity-20" />
                        <p>No generations found matching your filters</p>
                    </div>
                ) : (
                    filteredGenerations.map((gen) => {
                        const TypeIcon = TYPE_ICONS[gen.type as keyof typeof TYPE_ICONS] || Sparkles;
                        const StatusIcon = STATUS_ICONS[gen.status as keyof typeof STATUS_ICONS] || Clock;

                        return (
                            <div
                                key={gen.id}
                                className="glass-panel p-4 rounded-xl flex flex-col md:flex-row gap-4 items-start md:items-center hover:bg-muted/50 transition-colors"
                            >
                                {/* Icon */}
                                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                  ${gen.status === 'completed' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}
                `}>
                                    <TypeIcon className="w-5 h-5" />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium capitalize">{gen.type}</span>
                                        <span className="text-xs text-muted-foreground">•</span>
                                        <span className="text-xs text-muted-foreground">{formatDate(gen.createdAt)}</span>
                                        <span className={`
                      text-xs px-2 py-0.5 rounded-full flex items-center gap-1
                      ${gen.status === 'completed' ? 'bg-green-500/10 text-green-500' : ''}
                      ${gen.status === 'failed' ? 'bg-red-500/10 text-red-500' : ''}
                      ${gen.status === 'processing' ? 'bg-blue-500/10 text-blue-500' : ''}
                      ${gen.status === 'queued' ? 'bg-yellow-500/10 text-yellow-500' : ''}
                    `}>
                                            <StatusIcon className={`w-3 h-3 ${gen.status === 'processing' ? 'animate-spin' : ''}`} />
                                            <span className="capitalize">{gen.status}</span>
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground truncate">{gen.prompt}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 w-full md:w-auto justify-end">
                                    {gen.status === 'completed' && (
                                        <a
                                            href={gen.downloadUrl || (gen.result as any)?.audio_url || (gen.result as any)?.audio || (gen.result as any)?.data?.[0]?.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 hover:bg-muted rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                                            title="Open Result"
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                    <button
                                        onClick={() => handleDelete(gen.id)}
                                        className="p-2 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}

// Helper for default icon
import { Sparkles } from 'lucide-react';
