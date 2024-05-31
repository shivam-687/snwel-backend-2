"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateJWT = void 0;
const passport_config_1 = __importDefault(require("@/config/passport-config"));
const authenticateJWT = (req, res, next) => {
    passport_config_1.default.authenticate('jwt', { session: false }, (error, user, info) => {
        if (error) {
            return res.status(500).json({ message: 'Internal server error' });
        }
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        // If authentication is successful, attach the user object to the request
        req.user = user;
        next();
    })(req, res, next);
};
exports.authenticateJWT = authenticateJWT;
