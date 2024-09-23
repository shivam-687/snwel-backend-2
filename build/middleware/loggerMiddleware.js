"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loggerMiddleware = void 0;
const logger_1 = require("../utils/logger");
const loggerMiddleware = (req, res, next) => {
    logger_1.logger.info(`${req.method} ${req.url}`, {
        ip: req.ip,
        response: res.status,
        userAgent: req.headers['user-agent'],
    });
    next();
};
exports.loggerMiddleware = loggerMiddleware;
