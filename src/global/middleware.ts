import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import { Request, Response, NextFunction } from 'express';
import { Injectable, NestMiddleware, Type, mixin } from '@nestjs/common';

// const limiter = rateLimit({
// windowMS: 60000, // 1-min time window for request limiting
// limit: 60, // allow a maximum of 60 req per window per IP
// standardHeaders: "draft-8", // use the latest standard rate-limit headers
// legacyHeaders: false, // disable deprecated X-RateLimit headerss
// message: {
// error : "You have send to many requests."

// })
export function RateLimitCreator(
  windowMs: number,
  limit: number,
): Type<NestMiddleware> {
  @Injectable()
  class RateLimitingMiddleware implements NestMiddleware {
    private limiter: RateLimitRequestHandler;

    constructor() {
      this.limiter = rateLimit({
        windowMs,
        limit,
        keyGenerator: (req: Request) => {
          return req.ip || '';
        },
      });
    }

    use(req: Request, res: Response, next: NextFunction) {
      this.limiter(req, res, next);
    }
  }
  return mixin(RateLimitingMiddleware);
}
