'use client';

import { useAppStore } from '@/lib/store';
import { X, Trash2 } from 'lucide-react';
import { useEffect } from 'react';

interface PromptLibraryModalProps {
    onClose: () => void;
    onSelect: (content: string) => void;
    type: string;
}

export default function PromptLibraryModal({ onClose, onSelect, type }: PromptLibraryModalProps) {
    const { templates, loadTemplates, deleteTemplate } = useAppStore();

    useEffect(() => {
        loadTemplates();
    }, [loadTemplates]);

    const filteredTemplates = templates.filter(t => t.type === type);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="bg-background border border-border rounded-2xl w-full max-w-2xl p-6 shadow-xl relative animate-in fade-in zoom-in duration-200 max-h-[80vh] flex flex-col">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    <X className="w-5 h-5" />
                </button>

                <h2 className="text-xl font-bold mb-6">Prompt Library ({type})</h2>

                <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                    {filteredTemplates.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            No saved templates found. Save your favorite prompts to see them here!
                        </div>
                    ) : (
                        filteredTemplates.map((template) => (
                            <div
                                key={template.id}
                                className="p-4 bg-muted/50 rounded-xl border border-border hover:border-primary/50 transition-all group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 cursor-pointer" onClick={() => onSelect(template.content)}>
                                        <h3 className="font-medium mb-1 group-hover:text-primary transition-colors">
                                            {template.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {template.content}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm('Delete this template?')) {
                                                deleteTemplate(template.id);
                                            }
                                        }}
                                        className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
