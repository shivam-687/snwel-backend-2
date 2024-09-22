// FileController.ts
import { Request, Response } from 'express';
import { IFile, FileModel } from '../models/FileModal';
import mime from 'mime-types';
import { convertToPagination, getFilterQuery, getPaginationParams } from '@/utils/helpers';
import { successResponse } from '@/utils/helpers/appResponse';
import fs from 'fs';
import { handleUpload } from '@/middleware/upload';
import { handleUploadV2 } from '@/middleware/uploadV2';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    let file: IFile | undefined;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
    
      const mimeType = mime.lookup(cldRes.url) || 'application/octet-stream';
      file = new FileModel({ fileName: cldRes.public_id, filePath: cldRes.url, mimeType });
      await file.save();
    } else if (req.body.externalUrl) {
      const { externalUrl } = req.body;
      file = new FileModel({ fileName: externalUrl, filePath: externalUrl });
      await file.save();
    } else {
      throw new Error('No file uploaded or external URL provided.');
    }

    successResponse(file, res, { message: 'File uploaded successfully' })
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const uploadFileV2Controller = async (req: Request, res: Response) => {
  try {
    const files = req.files as Express.Multer.File[];
    const { externalUrl } = req.body;

    // Array to store file upload results
    let uploadedFiles: IFile[] = [];

    // Handle file uploads if they exist
    if (files && files.length > 0) {
      for (const file of files) {
        // Convert buffer to base64 and upload to Cloudinary
        const cldRes = await handleUploadV2(file.buffer, file.mimetype);
        if(!cldRes) return;
        const mimeType = cldRes ? mime.lookup(cldRes?.url) : 'application/octet-stream';
        const uploadedFile = new FileModel({
          fileName: cldRes.public_id,
          filePath: cldRes.url,
          mimeType
        });
        await uploadedFile.save();
        uploadedFiles.push(uploadedFile);
      }
    }

    // Handle external URL uploads
    if (externalUrl) {
      const file = new FileModel({ fileName: externalUrl, filePath: externalUrl });
      await file.save();
      uploadedFiles.push(file);
    }

    if (uploadedFiles.length === 0) {
      throw new Error('No file uploaded or external URL provided.');
    }

    return res.status(200).json({
      message: 'Files uploaded successfully',
      data: uploadedFiles,
    });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    res.status(500).json({ error: error.message });
  }
};

export const listFiles = async (req: Request, res: Response) => {
  try {
    const { limit = 10, page = 1, search = '' } = { ...req.query };
    const paginationData = getPaginationParams(limit, page)
    const query: any = getFilterQuery({ filter: { search: String(search) } })
    const files = await FileModel.find().sort({uploadDate: -1}).skip(paginationData.offset).limit(paginationData.limit);
    const count = await FileModel.countDocuments(query);
    return successResponse(convertToPagination(files, count, paginationData.limit, paginationData.offset), res)
    res.json(files);
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};

export const removeFileById = async (req: Request, res: Response) => {
  try {
    const fileId = req.params.id;
    const file = await FileModel.findByIdAndDelete(fileId);

    if (!file) {
      return res.status(404).send('File not found');
    }

    // Remove file from filesystem
    fs.unlinkSync(file.filePath);

    res.status(200).send('File deleted successfully');
  } catch (error: any) {
    res.status(500).send(error.message);
  }
};
