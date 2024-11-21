"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMeController = exports.getUserController = exports.updateUserController = exports.getUserListController = void 0;
const userService_1 = require("../service/userService");
const appResponse_1 = require("../utils/helpers/appResponse");
const getUserListController = async (req, res) => {
    try {
        const user = await (0, userService_1.listUsers)(Object.assign({}, req.query));
        return (0, appResponse_1.successResponse)(user, res);
    }
    catch (error) {
        return (0, appResponse_1.errorResponseFromError)(error, res);
    }
};
exports.getUserListController = getUserListController;
const updateUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await (0, userService_1.updateUser)({ userId: id, updates: req.body });
        return (0, appResponse_1.successResponse)(user, res);
    }
    catch (error) {
        return (0, appResponse_1.errorResponseFromError)(error, res);
    }
};
exports.updateUserController = updateUserController;
const getUserController = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await (0, userService_1.getUserById)(id);
        return (0, appResponse_1.successResponse)(user, res);
    }
    catch (error) {
        return (0, appResponse_1.errorResponseFromError)(error, res);
    }
};
exports.getUserController = getUserController;
const getMeController = async (req, res) => {
    try {
        const userId = req.user && '_id' in req.user ? req.user._id : '';
        const user = await (0, userService_1.me)(userId);
        return (0, appResponse_1.successResponse)(user, res);
    }
    catch (error) {
        return (0, appResponse_1.errorResponseFromError)(error, res);
    }
};
exports.getMeController = getMeController;
