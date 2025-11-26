'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Upload, Trash2, Download, File, Video, Image, Music, Code, Play, Pause, Grid, List } from 'lucide-react';

export default function MediaGalleryPanel() {
    const { generations, uploads, loadUploads, uploadFile, deleteUpload, deleteGeneration } = useAppStore();
    const [activeTab, setActiveTab] = useState<'generated' | 'uploaded'>('generated');
    const [filterType, setFilterType] = useState<string>('all');
    const [isUploading, setIsUploading] = useState(false);

    useEffect(() => {
        loadUploads();
    }, [loadUploads]);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            await uploadFile(file);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload file');
        } finally {
            setIsUploading(false);
        }
    };

    const getFileIcon = (type: string) => {
        if (type.startsWith('video')) return Video;
        if (type.startsWith('image')) return Image;
        if (type.startsWith('audio')) return Music;
        return File;
    };

    const filteredGenerations = generations.filter(g => {
        if (g.status !== 'completed') return false;
        if (filterType === 'all') return true;
        return g.type === filterType;
    });

    const filteredUploads = uploads.filter(u => {
        if (filterType === 'all') return true;
        if (filterType === 'video') return u.type.startsWith('video');
        if (filterType === 'image') return u.type.startsWith('image');
        if (filterType === 'music') return u.type.startsWith('audio');
        return true;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold gradient-text mb-2">Media Gallery</h2>
                    <p className="text-muted-foreground">
                        Manage your generated and uploaded assets
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={() => setActiveTab('generated')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'generated'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                    >
                        Generated
                    </button>
                    <button
                        onClick={() => setActiveTab('uploaded')}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${activeTab === 'uploaded'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-muted-foreground hover:bg-muted/80'
                            }`}
                    >
                        Uploaded
                    </button>
                </div>
            </div>

            {/* Filters & Actions */}
            <div className="glass-panel p-4 rounded-2xl flex items-center justify-between">
                <div className="flex gap-2">
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                        <option value="all">All Types</option>
                        <option value="video">Video</option>
                        <option value="image">Image</option>
                        <option value="music">Music</option>
                        <option value="text">Text</option>
                        <option value="code">Code</option>
                    </select>
                </div>

                {activeTab === 'uploaded' && (
                    <div>
                        <input
                            type="file"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="file-upload"
                        />
                        <label
                            htmlFor="file-upload"
                            className={`
                flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg cursor-pointer hover:bg-accent/90 transition-colors
                ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
                        >
                            <Upload className="w-4 h-4" />
                            {isUploading ? 'Uploading...' : 'Upload File'}
                        </label>
                    </div>
                )}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {activeTab === 'generated' ? (
                    filteredGenerations.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No generated assets found.
                        </div>
                    ) : (
                        filteredGenerations.map((gen) => {
                            const url = gen.downloadUrl || (gen.result as any)?.audio_url || (gen.result as any)?.audio || (gen.result as any)?.data?.[0]?.url;

                            return (
                                <div key={gen.id} className="glass-panel rounded-xl overflow-hidden group relative">
                                    {/* Preview */}
                                    <div className="aspect-video bg-black/50 flex items-center justify-center relative">
                                        {gen.type === 'image' && url && (
                                            <img src={url} alt={gen.prompt} className="w-full h-full object-cover" />
                                        )}
                                        {gen.type === 'video' && url && (
                                            <video src={url} className="w-full h-full object-cover" controls />
                                        )}
                                        {gen.type === 'music' && (
                                            <div className="text-center p-4">
                                                <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
                                                {url && <audio src={url} controls className="w-full mt-2" />}
                                            </div>
                                        )}
                                        {(gen.type === 'text' || gen.type === 'code') && (
                                            <div className="p-4 text-xs text-muted-foreground overflow-hidden h-full w-full">
                                                {gen.result?.text || gen.result?.code || gen.prompt}
                                            </div>
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium uppercase text-muted-foreground">{gen.type}</span>
                                            <span className="text-xs text-muted-foreground">{new Date(gen.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-sm font-medium truncate mb-4" title={gen.prompt}>{gen.prompt}</p>

                                        <div className="flex gap-2">
                                            {url && (
                                                <a
                                                    href={url}
                                                    download
                                                    className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                                                >
                                                    <Download className="w-4 h-4" />
                                                    Download
                                                </a>
                                            )}
                                            <button
                                                onClick={() => deleteGeneration(gen.id)}
                                                className="p-2 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )
                ) : (
                    filteredUploads.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No uploaded files found.
                        </div>
                    ) : (
                        filteredUploads.map((upload) => {
                            const Icon = getFileIcon(upload.type);
                            const url = URL.createObjectURL(upload.file);

                            return (
                                <div key={upload.id} className="glass-panel rounded-xl overflow-hidden group">
                                    {/* Preview */}
                                    <div className="aspect-video bg-black/50 flex items-center justify-center relative">
                                        {upload.type.startsWith('image') ? (
                                            <img src={url} alt={upload.name} className="w-full h-full object-cover" />
                                        ) : upload.type.startsWith('video') ? (
                                            <video src={url} className="w-full h-full object-cover" controls />
                                        ) : (
                                            <Icon className="w-12 h-12 opacity-50" />
                                        )}
                                    </div>

                                    {/* Info */}
                                    <div className="p-4">
                                        <p className="text-sm font-medium truncate mb-1" title={upload.name}>{upload.name}</p>
                                        <p className="text-xs text-muted-foreground mb-4">
                                            {(upload.file.size / 1024 / 1024).toFixed(2)} MB • {new Date(upload.createdAt).toLocaleDateString()}
                                        </p>

                                        <div className="flex gap-2">
                                            <a
                                                href={url}
                                                download={upload.name}
                                                className="flex-1 flex items-center justify-center gap-2 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download
                                            </a>
                                            <button
                                                onClick={() => deleteUpload(upload.id)}
                                                className="p-2 hover:bg-red-500/10 text-muted-foreground hover:text-red-500 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )
                )}
            </div>
        </div>
    );
}
