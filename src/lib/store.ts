import { create } from 'zustand';
import { db, Generation, Template, Upload } from './db';
import { MinimaxClient } from './minimax-client';
import { processVideoGeneration, processMusicGeneration, processImageGeneration, processTextGeneration, processCodeGeneration } from './generation-handlers';

interface AppState {
  // API Configuration
  apiKey: string | null;
  region: 'international' | 'china';
  client: MinimaxClient | null;

  // UI State
  activeTab: 'video' | 'image' | 'text' | 'music' | 'code' | 'history' | 'media' | 'dashboard';
  sidebarOpen: boolean;
  settingsModalOpen: boolean;

  // Generation State
  generations: Generation[];
  currentGeneration: Generation | null;
  templates: Template[];
  processingQueue: boolean;

  // Actions
  processQueue: () => Promise<void>;
  setApiKey: (apiKey: string, region: 'international' | 'china') => Promise<void>;
  clearApiKey: () => Promise<void>;
  loadApiKey: () => Promise<void>;

  setActiveTab: (tab: AppState['activeTab']) => void;
  setSidebarOpen: (open: boolean) => void;
  setSettingsModalOpen: (open: boolean) => void;

  loadGenerations: () => Promise<void>;
  addGeneration: (generation: Omit<Generation, 'id'>) => Promise<number>;
  updateGeneration: (id: number, updates: Partial<Generation>) => Promise<void>;
  setCurrentGeneration: (generation: Generation | null) => void;
  deleteGeneration: (id: number) => Promise<void>;

  loadTemplates: () => Promise<void>;
  saveTemplate: (template: { name: string; content: string; type: string }) => Promise<void>;
  deleteTemplate: (id: number) => Promise<void>;

  // Uploads
  uploads: Upload[];
  loadUploads: () => Promise<void>;
  uploadFile: (file: File) => Promise<void>;
  deleteUpload: (id: number) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  apiKey: null,
  region: 'international',
  client: null,
  activeTab: 'video',
  sidebarOpen: true,
  settingsModalOpen: false,
  generations: [],
  currentGeneration: null,
  templates: [],
  processingQueue: false,

  // API Key actions
  setApiKey: async (apiKey: string, region: 'international' | 'china') => {
    await db.saveApiKey(apiKey, region);
    const client = new MinimaxClient(apiKey, region);
    set({ apiKey, region, client });
  },

  clearApiKey: async () => {
    await db.deleteApiKey();
    set({ apiKey: null, client: null });
  },

  loadApiKey: async () => {
    const config = await db.getApiKey();
    if (config) {
      const client = new MinimaxClient(config.apiKey, config.region);
      set({ apiKey: config.apiKey, region: config.region, client });
    }
  },

  // UI actions
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  setSettingsModalOpen: (open) => set({ settingsModalOpen: open }),

  // Generation actions
  loadGenerations: async () => {
    const generations = await db.getRecentGenerations();
    set({ generations });
  },

  addGeneration: async (generation) => {
    const id = await db.saveGeneration(generation);
    await get().loadGenerations();
    get().processQueue();
    return id;
  },

  processQueue: async () => {
    const { processingQueue, client, updateGeneration } = get();
    if (processingQueue || !client) return;

    set({ processingQueue: true });

    try {
      // Find next queued item
      // We use get() inside loop to get latest state
      let nextItem = get().generations.find(g => g.status === 'queued');

      while (nextItem) {
        // The client is already checked for null above, so we can use the destructured 'client'
        // If client could change mid-loop, we'd re-fetch, but for now, it's stable.

        if (nextItem.type === 'video') {
          await processVideoGeneration(client, nextItem, updateGeneration);
        } else if (nextItem.type === 'music') {
          await processMusicGeneration(client, nextItem, updateGeneration);
        } else if (nextItem.type === 'image') {
          await processImageGeneration(client, nextItem, updateGeneration);
        } else if (nextItem.type === 'text') {
          await processTextGeneration(client, nextItem, updateGeneration);
        } else if (nextItem.type === 'code') {
          await processCodeGeneration(client, nextItem, updateGeneration);
        } else {
          // Mark others as failed for now until handlers implemented
          await updateGeneration(nextItem.id, {
            status: 'failed',
            error: 'Queue processing not implemented for this type'
          });
        }

        // Refresh state is handled by updateGeneration -> loadGenerations
        // Get next item
        nextItem = get().generations.find(g => g.status === 'queued');
      }
    } finally {
      set({ processingQueue: false });
    }
  },

  updateGeneration: async (id, updates) => {
    await db.updateGeneration(id, updates);
    await get().loadGenerations();

    const current = get().currentGeneration;
    if (current && current.id === id) {
      const updated = await db.getGeneration(id);
      set({ currentGeneration: updated || null });
    }
  },

  setCurrentGeneration: (generation) => set({ currentGeneration: generation }),

  deleteGeneration: async (id) => {
    await db.deleteGeneration(id);
    await get().loadGenerations();

    const current = get().currentGeneration;
    if (current && current.id === id) {
      set({ currentGeneration: null });
    }
  },

  loadTemplates: async () => {
    const templates = await db.getTemplates();
    set({ templates });
  },

  saveTemplate: async (template) => {
    await db.saveTemplate(template);
    await get().loadTemplates();
  },

  deleteTemplate: async (id) => {
    await db.deleteTemplate(id);
    await get().loadTemplates();
  },

  // Upload actions
  uploads: [],
  loadUploads: async () => {
    const uploads = await db.getUploads();
    set({ uploads });
  },

  uploadFile: async (file) => {
    await db.saveUpload(file);
    await get().loadUploads();
  },

  deleteUpload: async (id) => {
    await db.deleteUpload(id);
    await get().loadUploads();
  },
}));
