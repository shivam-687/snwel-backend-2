import { Schema, model, Document } from 'mongoose';

// Define the interface for TypeScript
interface INotification extends Document {
  message: string;
  recipient: string;
  method: string;
  status: string;
  createdAt: Date;
}

// Define the Mongoose schema
const NotificationSchema = new Schema<INotification>({
  message: { type: String, required: true },
  recipient: { type: String, required: true },  // email, phone number, etc.
  method: { type: String, required: true },     // e.g., 'WhatsApp', 'Email', 'SMS'
  status: { type: String, default: 'pending' }, // pending, sent, failed
  createdAt: { type: Date, default: Date.now }
});

// Create the model
const NotificationModel = model<INotification>('Notification', NotificationSchema);

export default NotificationModel;
