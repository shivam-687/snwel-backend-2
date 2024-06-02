// FileController.ts
import { Request, Response } from 'express';
import { IFile, FileModel } from '../models/FileModal';
import mime from 'mime-types';
import { convertToPagination, getFilterQuery, getPaginationParams } from '@/utils/helpers';
import { successResponse } from '@/utils/helpers/appResponse';
import fs from 'fs';
import { handleUpload } from '@/middleware/upload';

export const uploadFile = async (req: Request, res: Response) => {
  try {
    let file: IFile | undefined;

    if (req.file) {
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
      const cldRes = await handleUpload(dataURI);
    
      console.log({ fileResponse: req.file, cldRes })
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

export const listFiles = async (req: Request, res: Response) => {
  try {
    const { limit = 10, page = 1, search = '' } = { ...req.query };
    const paginationData = getPaginationParams(limit, page)
    const query: any = getFilterQuery({ filter: { search: String(search) } })
    console.log({ query })
    const files = await FileModel.find().skip(paginationData.offset).limit(paginationData.limit);
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
