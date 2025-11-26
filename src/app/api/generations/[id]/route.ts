import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

const GENERATIONS_KEY = 'minimax:generations';

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const updates = await request.json();

        // Get existing
        const existingStr = await redis.hget(GENERATIONS_KEY, id);
        if (!existingStr) {
            return NextResponse.json({ error: 'Generation not found' }, { status: 404 });
        }

        const existing = JSON.parse(existingStr);
        const updated = { ...existing, ...updates };

        // Save updated
        await redis.hset(GENERATIONS_KEY, id, JSON.stringify(updated));

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Redis error:', error as any);
        return NextResponse.json({ error: 'Failed to update generation' }, { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        await redis.hdel(GENERATIONS_KEY, id);
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Redis error:', error as any);
        return NextResponse.json({ error: 'Failed to delete generation' }, { status: 500 });
    }
}
