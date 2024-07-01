import { Schema, model, Document } from 'mongoose';

export interface IMaster extends Document {
    code: string;
    parentCode?: string;
    isActive: boolean;
    name: string;
    meta?: Record<string, any>;
    sequence: number
}

const masterSchema = new Schema<IMaster>({
    code: { type: String, required: true, unique: true },
    parentCode: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    name: { type: String, required: true },
    meta: { type: Schema.Types.Mixed, required: false },
    sequence: { type: Number }
}, {
    timestamps: true,
});

masterSchema.pre('save', async function (next) {
    if (!this.sequence) {
      const maxSequence = await Master.findOne().sort('-sequence').exec();
      this.sequence = maxSequence ? maxSequence.sequence + 1 : 1;
    }
    next();
  });

const Master = model<IMaster>('Master', masterSchema);

export default Master;
