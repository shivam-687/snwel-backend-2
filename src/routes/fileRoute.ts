// routes.ts
import express from 'express';
import upload from '../middleware/upload';
import uploadv2 from '../middleware/uploadV2';
import { uploadFile, listFiles, uploadFileV2Controller } from '../controllers/fileController';
import passport from 'passport';
import { checkPermission } from '@/middleware/permissionMiddleware';

const router = express.Router();

// Route for uploading files
router.post(
    '/upload-multi', 
    passport.authenticate('jwt', { session: false }), 
    checkPermission('FILE_UPLOAD'),
    uploadv2, // Use the Multer middleware
    uploadFileV2Controller // Controller to handle file uploads
  );
router.post('/upload', passport.authenticate('jwt', {session: false}), checkPermission('FILE_UPLOAD'), upload.single('file'), uploadFile);

// Route for listing files
router.get('/files',passport.authenticate('jwt', {session: false}), checkPermission('FILE_VIEW'), listFiles);

export {router as FileRouter};
