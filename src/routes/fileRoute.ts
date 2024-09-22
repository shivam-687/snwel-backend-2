// routes.ts
import express from 'express';
import upload from '../middleware/upload';
import uploadv2 from '../middleware/uploadV2';
import { uploadFile, listFiles, uploadFileV2Controller } from '../controllers/fileController';
import passport from 'passport';

const router = express.Router();

// Route for uploading files
router.post(
    '/upload-multi', 
    passport.authenticate('jwt', { session: false }), 
    uploadv2, // Use the Multer middleware
    uploadFileV2Controller // Controller to handle file uploads
  );
router.post('/upload', passport.authenticate('jwt', {session: false}), upload.single('file'), uploadFile);

// Route for listing files
router.get('/files',passport.authenticate('jwt', {session: false}), listFiles);

export {router as FileRouter};
