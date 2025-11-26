import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MinimaxClient } from '../minimax-client';

// Mock global fetch
const globalFetch = vi.fn();
global.fetch = globalFetch;

describe('MinimaxClient', () => {
    let client: MinimaxClient;
    const apiKey = 'test-api-key';

    beforeEach(() => {
        client = new MinimaxClient(apiKey);
        globalFetch.mockReset();
    });

    it('should create a video task successfully', async () => {
        const mockResponse = { task_id: '12345' };
        globalFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await client.createVideoTask({
            model: 'test-model',
            prompt: 'test prompt',
        });

        expect(result).toEqual(mockResponse);
        expect(globalFetch).toHaveBeenCalledWith(
            'https://api.minimax.io/v1/video_generation',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Authorization': `Bearer ${apiKey}`,
                }),
            })
        );
    });

    it('should throw error on failed video task creation', async () => {
        globalFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({ message: 'API Error' }),
        });

        await expect(client.createVideoTask({
            model: 'test-model',
            prompt: 'test prompt',
        })).rejects.toThrow('API Error');
    });

    it('should poll video until complete', async () => {
        // Mock query responses: Processing -> Success
        globalFetch
            .mockResolvedValueOnce({ // First call: query status (Processing)
                ok: true,
                json: async () => ({ status: 'Processing' }),
            })
            .mockResolvedValueOnce({ // Second call: query status (Success)
                ok: true,
                json: async () => ({ status: 'Success', file_id: 'file-123' }),
            });

        // Mock setTimeout to resolve immediately
        vi.spyOn(global, 'setTimeout').mockImplementation((fn) => {
            fn();
            return 0 as any;
        });

        const onProgress = vi.fn();
        const result = await client.pollVideoUntilComplete('task-123', onProgress);

        expect(result.status).toBe('Success');
        expect(result.file_id).toBe('file-123');
        expect(onProgress).toHaveBeenCalledWith('Processing');
        expect(onProgress).toHaveBeenCalledWith('Success');
    });
});
