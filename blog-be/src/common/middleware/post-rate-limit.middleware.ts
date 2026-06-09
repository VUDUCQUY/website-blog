import rateLimit from 'express-rate-limit';
import logger from '@/lib/logger';

export const postRateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // Limit each IP to 3 post creation requests per windowMs
  message: {
    message: 'Too many posts created from this IP, please try again after 10 minutes',
  },
  handler: (req, res, next, options) => {
    logger.warn(`Post creation rate limit exceeded for IP: ${req.ip}`);
    res.status(options.statusCode).send(options.message);
  },
  standardHeaders: true,
  legacyHeaders: false,
});
