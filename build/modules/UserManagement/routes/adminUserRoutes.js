"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUserRouter = void 0;
const express_1 = require("express");
const adminUserController_1 = require("../controllers/adminUserController");
const checkPermission_1 = require("../middleware/checkPermission");
const passport_1 = __importDefault(require("passport"));
const router = (0, express_1.Router)();
exports.AdminUserRouter = router;
router.use(passport_1.default.authenticate('jwt', { session: false }));
router.post('/', (0, checkPermission_1.checkPermission)('USER_CREATE'), adminUserController_1.AdminUserController.createUser);
router.get('/', (0, checkPermission_1.checkPermission)('USER_VIEW'), adminUserController_1.AdminUserController.getAllUsers);
router.put('/:id', (0, checkPermission_1.checkPermission)('USER_UPDATE'), adminUserController_1.AdminUserController.updateUser);
router.delete('/:id', (0, checkPermission_1.checkPermission)('USER_DELETE'), adminUserController_1.AdminUserController.deleteUser);
router.patch('/:id/status', (0, checkPermission_1.checkPermission)('USER_UPDATE'), adminUserController_1.AdminUserController.toggleUserStatus);
router.post('/:id/roles', (0, checkPermission_1.checkPermission)('ROLE_ASSIGN'), adminUserController_1.AdminUserController.assignRoles);
