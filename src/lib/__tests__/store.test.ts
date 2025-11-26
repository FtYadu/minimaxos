import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useAppStore } from '../store';
import { db } from '../db';

// Mock the db module
vi.mock('../db', () => ({
    db: {
        saveApiKey: vi.fn(),
        deleteApiKey: vi.fn(),
        getApiKey: vi.fn(),
        saveGeneration: vi.fn(),
        getRecentGenerations: vi.fn(),
        updateGeneration: vi.fn(),
        deleteGeneration: vi.fn(),
        getGeneration: vi.fn(),
    },
}));

// Mock handlers
vi.mock('../generation-handlers', () => ({
    processVideoGeneration: vi.fn(),
}));

import { processVideoGeneration } from '../generation-handlers';

describe('AppStore', () => {
    beforeEach(() => {
        useAppStore.setState({
            apiKey: null,
            region: 'international',
            client: null,
            generations: [],
            currentGeneration: null,
        });
        vi.clearAllMocks();
    });

    it('should set API key', async () => {
        const { setApiKey } = useAppStore.getState();
        await setApiKey('test-key', 'china');

        const state = useAppStore.getState();
        expect(state.apiKey).toBe('test-key');
        expect(state.region).toBe('china');
        expect(state.client).toBeDefined();
        expect(db.saveApiKey).toHaveBeenCalledWith('test-key', 'china');
    });

    it('should clear API key', async () => {
        const { setApiKey, clearApiKey } = useAppStore.getState();
        await setApiKey('test-key', 'international');
        await clearApiKey();

        const state = useAppStore.getState();
        expect(state.apiKey).toBeNull();
        expect(state.client).toBeNull();
        expect(db.deleteApiKey).toHaveBeenCalled();
    });

    it('should add generation', async () => {
        const { addGeneration } = useAppStore.getState();
        (db.saveGeneration as any).mockResolvedValue(1);
        (db.getRecentGenerations as any).mockResolvedValue([{ id: 1, prompt: 'test' }]);

        const id = await addGeneration({
            type: 'video',
            status: 'pending',
            prompt: 'test',
            model: 'test-model',
            parameters: {},
            createdAt: 123,
        });

        expect(id).toBe(1);
        expect(db.saveGeneration).toHaveBeenCalled();

        // Check if generations list was updated
        const state = useAppStore.getState();
        expect(state.generations).toHaveLength(1);
        expect(state.generations[0].id).toBe(1);
    });

    it('should process queue', async () => {
        const { addGeneration, setApiKey } = useAppStore.getState();
        await setApiKey('test-key', 'international');

        // Mock DB to return a queued item first, then completed
        (db.getRecentGenerations as any)
            .mockResolvedValueOnce([
                { id: 1, type: 'video', status: 'queued', parameters: {} }
            ])
            .mockResolvedValue([
                { id: 1, type: 'video', status: 'completed', parameters: {} }
            ]);

        // Mock handler to simulate processing
        // Mock handler to simulate processing
        (processVideoGeneration as any).mockImplementation(async (client: any, gen: any, updateGen: any) => {
            await updateGen(gen.id, { status: 'completed' });
        });

        // Add generation triggers processQueue
        await addGeneration({
            type: 'video',
            status: 'queued',
            prompt: 'test',
            model: 'test-model',
            parameters: {},
            createdAt: 123,
        });

        // Wait for queue to process (it's async)
        // We can check if handler was called
        expect(processVideoGeneration).toHaveBeenCalled();
    });
});
