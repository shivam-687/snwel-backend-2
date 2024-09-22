import multer from 'multer';
import cloudinary from 'cloudinary';
import { Request, Express } from 'express';
import { Readable } from 'stream';

// Multer configuration with memory storage
const storage = multer.memoryStorage();

// File filter for allowed file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  if (
    file.mimetype.startsWith('image/') || 
    file.mimetype.startsWith('video/') || 
    file.mimetype === 'application/pdf' || 
    file.mimetype === 'application/msword' || 
    file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ) {
    cb(null, true); // Accept the file
  } else {
    cb(new Error('Only images, videos, PDFs, and DOC/DOCX files are allowed')); // Reject the file
  }
};

// Multer middleware instance for multiple files
const uploadV2 = multer({
  storage,
  fileFilter,
}).array('files', 10); // Accept up to 10 files at once

export default uploadV2;

// Cloudinary configuration
cloudinary.v2.config();

// Helper function to handle Cloudinary upload
export const handleUploadV2 = async (fileBuffer: Buffer, mimetype: string):Promise<cloudinary.UploadApiResponse | undefined>  => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { resource_type: 'auto' }, // 'auto' detects the file type (image, video, etc.)
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    // Convert buffer to readable stream
    const readableStream = new Readable();
    readableStream.push(fileBuffer);
    readableStream.push(null); // End of stream
    readableStream.pipe(uploadStream);
  });
};
