'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Image as ImageIcon, Sparkles, Download, Loader2, Grid, Save, BookOpen, FolderOpen } from 'lucide-react';
import PromptLibraryModal from '../PromptLibraryModal';
import MediaPickerModal from '../MediaPickerModal';

const IMAGE_MODELS = [
  { id: 'image-01', name: 'Image 01', description: 'High quality image generation' },
  { id: 'image-01-live', name: 'Image 01 Live', description: 'Real-time generation' },
];

const ASPECT_RATIOS = [
  { value: '1:1', label: '1:1 (Square)' },
  { value: '16:9', label: '16:9 (Landscape)' },
  { value: '9:16', label: '9:16 (Portrait)' },
  { value: '4:3', label: '4:3' },
  { value: '3:4', label: '3:4' },
  { value: '3:2', label: '3:2' },
  { value: '2:3', label: '2:3' },
  { value: '21:9', label: '21:9 (Ultrawide)' },
  { value: 'custom', label: 'Custom' },
];

export default function ImagePanel() {
  const { client, addGeneration, generations, saveTemplate } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const [model, setModel] = useState('image-01');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [customWidth, setCustomWidth] = useState(1024);
  const [customHeight, setCustomHeight] = useState(1024);
  const [numImages, setNumImages] = useState(1);
  const [seed, setSeed] = useState<number | undefined>(undefined);
  const [promptOptimizer, setPromptOptimizer] = useState(true);
  const [subjectRef, setSubjectRef] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [showMediaPicker, setShowMediaPicker] = useState(false);

  // Derived state
  const latestImage = generations.find(g => g.type === 'image' && g.status === 'completed');
  const images = Array.isArray(latestImage?.result?.data)
    ? latestImage.result.data.map((img: any) => img.url)
    : [];
  const isQueued = generations.some(g => g.type === 'image' && g.status === 'queued');
  const isProcessing = generations.some(g => g.type === 'image' && g.status === 'processing');

  const handleSaveTemplate = async () => {
    if (!prompt.trim()) return;
    const name = window.prompt('Enter a name for this template:');
    if (name) {
      await saveTemplate({
        name,
        content: prompt,
        type: 'image',
      });
      alert('Template saved!');
    }
  };

  const handleGenerate = async () => {
    if (!client) {
      alert('Please configure your API key first');
      return;
    }

    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }

    setIsSubmitting(true);

    try {
      await addGeneration({
        type: 'image',
        status: 'queued',
        prompt,
        model,
        parameters: {
          aspect_ratio: aspectRatio !== 'custom' ? aspectRatio : undefined,
          width: aspectRatio === 'custom' ? customWidth : undefined,
          height: aspectRatio === 'custom' ? customHeight : undefined,
          n: numImages,
          seed,
          prompt_optimizer: promptOptimizer,
        },
        createdAt: Date.now(),
      });

      alert('Image generation task added to queue!');
    } catch (error: any) {
      console.error('Queue error:', error);
      alert(`Failed to add to queue: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Image Generation</h2>
          <p className="text-muted-foreground">
            Create stunning images with AI
          </p>
        </div>
        <button
          onClick={() => useAppStore.getState().setActiveTab('media')}
          className="flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm font-medium"
        >
          <FolderOpen className="w-4 h-4" />
          Open Gallery
        </button>
      </div>

      {/* Media Picker Modal */}
      {showMediaPicker && (
        <MediaPickerModal
          acceptedTypes="image"
          onClose={() => setShowMediaPicker(false)}
          onSelect={async (fileOrUrl) => {
            if (fileOrUrl instanceof File) {
              setSubjectRef(fileOrUrl);
            } else {
              try {
                const response = await fetch(fileOrUrl);
                const blob = await response.blob();
                const file = new File([blob], 'reference-image.jpg', { type: blob.type });
                setSubjectRef(file);
              } catch (e) {
                console.error('Failed to convert URL to file', e);
                alert('Could not load selected image');
              }
            }
            setShowMediaPicker(false);
          }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Configuration */}
        <div className="lg:col-span-2 space-y-4">
          {/* Model Selection */}
          <div className="glass-panel p-6 rounded-2xl">
            <label className="block text-sm font-medium mb-3">Model</label>
            <div className="grid grid-cols-2 gap-3">
              {IMAGE_MODELS.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModel(m.id)}
                  className={`
                    p-4 rounded-xl text-left transition-all
                    ${model === m.id
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                    }
                  `}
                >
                  <div className="font-medium mb-1">{m.name}</div>
                  <div className="text-xs opacity-70">{m.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div className="glass-panel p-6 rounded-2xl">
            <label className="block text-sm font-medium mb-3">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to create... (max 1500 characters)"
              maxLength={1500}
              rows={6}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLibrary(true)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:text-foreground transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  Load
                </button>
                <button
                  onClick={handleSaveTemplate}
                  disabled={!prompt.trim()}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium bg-muted text-muted-foreground hover:text-foreground transition-all disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">
                  {prompt.length}/1500 characters
                </span>
                <button
                  onClick={() => setPromptOptimizer(!promptOptimizer)}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                    ${promptOptimizer
                      ? 'bg-primary/20 text-primary'
                      : 'bg-muted text-muted-foreground'
                    }
                  `}
                >
                  <Sparkles className="w-4 h-4" />
                  Prompt Optimizer {promptOptimizer ? 'ON' : 'OFF'}
                </button>
              </div>
            </div>
          </div>

          {/* Aspect Ratio */}
          <div className="glass-panel p-6 rounded-2xl">
            <label className="block text-sm font-medium mb-3">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
              {ASPECT_RATIOS.map((ar) => (
                <button
                  key={ar.value}
                  onClick={() => setAspectRatio(ar.value)}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${aspectRatio === ar.value
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }
                  `}
                >
                  {ar.label}
                </button>
              ))}
            </div>

            {/* Custom Dimensions */}
            {aspectRatio === 'custom' && (
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium mb-2 text-muted-foreground">
                    Width (512-2048px)
                  </label>
                  <input
                    type="number"
                    value={customWidth}
                    onChange={(e) => setCustomWidth(Number(e.target.value))}
                    min={512}
                    max={2048}
                    step={8}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-2 text-muted-foreground">
                    Height (512-2048px)
                  </label>
                  <input
                    type="number"
                    value={customHeight}
                    onChange={(e) => setCustomHeight(Number(e.target.value))}
                    min={512}
                    max={2048}
                    step={8}
                    className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Advanced Settings */}
          <div className="glass-panel p-6 rounded-2xl">
            <label className="block text-sm font-medium mb-3">Advanced Settings</label>
            <div className="space-y-4">
              {/* Number of Images */}
              <div>
                <label className="block text-xs font-medium mb-2 text-muted-foreground">
                  Number of Images (1-9)
                </label>
                <input
                  type="number"
                  value={numImages}
                  onChange={(e) => setNumImages(Math.min(9, Math.max(1, Number(e.target.value))))}
                  min={1}
                  max={9}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              {/* Seed */}
              <div>
                <label className="block text-xs font-medium mb-2 text-muted-foreground">
                  Seed (Optional - for reproducibility)
                </label>
                <input
                  type="number"
                  value={seed || ''}
                  onChange={(e) => setSeed(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Random"
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
                />
              </div>

              {/* Subject Reference */}
              <div>
                <label className="block text-xs font-medium mb-2 text-muted-foreground">
                  Subject Reference (Optional - for character consistency)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSubjectRef(e.target.files?.[0] || null)}
                  className="hidden"
                  id="subject-ref"
                />
                <label
                  htmlFor="subject-ref"
                  className="block px-4 py-3 bg-muted border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:bg-muted/80 transition-colors text-muted-foreground"
                >
                  {subjectRef ? subjectRef.name : 'Upload subject reference image'}
                </label>
                <button
                  onClick={() => setShowMediaPicker(true)}
                  className="w-full mt-2 text-xs text-primary hover:underline flex items-center justify-center gap-1"
                >
                  <FolderOpen className="w-3 h-3" /> Select from Gallery
                </button>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isSubmitting || !client}
            className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Adding to Queue...
              </>
            ) : (
              <>
                <ImageIcon className="w-5 h-5" />
                Generate {numImages > 1 ? `${numImages} Images` : 'Image'}
              </>
            )}
          </button>

          {/* Queue Status */}
          {(isQueued || isProcessing) && (
            <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <div>
                <p className="font-medium">Processing Queue</p>
                <p className="text-xs text-muted-foreground">
                  {isProcessing ? 'Generating images...' : 'Waiting in queue...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl sticky top-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Grid className="w-5 h-5" />
              Generated Images
            </h3>

            {images.length > 0 ? (
              <div className="space-y-4">
                <div className={`grid gap-3 ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                  {images.map((url: string, idx: number) => (
                    <div key={idx} className="relative group">
                      <img
                        src={url}
                        alt={`Generated ${idx + 1}`}
                        className="w-full rounded-lg"
                      />
                      <a
                        href={url}
                        download
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg"
                      >
                        <Download className="w-6 h-6 text-white" />
                      </a>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-yellow-500 bg-yellow-500/10 p-2 rounded">
                  ⚠️ URLs expire after 24 hours. Download now!
                </p>
              </div>
            ) : (
              <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Your images will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {
        showLibrary && (
          <PromptLibraryModal
            type="image"
            onClose={() => setShowLibrary(false)}
            onSelect={(content) => {
              setPrompt(content);
              setShowLibrary(false);
            }}
          />
        )
      }
    </div>
  );
}
