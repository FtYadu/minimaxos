import Redis from 'ioredis';

const REDIS_HOST = process.env.REDIS_HOST || 'redis-16220.c239.us-east-1-2.ec2.cloud.redislabs.com';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '16220');
const REDIS_PASSWORD = process.env.REDIS_PASSWORD || ''; // User needs to provide this

// Create a Redis client instance
// We use a singleton pattern to avoid creating multiple connections in serverless environments
let redis: Redis | null = null;

if (!redis) {
    redis = new Redis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        password: REDIS_PASSWORD,
        // Retry strategy
        retryStrategy: (times: number) => {
            const delay = Math.min(times * 50, 2000);
            return delay;
        },
    });

    redis.on('connect', () => {
        console.log('Redis connected successfully to', REDIS_HOST);
    });

    redis.on('error', (err: any) => {
        console.error('Redis connection error:', err);
    });
}

export default redis!;
