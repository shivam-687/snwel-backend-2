"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeFileById = exports.listFiles = exports.uploadFile = void 0;
const FileModal_1 = require("../models/FileModal");
const mime_types_1 = __importDefault(require("mime-types"));
const helpers_1 = require("../utils/helpers");
const appResponse_1 = require("../utils/helpers/appResponse");
const fs_1 = __importDefault(require("fs"));
const uploadFile = async (req, res) => {
    try {
        let file;
        if (req.file) {
            const { filename, path } = req.file;
            console.log({ fileResponse: req.file });
            const mimeType = mime_types_1.default.lookup(filename) || 'application/octet-stream';
            file = new FileModal_1.FileModel({ fileName: filename, filePath: path, mimeType });
            await file.save();
        }
        else if (req.body.externalUrl) {
            const { externalUrl } = req.body;
            file = new FileModal_1.FileModel({ fileName: externalUrl, filePath: externalUrl });
            await file.save();
        }
        else {
            throw new Error('No file uploaded or external URL provided.');
        }
        (0, appResponse_1.successResponse)(file, res, { message: 'File uploaded successfully' });
    }
    catch (error) {
        res.status(500).send(error.message);
    }
};
exports.uploadFile = uploadFile;
const listFiles = async (req, res) => {
    try {
        const { limit = 10, page = 1, search = '' } = { ...req.query };
        const paginationData = (0, helpers_1.getPaginationParams)(limit, page);
        const query = (0, helpers_1.getFilterQuery)({ filter: { search: String(search) } });
        console.log({ query });
        const files = await FileModal_1.FileModel.find().skip(paginationData.offset).limit(paginationData.limit);
        const count = await FileModal_1.FileModel.countDocuments(query);
        return (0, appResponse_1.successResponse)((0, helpers_1.convertToPagination)(files, count, paginationData.limit, paginationData.offset), res);
        res.json(files);
    }
    catch (error) {
        res.status(500).send(error.message);
    }
};
exports.listFiles = listFiles;
const removeFileById = async (req, res) => {
    try {
        const fileId = req.params.id;
        const file = await FileModal_1.FileModel.findByIdAndDelete(fileId);
        if (!file) {
            return res.status(404).send('File not found');
        }
        // Remove file from filesystem
        fs_1.default.unlinkSync(file.filePath);
        res.status(200).send('File deleted successfully');
    }
    catch (error) {
        res.status(500).send(error.message);
    }
};
exports.removeFileById = removeFileById;
