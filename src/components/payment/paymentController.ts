// src/controllers/paymentController.ts
import { Request, Response } from 'express';
import razorpayInstance from './lib/razorpay';
import Transaction from './models/transaction';
import crypto from 'crypto'
import { catchAsync } from '@/utils/helpers/catchAsync';

export const createOrder = catchAsync( async (req: Request, res: Response): Promise<any> => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;

    if (!amount) {
      return res.status(400).json({ error: 'Amount is required' });
    }

    const options: any = {
      amount: amount * 100,
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export const handleWebhook = catchAsync(async (req: Request, res: Response): Promise<any> => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  const signature = req.headers['x-razorpay-signature'] as string;
  const payload = JSON.stringify(req.body);

  console.log("WEBHOOK CALLED")

  const expectedSignature = crypto
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
      const transaction = new Transaction({
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
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(200).json({ error: 'Internal Server Error' });
  }
});
