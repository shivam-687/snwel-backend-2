"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserListController = void 0;
const User_1 = require("@/models/User");
const getUserListController = async (req, res) => {
    console.log({ user: req.user });
    const user = await User_1.UserModel.find({});
    return res.json({ data: user });
};
exports.getUserListController = getUserListController;
