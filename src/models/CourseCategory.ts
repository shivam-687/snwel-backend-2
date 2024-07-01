import { ObjectId } from 'mongodb';
import mongoose, {Document, Schema} from 'mongoose'
import slugify from 'slugify';


export interface CourseCategory extends Document {
    title: string;
    description?: string;
    shortDescription?: string;
    isPremium?: boolean;
    parentCategory?: ObjectId;
    slug: string;
    isActive: boolean
}

const CourseCategorySchema = new Schema<CourseCategory>({
    title: String,
    description: String,
    shortDescription: String,
    isPremium: Boolean,
    parentCategory: { type: Schema.Types.ObjectId, ref: 'CourseCategory' }, // Assuming CourseCategory has a self-referencing relationship
    slug: { type: String, unique: true },
    isActive: {type: Boolean, default: true}
});


CourseCategorySchema.pre<CourseCategory>('save', async function (next) {
    const category = this;

    // Generate slug from title using slugify
    try {
        const slug = slugify(category.title, { lower: true });
        const existingCategory = await CourseCategoryModel.findOne({slug});

        if (existingCategory) {
            let counter = 1;
            while (true) {
                const newSlug = `${slug}-${counter}`;
                const categoryWithSlug = await CourseCategoryModel.findOne({ slug: newSlug });
                if (!categoryWithSlug) {
                    category.slug = newSlug;
                    break;
                }
                counter++;
            }
        } else {
            category.slug = slug;
        }
        next();
    } catch (error: any) {
        next(error)
    }


});
export const CourseCategoryModel = mongoose.model<CourseCategory>('CourseCategory', CourseCategorySchema);
