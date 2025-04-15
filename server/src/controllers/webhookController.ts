import { Request, Response } from 'express';
import crypto from 'crypto';
import { Order } from '../models/Order';

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (!webhookSecret || !signature) {
      return res.status(400).json({ error: 'Missing webhook secret or signature' });
    }

    // Verify webhook signature
    const hmac = crypto.createHmac('sha256', webhookSecret);
    hmac.update(JSON.stringify(req.body));
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const { event, payload } = req.body;

    switch (event) {
      case 'payment.captured':
        await handlePaymentCaptured(payload);
        break;
      case 'payment.failed':
        await handlePaymentFailed(payload);
        break;
      default:
        console.log(`Unhandled webhook event: ${event}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

async function handlePaymentCaptured(payload: any) {
  const { payment_id, order_id } = payload.payment.entity;
  
  const order = await Order.findOne({ razorpayOrderId: order_id });
  if (!order) {
    console.error(`Order not found for Razorpay order ID: ${order_id}`);
    return;
  }

  order.paymentStatus = 'completed';
  order.razorpayPaymentId = payment_id;
  order.orderStatus = 'processing';
  order.updatedAt = new Date();
  
  await order.save();
}

async function handlePaymentFailed(payload: any) {
  const { order_id } = payload.payment.entity;
  
  const order = await Order.findOne({ razorpayOrderId: order_id });
  if (!order) {
    console.error(`Order not found for Razorpay order ID: ${order_id}`);
    return;
  }

  order.paymentStatus = 'failed';
  order.orderStatus = 'cancelled';
  order.updatedAt = new Date();
  
  await order.save();
} 