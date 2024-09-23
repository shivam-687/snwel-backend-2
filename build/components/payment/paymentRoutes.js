"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const paymentController_1 = require("./paymentController");
const PaymentRouter = express_1.default.Router();
PaymentRouter.post('/create-order', paymentController_1.createOrder);
PaymentRouter.post('/webhook', express_1.default.raw({ type: 'application/json' }), paymentController_1.handleWebhook);
exports.default = PaymentRouter;
