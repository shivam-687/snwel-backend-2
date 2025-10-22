import mongoose, { Document, Schema } from 'mongoose';
import { IPermission } from './Permission';
import mongoosePaginate from 'mongoose-paginate-v2';
import { paginateOptions } from '@/config/common';

mongoosePaginate.paginate.options = paginateOptions;

export interface IRole extends Document {
  name: string;
  description: string;
  permissions: IPermission['_id'][];
  isActive: boolean;
  isSystem: boolean;
}

const RoleSchema = new Schema<IRole>({
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  permissions: [{ type: Schema.Types.ObjectId, ref: 'Permission' }],
  isActive: { type: Boolean, default: true },
  isSystem: { type: Boolean, default: false }
}, { timestamps: true });

// Indexes for optimized queries
RoleSchema.index({ name: 1 }, { unique: true }); // Unique role name lookup
RoleSchema.index({ isActive: 1 }); // Filter active roles
RoleSchema.index({ isSystem: 1 }); // Filter system roles

RoleSchema.plugin(mongoosePaginate);

export const RoleModel = mongoose.model<IRole, mongoose.PaginateModel<IRole>>('Role', RoleSchema); 