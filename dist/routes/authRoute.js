"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_config_1 = __importDefault(require("@/config/passport-config"));
const common_1 = require("@/config/common");
const jwt = require('jsonwebtoken');
const AuthRouter = express_1.default.Router();
// Register route
AuthRouter.post('/register', passport_config_1.default.authenticate('signup', { session: false }), async (req, res, next) => {
    res.json({
        message: 'Signup successful',
        user: req.user
    });
});
// Login route
// ...
const router = express_1.default.Router();
// ...
router.post('/login', async (req, res, next) => {
    passport_config_1.default.authenticate('login', async (err, user, info) => {
        try {
            if (err || !user) {
                const error = new Error('An error occurred.');
                return next(error);
            }
            req.login(user, { session: false }, async (error) => {
                if (error)
                    return next(error);
                const body = { _id: user._id, email: user.email };
                const token = jwt.sign({ user: body }, common_1.CommonConfig.JWT_SECRET);
                return res.json({ token });
            });
        }
        catch (error) {
            return next(error);
        }
    })(req, res, next);
});
module.exports = router;
exports.default = AuthRouter;
