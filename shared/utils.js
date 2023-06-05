import { rateLimit } from 'express-rate-limit';

let limiter = null;

function rateLimiter() {
  limiter =
    limiter ||
    rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: process.env.TS_RATE_LIMIT || 10, // 10 requests per minute per IP
      message: 'Too many requests from this IP, please try again in a minute',
    });
  return limiter;
}

export const utils = {
  rateLimiter,
};
