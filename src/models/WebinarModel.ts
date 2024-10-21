import mongoose, {Document, Schema, Types} from 'mongoose';
import { paginateOptions } from '@/config/common';
import mongoosePaginate from 'mongoose-paginate-v2';

mongoosePaginate.paginate.options = paginateOptions;

export interface Webinar extends Document {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    startDate: any;
    slug: string;
    thumbnail?: string;
    coverImage?: string;
    createdBy: Types.ObjectId,
    hosts: Types.ObjectId[],
    isActive: Boolean,
    price: number,
    currency: string,
    curriculum: { title: string; duration: string }[];
    videoUrl?: string
}


const WebinarSchema = new Schema<Webinar>({
    id: String,
    title: String,
    shortDescription: String,
    content: String,
    startDate: {type: Schema.Types.Date, default: new Date()},
    slug: String,
    thumbnail: String,
    coverImage: {type: String},
    isActive: {type: Boolean, default: true},
    hosts: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
    price: {type: Number, default: 0},
    currency: {type: String, default: 'INR'},
    curriculum: [{ title: String, duration: String }],
    videoUrl: {type: String, default: null}
}, {timestamps: true});



export const WebinarModel = mongoose.model<Webinar, mongoose.PaginateModel<Webinar>>('Webinar', WebinarSchema);