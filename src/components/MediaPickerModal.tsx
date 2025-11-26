'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { X, Upload, Image as ImageIcon, Video, Music, File, Search } from 'lucide-react';

interface MediaPickerModalProps {
    onClose: () => void;
    onSelect: (file: File | string) => void; // Returns File object or URL string
    acceptedTypes?: 'image' | 'video' | 'audio' | 'all';
}

export default function MediaPickerModal({ onClose, onSelect, acceptedTypes = 'all' }: MediaPickerModalProps) {
    const { generations, uploads, loadUploads, uploadFile } = useAppStore();
    const [activeTab, setActiveTab] = useState<'generated' | 'uploaded'>('generated');
    const [search, setSearch] = useState('');
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
            // Auto-select the uploaded file? Maybe just switch to uploaded tab
            setActiveTab('uploaded');
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Failed to upload file');
        } finally {
            setIsUploading(false);
        }
    };

    const filterItem = (type: string) => {
        if (acceptedTypes === 'all') return true;
        return type.startsWith(acceptedTypes);
    };

    const filteredGenerations = generations.filter(g => {
        if (g.status !== 'completed') return false;
        if (!filterItem(g.type)) return false;
        if (search && !g.prompt.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const filteredUploads = uploads.filter(u => {
        if (!filterItem(u.type)) return false;
        if (search && !u.name.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
    });

    const handleSelectGenerated = (gen: any) => {
        const url = gen.downloadUrl || (gen.result as any)?.audio_url || (gen.result as any)?.audio || (gen.result as any)?.data?.[0]?.url;
        if (url) {
            onSelect(url);
            onClose();
        }
    };

    const handleSelectUpload = (upload: any) => {
        onSelect(upload.file);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-background border border-border rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-border flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-semibold">Select Media</h3>
                        <p className="text-sm text-muted-foreground">
                            Choose from generated assets or upload new
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-muted rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Controls */}
                <div className="p-4 border-b border-border flex flex-col md:flex-row gap-4 justify-between items-center bg-muted/30">
                    <div className="flex gap-2 w-full md:w-auto">
                        <button
                            onClick={() => setActiveTab('generated')}
                            className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'generated'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-background hover:bg-muted border border-border'
                                }`}
                        >
                            Generated
                        </button>
                        <button
                            onClick={() => setActiveTab('uploaded')}
                            className={`flex-1 md:flex-none px-4 py-2 rounded-lg font-medium text-sm transition-colors ${activeTab === 'uploaded'
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-background hover:bg-muted border border-border'
                                }`}
                        >
                            Uploaded
                        </button>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="Search..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type="file"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="modal-file-upload"
                                accept={acceptedTypes === 'image' ? 'image/*' : acceptedTypes === 'video' ? 'video/*' : acceptedTypes === 'audio' ? 'audio/*' : '*/*'}
                            />
                            <label
                                htmlFor="modal-file-upload"
                                className={`
                  flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg cursor-pointer hover:bg-accent/90 transition-colors text-sm font-medium whitespace-nowrap
                  ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                            >
                                <Upload className="w-4 h-4" />
                                {isUploading ? '...' : 'Upload'}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Grid */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {activeTab === 'generated' ? (
                            filteredGenerations.length === 0 ? (
                                <div className="col-span-full text-center py-12 text-muted-foreground">
                                    No matching generated assets found.
                                </div>
                            ) : (
                                filteredGenerations.map((gen) => {
                                    const url = gen.downloadUrl || (gen.result as any)?.audio_url || (gen.result as any)?.audio || (gen.result as any)?.data?.[0]?.url;
                                    if (!url) return null;

                                    return (
                                        <button
                                            key={gen.id}
                                            onClick={() => handleSelectGenerated(gen)}
                                            className="group relative aspect-square rounded-xl overflow-hidden border border-border hover:ring-2 hover:ring-primary transition-all text-left"
                                        >
                                            {gen.type === 'image' && (
                                                <img src={url} alt={gen.prompt} className="w-full h-full object-cover" />
                                            )}
                                            {gen.type === 'video' && (
                                                <video src={url} className="w-full h-full object-cover" />
                                            )}
                                            {gen.type === 'music' && (
                                                <div className="w-full h-full bg-muted flex flex-col items-center justify-center p-4">
                                                    <Music className="w-8 h-8 mb-2 opacity-50" />
                                                    <span className="text-xs text-center line-clamp-2">{gen.prompt}</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Select</span>
                                            </div>
                                        </button>
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
                                    const url = URL.createObjectURL(upload.file);
                                    return (
                                        <button
                                            key={upload.id}
                                            onClick={() => handleSelectUpload(upload)}
                                            className="group relative aspect-square rounded-xl overflow-hidden border border-border hover:ring-2 hover:ring-primary transition-all text-left"
                                        >
                                            {upload.type.startsWith('image') ? (
                                                <img src={url} alt={upload.name} className="w-full h-full object-cover" />
                                            ) : upload.type.startsWith('video') ? (
                                                <video src={url} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-muted flex flex-col items-center justify-center p-4">
                                                    <File className="w-8 h-8 mb-2 opacity-50" />
                                                    <span className="text-xs text-center line-clamp-2">{upload.name}</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">Select</span>
                                            </div>
                                        </button>
                                    );
                                })
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
