"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpsertDigitalAssets = exports.getAllDigitalAssets = exports.deleteDigitalAssetById = exports.updateDigitalAssetById = exports.getDigitalAssetById = exports.createDigitalAsset = void 0;
const GalleryAssets_1 = __importDefault(require("../models/GalleryAssets"));
const helpers_1 = require("../utils/helpers");
const mongoose_1 = require("mongoose");
async function createDigitalAsset(data) {
    try {
        const digitalAsset = await GalleryAssets_1.default.create(data);
        return digitalAsset.toObject();
    }
    catch (error) {
        throw new Error(`Failed to create digital asset: ${error.message}`);
    }
}
exports.createDigitalAsset = createDigitalAsset;
async function getDigitalAssetById(digitalAssetId) {
    try {
        const query = mongoose_1.Types.ObjectId.isValid(digitalAssetId)
            ? { _id: digitalAssetId }
            : { link: digitalAssetId };
        const digitalAsset = await GalleryAssets_1.default.findOne(query);
        return digitalAsset ? digitalAsset.toObject() : null;
    }
    catch (error) {
        throw new Error(`Failed to get digital asset: ${error.message}`);
    }
}
exports.getDigitalAssetById = getDigitalAssetById;
async function updateDigitalAssetById(digitalAssetId, updateData) {
    try {
        const digitalAsset = await GalleryAssets_1.default.findByIdAndUpdate(digitalAssetId, updateData, { new: true });
        return digitalAsset ? digitalAsset.toObject() : null;
    }
    catch (error) {
        throw new Error(`Failed to update digital asset: ${error.message}`);
    }
}
exports.updateDigitalAssetById = updateDigitalAssetById;
async function deleteDigitalAssetById(digitalAssetId) {
    try {
        await GalleryAssets_1.default.findByIdAndDelete(digitalAssetId);
    }
    catch (error) {
        throw new Error(`Failed to delete digital asset: ${error.message}`);
    }
}
exports.deleteDigitalAssetById = deleteDigitalAssetById;
const getAllDigitalAssets = async (options) => {
    try {
        const { limit = 10, page = 1, search, sort, filter } = options;
        const query = {};
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            query.$or = [{ name: searchRegex }, { description: searchRegex }, { link: searchRegex }];
        }
        if (filter && filter.linkType) {
            query.linkType = filter.linkType;
        }
        console.log({ query });
        const digitalAssets = await GalleryAssets_1.default.paginate(query, {
            page,
            limit,
            sort: sort ? (0, helpers_1.convertSortOrder)(sort) : { sequence: 1 }
        });
        return digitalAssets;
    }
    catch (error) {
        throw new Error(`Error retrieving digital assets: ${error.message}`);
    }
};
exports.getAllDigitalAssets = getAllDigitalAssets;
const bulkUpsertDigitalAssets = async (assets) => {
    try {
        const bulkOps = assets.map(asset => ({
            updateOne: {
                filter: { link: asset.link },
                update: { $set: asset },
                upsert: true,
            },
        }));
        await GalleryAssets_1.default.bulkWrite(bulkOps);
    }
    catch (error) {
        throw new Error(`Failed to bulk upsert digital assets: ${error.message}`);
    }
};
exports.bulkUpsertDigitalAssets = bulkUpsertDigitalAssets;
