'use client';

import { useState } from 'react';
import { useAppStore } from '@/lib/store';
import { X, Key, Globe, AlertCircle } from 'lucide-react';

interface ApiKeyModalProps {
  onClose?: () => void;
}

export default function ApiKeyModal({ onClose }: ApiKeyModalProps) {
  const { apiKey, region, setApiKey, clearApiKey } = useAppStore();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [selectedRegion, setSelectedRegion] = useState<'international' | 'china'>(region);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!inputKey.trim()) {
      setError('API key is required');
      return;
    }

    try {
      await setApiKey(inputKey.trim(), selectedRegion);
      onClose?.();
    } catch (err) {
      setError('Failed to save API key');
    }
  };

  const handleClear = async () => {
    await clearApiKey();
    setInputKey('');
    onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md glass-panel rounded-2xl shadow-2xl p-6 m-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Key className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">API Configuration</h2>
              <p className="text-sm text-muted-foreground">Configure your MiniMax API key</p>
            </div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Region Selection */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            <Globe className="w-4 h-4 inline mr-2" />
            Region
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setSelectedRegion('international')}
              className={`
                px-4 py-3 rounded-lg font-medium transition-all
                ${selectedRegion === 'international'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              International
            </button>
            <button
              onClick={() => setSelectedRegion('china')}
              className={`
                px-4 py-3 rounded-lg font-medium transition-all
                ${selectedRegion === 'china'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }
              `}
            >
              China
            </button>
          </div>
        </div>

        {/* API Key Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            API Key
          </label>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => {
              setInputKey(e.target.value);
              setError('');
            }}
            placeholder="Enter your MiniMax API key"
            className="w-full px-4 py-3 bg-muted border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* Info */}
        <div className="mb-6 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
          <p className="text-sm text-blue-400">
            Get your API key from{' '}
            <a
              href="https://platform.minimax.io"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-blue-300"
            >
              platform.minimax.io
            </a>
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          {apiKey && (
            <button
              onClick={handleClear}
              className="flex-1 px-4 py-3 bg-red-500/10 text-red-500 rounded-lg font-medium hover:bg-red-500/20 transition-colors"
            >
              Clear Key
            </button>
          )}
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Save API Key
          </button>
        </div>
      </div>
    </div>
  );
}
