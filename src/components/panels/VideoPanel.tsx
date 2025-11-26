'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Play, Image as ImageIcon, Settings, Sparkles, Download, Loader2, Save, BookOpen, FolderOpen } from 'lucide-react';
import PromptLibraryModal from '../PromptLibraryModal';
import MediaPickerModal from '../MediaPickerModal';

const VIDEO_MODELS = [
  { id: 'MiniMax-Hailuo-2.3', name: 'Hailuo 2.3', description: 'Production quality T2V/I2V' },
  { id: 'MiniMax-Hailuo-2.3-Fast', name: 'Hailuo 2.3 Fast', description: 'Quick preview generation' },
  { id: 'MiniMax-Hailuo-02', name: 'Hailuo 02', description: 'First/last frame interpolation' },
  { id: 'MiniMax-Video-01-Director', name: 'Director (T2V)', description: 'Cinematic camera control' },
  { id: 'MiniMax-Video-01-I2V-Director', name: 'Director (I2V)', description: 'Image to video with camera' },
  { id: 'MiniMax-Video-01-I2V-live', name: 'Live Animation', description: 'Stylized animation' },
  { id: 'MiniMax-Video-01-S2V', name: 'Subject Consistency', description: 'Character reference' },
];

const CAMERA_COMMANDS = [
  'Truck left', 'Truck right', 'Pan left', 'Pan right',
  'Push in', 'Pull out', 'Pedestal up', 'Pedestal down',
  'Tilt up', 'Tilt down', 'Zoom in', 'Zoom out',
  'Shake', 'Tracking shot', 'Static shot'
];

const RESOLUTIONS = ['512P', '720P', '768P', '1080P'];
const DURATIONS = [6, 10];

