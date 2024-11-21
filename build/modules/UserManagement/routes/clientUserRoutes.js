"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClientUserRouter = void 0;
const express_1 = require("express");
const clientUserController_1 = require("../controllers/clientUserController");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
exports.ClientUserRouter = router;
router.use(passport_1.default.authenticate('jwt', { session: false }));
router.get('/profile', clientUserController_1.ClientUserController.getProfile);
router.put('/profile', clientUserController_1.ClientUserController.updateProfile);
router.post('/change-password', clientUserController_1.ClientUserController.changePassword);
router.delete('/account', clientUserController_1.ClientUserController.deleteAccount);
