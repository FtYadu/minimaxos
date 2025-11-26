'use client';

import { useAppStore } from '@/lib/store';
import { Key, Globe, Sparkles, Settings } from 'lucide-react';
import { useState } from 'react';
import ApiKeyModal from './ApiKeyModal';
import SettingsModal from './SettingsModal';

export default function Header() {
  const { apiKey, region, setSettingsModalOpen } = useAppStore();
  const [showApiModal, setShowApiModal] = useState(false);

  return (
    <>
      <header className="h-16 glass-panel border-b border-border flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold gradient-text">AI Studio</h1>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Region Indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50">
            <Globe className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground capitalize">
              {region}
            </span>
          </div>

          {/* API Key Status */}
          <button
            onClick={() => setShowApiModal(true)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg font-medium
              transition-all duration-200
              ${apiKey
                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
              }
            `}
          >
            <Key className="w-4 h-4" />
            <span className="text-sm">
              {apiKey ? 'API Connected' : 'No API Key'}
            </span>
          </button>

          {/* Settings Button */}
          <button
            onClick={() => setSettingsModalOpen(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      {showApiModal && <ApiKeyModal onClose={() => setShowApiModal(false)} />}
      <SettingsModal />
    </>
  );
}
