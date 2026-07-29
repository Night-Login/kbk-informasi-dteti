import { Request, Response, NextFunction } from 'express';
import redisClient from '../utils/redis.js';

/**
 * Middleware to cache GET requests.
 * @param duration TTL in seconds
 */
export const cacheMiddleware = (duration: number) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        if (req.method !== 'GET') {
            return next();
        }

        const key = `__express__${req.originalUrl || req.url}`;

        try {
            if (!redisClient.isOpen) {
                return next();
            }

            const cachedBody = await redisClient.get(key);
            if (cachedBody) {
                res.setHeader('Content-Type', 'application/json');
                res.send(cachedBody);
                return;
            } else {
                const originalSend = res.send;
                res.send = function (body) {
                    if (res.statusCode >= 200 && res.statusCode < 300) {
                        redisClient.setEx(key, duration, typeof body === 'string' ? body : JSON.stringify(body)).catch(err => {
                            console.error('Redis setEx error:', err);
                        });
                    }
                    return originalSend.call(this, body);
                };
                return next();
            }
        } catch (error) {
            console.error('Cache middleware error:', error);
            return next();
        }
    };
};

/**
 * Middleware to clear cache based on a specific prefix pattern.
 * e.g. for /api/v1/lecturers it will clear keys matching `__express__/api/v1/lecturers*`
 */
export const clearCache = (prefixPath: string) => {
    return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const originalSend = res.send;
        res.send = function (body) {
            if (res.statusCode >= 200 && res.statusCode < 300) {
                if (redisClient.isOpen) {
                    const pattern = `__express__${prefixPath}*`;
                    redisClient.keys(pattern).then(keys => {
                        if (keys.length > 0) {
                            redisClient.del(keys).catch(err => console.error('Redis del error:', err));
                        }
                    }).catch(err => console.error('Redis keys error:', err));
                }
            }
            return originalSend.call(this, body);
        };
        return next();
    };
};
