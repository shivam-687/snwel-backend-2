"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const masterSchema = new mongoose_1.Schema({
    code: { type: String, required: true, unique: true },
    parentCode: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    name: { type: String, required: true },
    meta: { type: mongoose_1.Schema.Types.Mixed, required: false },
    sequence: { type: Number },
    type: { type: String, default: 'MASTER' }
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
const Master = (0, mongoose_1.model)('Master', masterSchema);
exports.default = Master;
