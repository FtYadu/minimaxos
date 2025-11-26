import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

const GENERATIONS_KEY = 'minimax:generations';

export async function GET() {
    try {
        // Fetch all generations
        // Since Redis is a key-value store, we might store generations as a list or hash.
        // For simplicity, let's assume we store them as a JSON string in a list or individual keys.
        // A better approach for "get all" is storing IDs in a Set and fetching individual items, 
        // or using a Hash where field=id, value=JSON.

        // Using Hash: 'minimax:generations' -> { id: JSON, id2: JSON }
        const data = await redis.hgetall(GENERATIONS_KEY);
        const generations = Object.values(data).map(item => JSON.parse(item as string));

        // Sort by createdAt desc
        generations.sort((a: any, b: any) => b.createdAt - a.createdAt);

        return NextResponse.json(generations);
    } catch (error) {
        console.error('Redis error:', error as any);
        return NextResponse.json({ error: 'Failed to fetch generations' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const generation = await request.json();

        // Assign ID if not present (though store usually handles this, we'll ensure it)
        if (!generation.id) {
            generation.id = Date.now();
        }

        // Save to Redis Hash
        await redis.hset(GENERATIONS_KEY, String(generation.id), JSON.stringify(generation));

        return NextResponse.json({ id: generation.id });
    } catch (error) {
        console.error('Redis error:', error as any);
        return NextResponse.json({ error: 'Failed to save generation' }, { status: 500 });
    }
}
