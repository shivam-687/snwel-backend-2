import mongoose, {Document, Schema, Types} from 'mongoose'


interface Job extends Document {
    title: string;
    description: string;
    createdBy: Types.ObjectId; // Reference to the user who created the job
    applicants: Types.ObjectId[]; // Assuming applicants are referenced by their IDs
}


const JobSchema = new Schema<Job>({
    title: String,
    description: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }, // Reference to User model
    applicants: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Reference to User model
});


export const JobModel = mongoose.model<Job>('Job', JobSchema);