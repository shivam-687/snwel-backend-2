import mongoose, {Document, Schema, Types} from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export interface Webinar extends Document {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    startDate: string;
    slug: string;
    thumbnail?: string;
    coverImage?: string;
    createdBy: Types.ObjectId,
    hosts: Types.ObjectId[],
    isActive: Boolean,
    price: number,
    currency: string,
    curriculum: { title: string; duration: string }[];
}


const WebinarSchema = new Schema<Webinar>({
    id: String,
    title: String,
    shortDescription: String,
    content: String,
    startDate: String,
    slug: String,
    thumbnail: String,
    coverImage: {type: String},
    isActive: {type: Boolean, default: true},
    hosts: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    createdBy: {type: Schema.Types.ObjectId, ref: 'User'},
    price: {type: Number, default: 0},
    currency: {type: String, default: 'INR'},
    curriculum: [{ title: String, duration: String }],
}, {timestamps: true});

WebinarSchema.plugin(softDeletePlugin);


export const WebinarModel = mongoose.model<Webinar>('Webinar', WebinarSchema);