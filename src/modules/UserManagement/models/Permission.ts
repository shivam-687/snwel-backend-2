import mongoose, { Document, Schema } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import { paginateOptions } from '@/config/common';

mongoosePaginate.paginate.options = paginateOptions;

export interface IPermission extends Document {
  name: string;
  description: string;
  code: string;
  module: string;
}

const PermissionSchema = new Schema<IPermission>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  module: { type: String, required: true }
}, { timestamps: true });

PermissionSchema.plugin(mongoosePaginate);

export const PermissionModel = mongoose.model<IPermission, mongoose.PaginateModel<IPermission>>('Permission', PermissionSchema); 