"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GalleryRouter = void 0;
const express_1 = require("express");
const gallerAssetController_1 = require("../controllers/gallerAssetController");
const validateSchema_1 = require("../middleware/validateSchema");
const galleryAssetsSchema_1 = require("../entity-schema/galleryAssetsSchema");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
exports.GalleryRouter = router;
router.post('/', (0, validateSchema_1.validateSchema)(galleryAssetsSchema_1.createGalleryAssetSchema), gallerAssetController_1.createDigitalAssetController);
router.get('/', gallerAssetController_1.getAllDigitalAssetsController);
router.get('/:id', gallerAssetController_1.getDigitalAssetByIdController);
router.put('/:id', passport_1.default.authenticate('jwt', { session: false }), (0, validateSchema_1.validateSchema)(galleryAssetsSchema_1.updateGalleryAssetSchema), gallerAssetController_1.updateDigitalAssetByIdController);
router.delete('/:id', passport_1.default.authenticate('jwt', { session: false }), gallerAssetController_1.deleteDigitalAssetByIdController);
router.post('/bulk-upsert', passport_1.default.authenticate('jwt', { session: false }), (0, validateSchema_1.validateSchema)(galleryAssetsSchema_1.createGalleryAssetSchema.array()), gallerAssetController_1.bulkUpsertDigitalAssetsController);
