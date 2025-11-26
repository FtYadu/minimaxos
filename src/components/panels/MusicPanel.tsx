'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { Music, Loader2, Download, Play, Pause, Save, BookOpen, FolderOpen } from 'lucide-react';
import AudioVisualizer from '../AudioVisualizer';
import PromptLibraryModal from '../PromptLibraryModal';

const STRUCTURE_TAGS = ['[Intro]', '[Verse]', '[Chorus]', '[Bridge]', '[Outro]'];

const SAMPLE_RATES = [32000, 44100];
const BITRATES = [128000, 256000];
const FORMATS = ['mp3', 'pcm', 'flac', 'wav'];

export default function MusicPanel() {
  const { client, addGeneration, generations, saveTemplate } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const [lyrics, setLyrics] = useState('');
  const [sampleRate, setSampleRate] = useState(44100);
  const [bitrate, setBitrate] = useState(128000);
  const [format, setFormat] = useState('mp3');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Derived state
  const latestMusic = generations.find(g => g.type === 'music' && g.status === 'completed');
  const audioUrl = latestMusic?.downloadUrl || latestMusic?.result?.audio_url || latestMusic?.result?.audio;
  const isQueued = generations.some(g => g.type === 'music' && g.status === 'queued');
  const isProcessing = generations.some(g => g.type === 'music' && g.status === 'processing');

  const insertTag = (tag: string) => {
    const textarea = document.getElementById('lyrics-input') as HTMLTextAreaElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = lyrics.substring(0, start) + tag + '\n' + lyrics.substring(end);
    setLyrics(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + tag.length + 1, start + tag.length + 1);
    }, 0);
  };

  const handleSaveTemplate = async () => {
    if (!prompt.trim()) return;
    const name = window.prompt('Enter a name for this template:');
    if (name) {
      await saveTemplate({
        name,
        content: prompt,
        type: 'music',
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
      alert('Please enter a prompt describing the music style/mood');
      return;
    }

    setIsSubmitting(true);

    try {
      await addGeneration({
        type: 'music',
        status: 'queued',
        prompt,
        model: 'music-2.0',
        parameters: {
          lyrics: lyrics || undefined,
          sample_rate: sampleRate,
          bitrate,
          format,
        },
        createdAt: Date.now(),
      });

      alert('Music added to queue!');
    } catch (error: any) {
      console.error('Queue error:', error);
      alert(`Failed to add to queue: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePlayPause = () => {
    const audio = document.getElementById('audio-player') as HTMLAudioElement;
    if (audio) {
      if (isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Music Generation</h2>
          <p className="text-muted-foreground">
            Create original music with AI
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Panel - Configuration */}
        <div className="lg:col-span-2 space-y-4">
          {/* Style/Mood Prompt */}
          <div className="glass-panel p-6 rounded-2xl">
            <label className="block text-sm font-medium mb-3">
              Music Style & Mood
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the style, mood, genre, instruments... (e.g., 'Upbeat electronic pop with synthesizers and energetic drums')"
              maxLength={2000}
              rows={4}
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
              <span className="text-sm text-muted-foreground">
                {prompt.length}/2000 characters
              </span>
            </div>
          </div>

          {/* Lyrics */}
          <div className="glass-panel p-6 rounded-2xl">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">
                Lyrics (Optional)
              </label>
              <div className="flex gap-2">
                {STRUCTURE_TAGS.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => insertTag(tag)}
                    className="px-2 py-1 text-xs bg-muted hover:bg-muted/80 rounded transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
            <textarea
              id="lyrics-input"
              value={lyrics}
              onChange={(e) => setLyrics(e.target.value)}
              placeholder="Enter your lyrics here with structure tags like [Verse], [Chorus], etc."
              maxLength={3000}
              rows={12}
              className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground resize-none font-mono text-sm"
            />
            <span className="text-sm text-muted-foreground mt-2 block">
              {lyrics.length}/3000 characters
            </span>
          </div>

          {/* Audio Settings */}
          <div className="glass-panel p-6 rounded-2xl">
            <label className="block text-sm font-medium mb-4">Audio Settings</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium mb-2 text-muted-foreground">
                  Sample Rate
                </label>
                <select
                  value={sampleRate}
                  onChange={(e) => setSampleRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
                >
                  {SAMPLE_RATES.map((rate) => (
                    <option key={rate} value={rate}>{rate} Hz</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-2 text-muted-foreground">
                  Bitrate
                </label>
                <select
                  value={bitrate}
                  onChange={(e) => setBitrate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
                >
                  {BITRATES.map((rate) => (
                    <option key={rate} value={rate}>{rate / 1000} kbps</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium mb-2 text-muted-foreground">
                  Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full px-3 py-2 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground text-sm"
                >
                  {FORMATS.map((fmt) => (
                    <option key={fmt} value={fmt}>{fmt.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isSubmitting || !client}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Adding to Queue...
              </>
            ) : (
              <>
                <Music className="w-5 h-5" />
                Generate Music
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
                  {isProcessing ? 'Generating music...' : 'Waiting in queue...'}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Player */}
        <div className="space-y-4">
          <div className="glass-panel p-6 rounded-2xl sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Audio Player</h3>

            {audioUrl ? (
              <div className="space-y-4">
                {/* Waveform Visual */}
                <div className="aspect-video bg-black rounded-lg flex items-center justify-center relative overflow-hidden">
                  <AudioVisualizer audioUrl={audioUrl} isPlaying={isPlaying} />
                </div>

                {/* Audio Element */}
                <audio
                  id="audio-player"
                  src={audioUrl}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full"
                  controls
                />

                {/* Controls */}
                <div className="flex gap-2">
                  <button
                    onClick={togglePlayPause}
                    className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-5 h-5" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Play
                      </>
                    )}
                  </button>
                  <a
                    href={audioUrl}
                    download
                    className="flex-1 py-3 bg-accent text-accent-foreground rounded-lg font-medium hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" />
                    Download
                  </a>
                </div>

                {/* Info */}
                <div className="text-xs text-center text-muted-foreground">
                  <p>🎵 Duration: ~5 minutes</p>
                  <p>💰 Cost: $0.03 per track</p>
                </div>
              </div>
            ) : (
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <Music className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Your music will appear here</p>
                </div>
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="glass-panel p-4 rounded-2xl">
            <h4 className="text-sm font-medium mb-2">💡 Tips</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Be specific about genre and mood</li>
              <li>• Use structure tags for better results</li>
              <li>• Lyrics are optional but add character</li>
              <li>• Higher bitrate = better quality</li>
            </ul>
          </div>
        </div>
      </div>


      {
        showLibrary && (
          <PromptLibraryModal
            type="music"
            onClose={() => setShowLibrary(false)}
            onSelect={(content) => {
              setPrompt(content);
              setShowLibrary(false);
            }}
          />
        )
      }
    </div >
  );
}
