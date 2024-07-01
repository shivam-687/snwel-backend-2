// FileModel.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IFile extends Document {
  fileName: string;
  filePath: string;
  mimeType: string;
  externalUrl?: string;
  uploadDate: Date;
}

const FileSchema: Schema = new Schema({
  fileName: { type: String, required: true },
  filePath: { type: String, required: true },
  mimeType: { type: String, required: true },
  externalUrl: { type: String },
  uploadDate: { type: Date, default: Date.now }
}, {timestamps: true});

export const FileModel =  mongoose.model<IFile>('File', FileSchema);

