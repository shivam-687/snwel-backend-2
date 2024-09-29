"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the Mongoose schema
const NotificationSchema = new mongoose_1.Schema({
    message: { type: String, required: true },
    recipient: { type: String, required: true }, // email, phone number, etc.
    method: { type: String, required: true }, // e.g., 'WhatsApp', 'Email', 'SMS'
    status: { type: String, default: 'pending' }, // pending, sent, failed
    createdAt: { type: Date, default: Date.now }
});
// Create the model
const NotificationModel = (0, mongoose_1.model)('Notification', NotificationSchema);
exports.default = NotificationModel;
