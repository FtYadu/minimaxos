'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { Code, Sparkles, Loader2, Play, Save, BookOpen, FolderOpen } from 'lucide-react';
import PromptLibraryModal from '../PromptLibraryModal';
import { Sandpack } from '@codesandbox/sandpack-react';
import { atomDark } from '@codesandbox/sandpack-themes';

const TEMPLATES = [
  { id: 'react', name: 'React', template: 'react' as const },
  { id: 'react-ts', name: 'React + TypeScript', template: 'react-ts' as const },
  { id: 'vanilla', name: 'Vanilla JS', template: 'vanilla' as const },
  { id: 'vanilla-ts', name: 'Vanilla TS', template: 'vanilla-ts' as const },
];

export default function CodePanel() {
  const { client, addGeneration, generations, saveTemplate } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const [template, setTemplate] = useState<'react' | 'react-ts' | 'vanilla' | 'vanilla-ts'>('react');
  const [generatedCode, setGeneratedCode] = useState<Record<string, string>>({});
  const [showSandbox, setShowSandbox] = useState(false);
  const [pendingGenId, setPendingGenId] = useState<number | null>(null);
  const [showLibrary, setShowLibrary] = useState(false);

  // Watch for pending generation completion
  useEffect(() => {
    if (pendingGenId) {
      const gen = generations.find(g => g.id === pendingGenId);
      if (gen && gen.status === 'completed' && gen.result) {
        setGeneratedCode(gen.result?.files || {});
        setShowSandbox(true);
        setPendingGenId(null);
      } else if (gen && gen.status === 'failed') {
        alert(`Generation failed: ${gen.error}`);
        setPendingGenId(null);
      }
    }
  }, [generations, pendingGenId]);

  const handleSaveTemplate = async () => {
    if (!prompt.trim()) return;
    const name = window.prompt('Enter a name for this template:');
    if (name) {
      await saveTemplate({
        name,
        content: prompt,
        type: 'code',
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
      alert('Please describe the code you want to generate');
      return;
    }

    try {
      const genId = await addGeneration({
        type: 'code',
        status: 'queued',
        prompt,
        model: 'MiniMax-M2',
        parameters: { template },
        createdAt: Date.now(),
      });

      setPendingGenId(genId);
      alert('Code generation task added to queue!');
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
          <h2 className="text-3xl font-bold gradient-text mb-2">Code Sandbox</h2>
          <p className="text-muted-foreground">
            Generate and run code with AI
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

      {!showSandbox ? (
        /* Configuration View */
        <div className="max-w-3xl mx-auto space-y-4">
          {/* Template Selection */}
          <div className="glass-panel p-6 rounded-2xl">
            <label className="block text-sm font-medium mb-3">Template</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.template)}
                  className={`
                    p-4 rounded-xl text-center transition-all
                    ${template === t.template
                      ? 'bg-primary text-primary-foreground ring-2 ring-primary'
                      : 'bg-muted hover:bg-muted/80 text-foreground'
                    }
                  `}
                >
                  <Code className="w-6 h-6 mx-auto mb-2" />
                  <div className="text-sm font-medium">{t.name}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Prompt */}
          <div className="glass-panel p-6 rounded-2xl">
            <label className="block text-sm font-medium mb-3">
              Describe your code
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Create a todo list app with add/remove functionality and local storage..."
              rows={8}
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
            </div>
          </div>

          {/* Examples */}
          <div className="glass-panel p-6 rounded-2xl">
            <h3 className="text-sm font-medium mb-3">💡 Example Prompts</h3>
            <div className="space-y-2">
              {[
                'Create a calculator with basic operations',
                'Build a weather widget that shows temperature and conditions',
                'Make an interactive card flip animation',
                'Create a responsive navbar with dropdown menu',
              ].map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(example)}
                  className="w-full text-left px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg text-sm transition-colors text-muted-foreground hover:text-foreground"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!!pendingGenId || !client || !prompt.trim()}
            className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-500 text-white rounded-xl font-medium hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {pendingGenId ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating Code...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Code
              </>
            )}
          </button>
        </div>
      ) : (
        /* Sandbox View */
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-500 flex items-center justify-center">
                <Play className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Live Sandbox</h3>
                <p className="text-sm text-muted-foreground">
                  Edit and preview your code
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setShowSandbox(false);
                setGeneratedCode({});
              }}
              className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              New Code
            </button>
          </div>

          {/* Code Editor */}
          <div className="glass-panel rounded-2xl overflow-hidden" style={{ height: '600px' }}>
            <Sandpack
              template={template}
              files={generatedCode}
              theme={atomDark}
              options={{
                showNavigator: true,
                showTabs: true,
                showLineNumbers: true,
                showInlineErrors: true,
                wrapContent: true,
                editorHeight: '100%',
                editorWidthPercentage: 50,
              }}
            />
          </div>

          {/* Info */}
          <div className="glass-panel p-4 rounded-xl">
            <p className="text-sm text-muted-foreground">
              💡 You can edit the code directly in the editor and see live changes in the preview panel.
            </p>
          </div>
        </div>
      )}

      {
        showLibrary && (
          <PromptLibraryModal
            type="code"
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
