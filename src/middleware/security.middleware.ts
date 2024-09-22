import rateLimit from 'express-rate-limit';
import { RequestHandler } from 'express';
import helmet from 'helmet';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 100 requests per windowMs
});

const securityMiddleware: RequestHandler[] = [helmet(), limiter];
export default securityMiddleware;
