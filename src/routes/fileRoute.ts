// routes.ts
import express from 'express';
import upload from '../middleware/upload';
import { uploadFile, listFiles } from '../controllers/fileController';
import passport from 'passport';

const router = express.Router();

// Route for uploading files
router.post('/upload', passport.authenticate('jwt', {session: false}), upload.single('file'), uploadFile);

// Route for listing files
router.get('/files',passport.authenticate('jwt', {session: false}), listFiles);

export {router as FileRouter};
