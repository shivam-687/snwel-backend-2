"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const common_1 = require("../config/common");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
mongoose_paginate_v2_1.default.paginate.options = common_1.paginateOptions;
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
masterSchema.plugin(mongoose_paginate_v2_1.default);
masterSchema.index({ code: 1 }, { unique: true });
masterSchema.index({ parentCode: 1 });
masterSchema.index({ type: 1 });
masterSchema.index({ sequence: -1 });
const Master = (0, mongoose_1.model)('Master', masterSchema);
exports.default = Master;
