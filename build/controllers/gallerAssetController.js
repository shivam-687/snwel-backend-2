"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bulkUpsertDigitalAssetsController = exports.getAllDigitalAssetsController = exports.deleteDigitalAssetByIdController = exports.updateDigitalAssetByIdController = exports.getDigitalAssetByIdController = exports.createDigitalAssetController = void 0;
const allery_asset_service_1 = require("../service/allery-asset-service");
const appResponse_1 = require("../utils/helpers/appResponse");
const catchAsync_1 = require("../utils/helpers/catchAsync");
// Controller function to create a new digital asset
async function createDigitalAssetController(req, res) {
    try {
        const digitalAssetData = req.body; // Assuming digital asset data is sent in the request body
        const newDigitalAsset = await (0, allery_asset_service_1.createDigitalAsset)(digitalAssetData);
        (0, appResponse_1.successResponse)(newDigitalAsset, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.createDigitalAssetController = createDigitalAssetController;
// Controller function to get a digital asset by ID
async function getDigitalAssetByIdController(req, res) {
    try {
        const digitalAssetId = req.params.id;
        const digitalAsset = await (0, allery_asset_service_1.getDigitalAssetById)(digitalAssetId);
        if (!digitalAsset) {
            res.status(404).json({ message: 'Digital Asset not found' });
            return;
        }
        (0, appResponse_1.successResponse)(digitalAsset, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.getDigitalAssetByIdController = getDigitalAssetByIdController;
// Controller function to update a digital asset by ID
async function updateDigitalAssetByIdController(req, res) {
    try {
        const digitalAssetId = req.params.id;
        const updateData = req.body;
        const updatedDigitalAsset = await (0, allery_asset_service_1.updateDigitalAssetById)(digitalAssetId, updateData);
        if (!updatedDigitalAsset) {
            res.status(404).json({ message: 'Digital Asset not found' });
            return;
        }
        (0, appResponse_1.successResponse)(updatedDigitalAsset, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.updateDigitalAssetByIdController = updateDigitalAssetByIdController;
// Controller function to delete a digital asset by ID
async function deleteDigitalAssetByIdController(req, res) {
    try {
        const digitalAssetId = req.params.id;
        await (0, allery_asset_service_1.deleteDigitalAssetById)(digitalAssetId);
        (0, appResponse_1.successResponse)({ message: 'Digital Asset deleted successfully' }, res);
    }
    catch (error) {
        (0, appResponse_1.errorResponseFromError)(error, res);
    }
}
exports.deleteDigitalAssetByIdController = deleteDigitalAssetByIdController;
// Controller function to get all digital assets with pagination
exports.getAllDigitalAssetsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const options = req.query;
    const digitalAssets = await (0, allery_asset_service_1.getAllDigitalAssets)(options);
    return (0, appResponse_1.successResponse)(digitalAssets, res, { message: "Digital Assets fetched successfully!" });
});
exports.bulkUpsertDigitalAssetsController = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const assets = req.body; // Assuming the array of assets is sent in the request body
    await (0, allery_asset_service_1.bulkUpsertDigitalAssets)(assets);
    (0, appResponse_1.successResponse)({ message: 'Digital assets upserted successfully!' }, res);
});
