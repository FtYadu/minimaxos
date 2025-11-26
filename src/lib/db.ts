import { openDB, DBSchema, IDBPDatabase } from 'idb';

interface MinimaxDB extends DBSchema {
  settings: {
    key: string;
    value: {
      id: string;
      apiKey: string;
      region: 'international' | 'china';
      createdAt: number;
    };
  };
  generations: {
    key: number;
    value: {
      id: number;
      type: 'video' | 'image' | 'text' | 'music' | 'code';
      status: 'queued' | 'pending' | 'processing' | 'completed' | 'failed';
      taskId?: string;
      fileId?: string;
      downloadUrl?: string;
      prompt: string;
      model: string;
      parameters: Record<string, any>;
      result?: any;
      error?: string;
      createdAt: number;
      completedAt?: number;
    };
    indexes: { 'by-type': string; 'by-date': number };
  };
  templates: {
    key: number;
    value: {
      id: number;
      name: string;
      content: string;
      type: string;
      createdAt: number;
    };
  };
  uploads: {
    key: number;
    value: {
      id: number;
      file: File;
      name: string;
      type: string;
      createdAt: number;
    };
  };
}

class MinimaxDatabase {
  private db: IDBPDatabase<MinimaxDB> | null = null;
  private dbName = 'minimax-studio-db';
  private version = 4;

  async init() {
    if (this.db) return this.db;

    this.db = await openDB<MinimaxDB>(this.dbName, this.version, {
      upgrade(db) {
        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'id' });
        }

        // Generations store
        if (!db.objectStoreNames.contains('generations')) {
          const genStore = db.createObjectStore('generations', {
            keyPath: 'id',
            autoIncrement: true,
          });
          genStore.createIndex('by-type', 'type');
          genStore.createIndex('by-date', 'createdAt');
        }

        // Templates store
        if (!db.objectStoreNames.contains('templates')) {
          db.createObjectStore('templates', { keyPath: 'id', autoIncrement: true });
        }

        // Uploads store
        if (!db.objectStoreNames.contains('uploads')) {
          db.createObjectStore('uploads', { keyPath: 'id', autoIncrement: true });
        }
      },
    });

    return this.db;
  }

  // Uploads
  async saveUpload(file: File) {
    const db = await this.init();
    return await db.add('uploads', {
      file,
      name: file.name,
      type: file.type,
      createdAt: Date.now(),
    } as any);
  }

  async getUploads() {
    const db = await this.init();
    return await db.getAll('uploads');
  }

  async deleteUpload(id: number) {
    const db = await this.init();
    await db.delete('uploads', id);
  }

  // API Key management
  async saveApiKey(apiKey: string, region: 'international' | 'china' = 'international') {
    const db = await this.init();
    await db.put('settings', {
      id: 'api-config',
      apiKey,
      region,
      createdAt: Date.now(),
    });
  }

  async getApiKey() {
    const db = await this.init();
    const config = await db.get('settings', 'api-config');
    return config;
  }

  async deleteApiKey() {
    const db = await this.init();
    await db.delete('settings', 'api-config');
  }

  // Generation history - API Implementation
  async saveGeneration(generation: Omit<MinimaxDB['generations']['value'], 'id'>) {
    // Optimistic update or wait for server? Let's wait for server ID
    const response = await fetch('/api/generations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(generation),
    });
    if (!response.ok) throw new Error('Failed to save generation');
    const data = await response.json();
    return data.id;
  }

  async updateGeneration(
    id: number,
    updates: Partial<MinimaxDB['generations']['value']>
  ) {
    await fetch(`/api/generations/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  }

  async getGeneration(id: number) {
    // We might not need this if we load all, but for completeness:
    // We don't have a specific GET /id route yet, but we can add it or just use getAll
    // For now, let's rely on getAllGenerations caching or add the route if needed.
    // Actually, let's implement getAllGenerations properly.
    return null; // Placeholder
  }

  async getAllGenerations(type?: string) {
    const response = await fetch('/api/generations');
    if (!response.ok) return [];
    const generations = await response.json();
    if (type) {
      return generations.filter((g: any) => g.type === type);
    }
    return generations;
  }

  async getRecentGenerations(limit = 50) {
    const response = await fetch('/api/generations');
    if (!response.ok) return [];
    const generations = await response.json();
    return generations.slice(0, limit);
  }

  async deleteGeneration(id: number) {
    await fetch(`/api/generations/${id}`, {
      method: 'DELETE',
    });
  }

  async clearAllGenerations() {
    const db = await this.init();
    await db.clear('generations');
  }

  // Templates
  async saveTemplate(template: { name: string; content: string; type: string }) {
    const db = await this.init();
    return await db.add('templates', { ...template, createdAt: Date.now() } as any);
  }

  async getTemplates() {
    const db = await this.init();
    return await db.getAll('templates');
  }

  async deleteTemplate(id: number) {
    const db = await this.init();
    await db.delete('templates', id);
  }

  async exportDatabase() {
    const db = await this.init();
    const settings = await db.getAll('settings');
    const generations = await db.getAll('generations');

    return JSON.stringify({
      version: this.version,
      timestamp: Date.now(),
      data: {
        settings,
        generations,
      }
    }, null, 2);
  }

  async importDatabase(jsonString: string) {
    try {
      const data = JSON.parse(jsonString);
      if (!data.data || !data.data.settings || !data.data.generations) {
        throw new Error('Invalid backup file format');
      }

      const db = await this.init();
      const tx = db.transaction(['settings', 'generations'], 'readwrite');

      // Clear existing data
      await tx.objectStore('settings').clear();
      await tx.objectStore('generations').clear();

      // Import settings
      for (const item of data.data.settings) {
        await tx.objectStore('settings').put(item);
      }

      // Import generations
      for (const item of data.data.generations) {
        // Sanitize status: if queued/processing, reset to failed or pending?
        // If we import a 'queued' item but lost the File object, it will fail.
        // Let's mark incomplete items as 'failed' with a note.
        if (['queued', 'processing'].includes(item.status)) {
          item.status = 'failed';
          item.error = 'Imported from backup (interrupted)';
        }
        await tx.objectStore('generations').put(item);
      }

      await tx.done;
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      throw error;
    }
  }
}

export const db = new MinimaxDatabase();
export type Generation = MinimaxDB['generations']['value'];
export type Template = MinimaxDB['templates']['value'];
export type Upload = MinimaxDB['uploads']['value'];
