"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NotificationSchema = new mongoose_1.Schema({
    message: { type: String, required: true },
    recipient: { type: String, required: true },
    method: { type: String, required: true },
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});
const NotificationModel = (0, mongoose_1.model)('Notification', NotificationSchema);
exports.default = NotificationModel;
