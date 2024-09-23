"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleWebhook = exports.createOrder = void 0;
const razorpay_1 = __importDefault(require("./lib/razorpay"));
const transaction_1 = __importDefault(require("./models/transaction"));
const crypto_1 = __importDefault(require("crypto"));
const catchAsync_1 = require("../../utils/helpers/catchAsync");
exports.createOrder = (0, catchAsync_1.catchAsync)(async (req, res) => {
    try {
        const { amount, currency = 'INR', receipt } = req.body;
        if (!amount) {
            return res.status(400).json({ error: 'Amount is required' });
        }
        const options = {
            amount: amount * 100,
            currency,
            receipt: receipt || `receipt_${Date.now()}`,
            payment_capture: 1,
        };
        const order = await razorpay_1.default.orders.create(options);
        res.status(201).json({
            success: true,
            order,
        });
    }
    catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.handleWebhook = (0, catchAsync_1.catchAsync)(async (req, res) => {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];
    const payload = JSON.stringify(req.body);
    console.log("WEBHOOK CALLED");
    const expectedSignature = crypto_1.default
        .createHmac('sha256', secret)
        .update(payload)
        .digest('hex');
    if (signature !== expectedSignature) {
        return res.status(200).json({ error: 'Invalid signature' });
    }
    const event = req.body.event;
    const data = req.body.payload.payment.entity;
    try {
        if (event === 'payment.captured') {
            const transaction = new transaction_1.default({
                orderId: data.order_id,
                paymentId: data.id,
                signature: signature,
                amount: data.amount / 100, // Converting paise to rupees
                currency: data.currency,
                status: data.status,
            });
            await transaction.save();
        }
        // Handle other event types as needed
        res.status(200).json({ status: 'success' });
    }
    catch (error) {
        console.error('Error handling webhook:', error);
        res.status(200).json({ error: 'Internal Server Error' });
    }
});
