'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import VideoPanel from '@/components/panels/VideoPanel';
import ImagePanel from '@/components/panels/ImagePanel';
import TextPanel from '@/components/panels/TextPanel';
import MusicPanel from '@/components/panels/MusicPanel';
import CodePanel from '@/components/panels/CodePanel';
import HistoryPanel from '@/components/panels/HistoryPanel';
import MediaGalleryPanel from '@/components/panels/MediaGalleryPanel';
import DashboardPanel from '@/components/panels/DashboardPanel';
import ApiKeyModal from '@/components/ApiKeyModal';

export default function Home() {
  const { activeTab, apiKey, loadApiKey, loadGenerations } = useAppStore();

  useEffect(() => {
    loadApiKey();
    loadGenerations();
  }, [loadApiKey, loadGenerations]);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          {!apiKey && <ApiKeyModal />}

          {activeTab === 'video' && <VideoPanel />}
          {activeTab === 'image' && <ImagePanel />}
          {activeTab === 'text' && <TextPanel />}
          {activeTab === 'music' && <MusicPanel />}
          {activeTab === 'code' && <CodePanel />}
          {activeTab === 'history' && <HistoryPanel />}
          {activeTab === 'media' && <MediaGalleryPanel />}
          {activeTab === 'dashboard' && <DashboardPanel />}
        </main>
      </div>
    </div>
  );
}
