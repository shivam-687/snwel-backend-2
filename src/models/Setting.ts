import mongoose, {Document, Schema} from 'mongoose'

interface Setting extends Document {
    code: string;
    data: any;
    isChangable: boolean;
}


const SettingSchema = new Schema<Setting>({
    code: {type: String, unique: true},
    data: JSON,
    isChangable: {type: Boolean, default: true},
});


export const SettingModel = mongoose.model<Setting>('Setting', SettingSchema);