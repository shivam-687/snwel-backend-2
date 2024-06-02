"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
exports.UserRouter = router;
router.get('/', passport_1.default.authenticate('jwt', { session: false }), userController_1.getUserListController);
router.get('/me', passport_1.default.authenticate('jwt', { session: false }), userController_1.getMeController);
router.put('/:id', passport_1.default.authenticate('jwt', { session: false }), userController_1.updateUserController);
router.get('/:id', passport_1.default.authenticate('jwt', { session: false }), userController_1.getUserController);
