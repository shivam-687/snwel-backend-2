// routes.ts
import express from 'express';
import { generateOtpController, verifyOtpController } from '@/controllers/otpController';

const router = express.Router();

// Route for uploading files
router.post(
    '/generate', 
    generateOtpController
  );
router.post('/verify', verifyOtpController);


export {router as OtpRouter};
