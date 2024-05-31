import express from 'express';
import { indexRoute } from './routes/indexRoutes';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import securityMiddleware from './middleware/security.middleware';
import GlobalState from './utils/globalState';
import passport from './config/passport-config';
import connectDB from './db/dbClient';
import cors from 'cors';
import path from 'path';
import helmet from 'helmet';


const app = express();
app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
    })
  );
app.use(cors())
connectDB();
app.use(passport.initialize());
app.use(express.json());
app.use(securityMiddleware);
app.use(loggerMiddleware);
app.use( express.static('public'));
app.use('/', indexRoute)



export { app };
