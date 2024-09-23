"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const passport_config_1 = __importDefault(require("../config/passport-config"));
const common_1 = require("../config/common");
const appResponse_1 = require("../utils/helpers/appResponse");
const validateSchema_1 = require("../middleware/validateSchema");
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthRouter = express_1.default.Router();
// Register route
AuthRouter.post('/register', authController_1.register);
AuthRouter.post('/login', (0, validateSchema_1.validateSchema)(zod_1.z.object({ email: zod_1.z.string().email(), password: zod_1.z.string().min(3) })), async (req, res, next) => {
    passport_config_1.default.authenticate('login', async (err, user, _info) => {
        try {
            if (err) {
                return next(err);
            }
            if (!user) {
                return (0, appResponse_1.errorResponse)(null, res, { status: 401, message: "Unauthenticated!" });
            }
            req.login(user, { session: false }, async (error) => {
                if (error)
                    return next(error);
                const token = jsonwebtoken_1.default.sign({ user }, common_1.CommonConfig.JWT_SECRET);
                console.log({ user });
                return res.json({ token, email: user.email, name: user.name, roles: user.roles, picture: user.profilePic, id: user?._id });
            });
        }
        catch (error) {
            return next(error);
        }
    })(req, res, next);
});
exports.default = AuthRouter;
