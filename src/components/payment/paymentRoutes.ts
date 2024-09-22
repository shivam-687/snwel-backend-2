import express from 'express';
import { createOrder, handleWebhook } from './paymentController';

const PaymentRouter = express.Router();

PaymentRouter.post('/create-order', createOrder);
PaymentRouter.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default PaymentRouter;