"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const indexRoutes_1 = require("./routes/indexRoutes");
const loggerMiddleware_1 = require("./middleware/loggerMiddleware");
const security_middleware_1 = __importDefault(require("./middleware/security.middleware"));
const passport_config_1 = __importDefault(require("./config/passport-config"));
const dbClient_1 = __importDefault(require("./db/dbClient"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const app = (0, express_1.default)();
exports.app = app;
app.use((0, helmet_1.default)({
    crossOriginEmbedderPolicy: false,
}));
app.use((0, cors_1.default)());
(0, dbClient_1.default)();
app.use(passport_config_1.default.initialize());
app.use(express_1.default.json());
app.use(security_middleware_1.default);
app.use(loggerMiddleware_1.loggerMiddleware);
app.use(express_1.default.static('public'));
app.use('/', indexRoutes_1.indexRoute);
