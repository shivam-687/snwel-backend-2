import express from 'express';
import { indexRoute } from './routes/indexRoutes';
import { loggerMiddleware } from './middleware/loggerMiddleware';
import securityMiddleware from './middleware/security.middleware';
import passport from './config/passport-config';
import connectDB from './db/dbClient';
import cors from 'cors';
import helmet from 'helmet';
import { initializeUserManagement } from './modules/UserManagement';

const app = express();

// Initialize function
const initializeApp = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Initialize User Management module
    await initializeUserManagement();
    
    console.log('Application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize application:', error);
    process.exit(1);
  }
};

// Middleware setup
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
  })
);
app.use(cors());
app.use(passport.initialize());
app.use(express.json());
app.use(securityMiddleware);
app.use(loggerMiddleware);
app.use(express.static('public'));
app.use('/', indexRoute);

// Initialize the application
initializeApp();

export { app };
