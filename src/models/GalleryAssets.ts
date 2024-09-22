import { paginateOptions } from '@/config/common';
import mongoose, { Document, Schema } from 'mongoose';

import mongoosePaginate from 'mongoose-paginate-v2';

mongoosePaginate.paginate.options = paginateOptions;

export interface IGalleryAsset extends Document {
  name: string;
  description?: string;
  link: string; // URL for the image or video
  likesCount: number;
  linkType: 'image'|'youtube'
  extension?: string; // e.g., 'jpg', 'png', 'mp4'
  sequence: number; // For sequencing the assets
}

const galleryAssetSchema: Schema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  link: { type: String, required: true },
  likesCount: { type: Number, default: 0 },
  extension: { type: String, required: false },
  sequence: { type: Number, required: true },
  linkType: {type: String}
}, {timestamps: true});
galleryAssetSchema.plugin(mongoosePaginate);
const GalleryAssetModel = mongoose.model<IGalleryAsset, mongoose.PaginateModel<IGalleryAsset>>('GalleryAsset', galleryAssetSchema);

export default GalleryAssetModel;
