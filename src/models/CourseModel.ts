import mongoose, { Document, Schema, Types } from 'mongoose';
import slugify from 'slugify';


export enum COURSE_STATUS {
    SAVED = 'SAVED',
    PUBLISHED = 'PUBLISHED'
}

export interface Course extends Document {
    id: string;
    image?: string;
    title: string;
    slug: string,
    shortDescription: string;
    text: string;
    courseDuration: string;
    categories: Types.ObjectId[];
    instructors: Types.ObjectId[];
    difficulty: string;
    language: string[];
    assessment: string;
    certificate: boolean;
    content: any;
    lessons: number;
    rating: number;
    enrolled: number;
    isPopular: boolean;
    price: number;
    currency: string;
    discount?: number;
    isPremium?: boolean;
    masterCategory: string;
    appearence?: {
        themeColor?: string;
        forgroundColor?: string;
    };
    images?: {
        promotionalCardImage?: string;
        iconImage?: string;
    };
    curriculum: { title: string; duration: string, unit: string, classCount: string, curriculumType: Types.ObjectId }[];
    status: COURSE_STATUS;
    qualifications: Types.ObjectId[],
    trainingModes: Types.ObjectId[],
    widget: string
}



const CourseSchema = new Schema<Course>({
    id: String,
    image: String,
    title: String,
    slug: { type: String, unique: true },
    shortDescription: String,
    text: String,
    courseDuration: String,
    categories: [{ type: Types.ObjectId, ref: 'CourseCategory' }],
    instructors: [{ type: Types.ObjectId, ref: 'User' }],
    content: { type: Schema.Types.Mixed },
    difficulty: String,
    language: [String],
    assessment: String,
    certificate: Boolean,
    lessons: Number,
    rating: { type: Number, default: 0 },
    enrolled: { type: Number, default: 0 },
    isPopular: { type: Boolean, default: false },
    price: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
    discount: Number,
    isPremium: { type: Boolean, default: false },
    masterCategory: String,
    appearence: {
        themeColor: String,
        forgroundColor: String,
    },
    images: {
        promotionalCardImage: String,
        iconImage: String,
    },
    curriculum: [{
        title: String,
        duration: String,
        unit: String,
        classCount: String,
        curriculumType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Master'
        }
    }],
    status: { type: String, default: COURSE_STATUS.SAVED },
    qualifications: [{type: mongoose.Schema.Types.ObjectId, ref: 'Master', default: []}],
    trainingModes: [{type: mongoose.Schema.Types.ObjectId, ref: 'Master', default: []}],
    widget: {type: mongoose.Schema.Types.String}

}, { timestamps: true });


CourseSchema.pre<Course>('save', async function (next) {
    try {
        const slug = slugify(this.title, { lower: true });
        const existingCourse = await CourseModel.findOne({ slug });

        if (existingCourse) {
            let counter = 1;
            while (true) {
                const newSlug = `${slug}-${counter}`;
                const categoryWithSlug = await CourseModel.findOne({ slug: newSlug });
                if (!categoryWithSlug) {
                    this.slug = newSlug;
                    break;
                }
                counter++;
            }
        } else {
            this.slug = slug;
        }
        next();
    } catch (error: any) {
        next(error)
    }
});


export const CourseModel = mongoose.model<Course>('Course', CourseSchema);