export default function VideoPanel() {
  const { client, addGeneration, generations, saveTemplate } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const [showLibrary, setShowLibrary] = useState(false);
  const [model, setModel] = useState('MiniMax-Hailuo-2.3');
  const [duration, setDuration] = useState<6 | 10>(6);
  const [resolution, setResolution] = useState('1080P');
  const [cameraCommands, setCameraCommands] = useState<string[]>([]);
  const [promptOptimizer, setPromptOptimizer] = useState(true);
  const [firstFrame, setFirstFrame] = useState<File | null>(null);
  const [lastFrame, setLastFrame] = useState<File | null>(null);
  const [showMediaPicker, setShowMediaPicker] = useState<'first' | 'last' | null>(null);


  // Derived state
  const latestVideo = generations.find(g => g.type === 'video' && g.status === 'completed');
  const videoUrl = latestVideo?.downloadUrl;
  const isQueued = generations.some(g => g.type === 'video' && g.status === 'queued');
  const isProcessing = generations.some(g => g.type === 'video' && g.status === 'processing');

  const toggleCameraCommand = (command: string) => {
    setCameraCommands(prev =>
      prev.includes(command)
        ? prev.filter(c => c !== command)
        : [...prev, command].slice(0, 3) // Max 3 commands
    );
  };

  const buildPromptWithCamera = () => {
    if (cameraCommands.length === 0) return prompt;
    const commands = cameraCommands.map(c => `[${c}]`).join(',');
    return `${prompt} ${commands}`;
  };

  const handleSaveTemplate = async () => {
    if (!prompt.trim()) return;
    const name = window.prompt('Enter a name for this template:');
    if (name) {
      await saveTemplate({
        name,
        content: prompt,
        type: 'video',
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

    try {
      await addGeneration({
        type: 'video',
        status: 'queued',
        prompt: buildPromptWithCamera(),
        model,
        parameters: {
          duration,
          resolution,
          prompt_optimizer: promptOptimizer,
          camera_commands: cameraCommands,
          firstFrame,
          lastFrame,
        },
        createdAt: Date.now(),
      });

      alert('Video added to queue!');
      // Optional: Reset form
      // setPrompt('');
    } catch (error: any) {
      console.error('Queue error:', error);
      alert(`Failed to add to queue: ${error.message}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Video Generation</h2>
          <p className="text-muted-foreground">
            Create cinematic videos with AI using MiniMax Hailuo models
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
          onClose={() => setShowMediaPicker(null)}
          onSelect={async (fileOrUrl) => {
            if (fileOrUrl instanceof File) {
              if (showMediaPicker === 'first') setFirstFrame(fileOrUrl);
              else setLastFrame(fileOrUrl);
            } else {
              // Convert URL to File object if possible, or handle URL directly
              // For now, we'll fetch the URL and convert to Blob -> File
              try {
                const response = await fetch(fileOrUrl);
                const blob = await response.blob();
                const file = new File([blob], 'selected-image.jpg', { type: blob.type });
                if (showMediaPicker === 'first') setFirstFrame(file);
                else setLastFrame(file);
              } catch (e) {
                console.error('Failed to convert URL to file', e);
                alert('Could not load selected image');
              }
            }
            setShowMediaPicker(null);
          }}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Configuration */}
        <div className="lg:col-span-2 space-y-4">
          {/* Model Selection */}
          <div className="glass-panel p-6 rounded-2xl">
            <label className="block text-sm font-medium mb-3">Model</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {VIDEO_MODELS.map((m) => (
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
              placeholder="Describe the video you want to create... (max 2000 characters)"
              maxLength={2000}
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
                  {prompt.length}/2000 characters
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

          {/* Camera Commands */}
          <div className="glass-panel p-6 rounded-2xl">
            <label className="block text-sm font-medium mb-3">
              Camera Movements (Select up to 3)
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {CAMERA_COMMANDS.map((cmd) => (
                <button
                  key={cmd}
                  onClick={() => toggleCameraCommand(cmd)}
                  disabled={!cameraCommands.includes(cmd) && cameraCommands.length >= 3}
                  className={`
                    px-3 py-2 rounded-lg text-sm font-medium transition-all
                    ${cameraCommands.includes(cmd)
                      ? 'bg-accent text-accent-foreground'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {cmd}
                </button>
              ))}
            </div>
            {cameraCommands.length > 0 && (
              <div className="mt-3 p-3 bg-accent/10 rounded-lg">
                <p className="text-sm text-accent font-medium">
                  Selected: {cameraCommands.join(', ')}
                </p>
              </div>
            )}
          </div>

          {/* Duration & Resolution */}
          <div className="glass-panel p-6 rounded-2xl">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-3">Duration</label>
                <div className="flex gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDuration(d as 6 | 10)}
                      className={`
                        flex-1 px-4 py-3 rounded-lg font-medium transition-all
                        ${duration === d
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                        }
                      `}
                    >
                      {d}s
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-3">Resolution</label>
                <select
                  value={resolution}
                  onChange={(e) => setResolution(e.target.value)}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                >
                  {RESOLUTIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Frame Images */}
          <div className="glass-panel p-6 rounded-2xl">
            <label className="block text-sm font-medium mb-3">
              <ImageIcon className="w-4 h-4 inline mr-2" />
              First/Last Frame (Optional)
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFirstFrame(e.target.files?.[0] || null)}
                  className="hidden"
                  id="first-frame"
                />
                <label
                  htmlFor="first-frame"
                  className="block px-4 py-3 bg-muted border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:bg-muted/80 transition-colors"
                >
                  {firstFrame ? firstFrame.name : 'First Frame'}
                </label>
                <button
                  onClick={() => setShowMediaPicker('first')}
                  className="w-full mt-2 text-xs text-primary hover:underline flex items-center justify-center gap-1"
                >
                  <FolderOpen className="w-3 h-3" /> Select from Gallery
                </button>
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setLastFrame(e.target.files?.[0] || null)}
                  className="hidden"
                  id="last-frame"
                />
                <label
                  htmlFor="last-frame"
                  className="block px-4 py-3 bg-muted border-2 border-dashed border-border rounded-lg text-center cursor-pointer hover:bg-muted/80 transition-colors"
                >
                  {lastFrame ? lastFrame.name : 'Last Frame'}
                </label>
                <button
                  onClick={() => setShowMediaPicker('last')}
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
            disabled={!client}
            className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Add to Queue
          </button>

          {/* Queue Status */}
          {(isQueued || isProcessing) && (
            <div className="glass-panel p-4 rounded-xl flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <div>
                <p className="font-medium">Processing Queue</p>
                <p className="text-xs text-muted-foreground">
                  {isProcessing ? 'Generating video...' : 'Waiting in queue...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Preview */}
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Preview</h3>

            {videoUrl ? (
              <div className="space-y-4">
                <video
                  src={videoUrl}
                  controls
                  className="w-full rounded-lg bg-black"
                />
                <a
                  href={videoUrl}
                  download
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download Video
                </a>
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Play className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Your video will appear here</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showLibrary && (
        <PromptLibraryModal
          type="video"
          onClose={() => setShowLibrary(false)}
          onSelect={(content) => {
            setPrompt(content);
            setShowLibrary(false);
          }}
        />
      )}
    </div>
  );
}
