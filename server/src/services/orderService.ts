import { Order, IOrder } from '../models/Order';
import { checkProductAvailability, updateInventoryForOrder } from './inventoryService';
import { v4 as uuidv4 } from 'uuid';

// Function to create a new order
export const createOrder = async (orderData: Omit<IOrder, 'orderId' | 'status' | 'paymentStatus' | 'createdAt' | 'updatedAt'>): Promise<IOrder> => {
  try {
    // Generate a unique order ID
    const orderId = `ORD-${uuidv4().substring(0, 8).toUpperCase()}`;
    
    // Check product availability for all items
    for (const item of orderData.items) {
      const { productId, size, quantity } = item;
      
      const isAvailable = await checkProductAvailability(productId, size, quantity);
      
      if (!isAvailable) {
        throw new Error(`Product ${productId} with size ${size} is not available in the requested quantity`);
      }
    }
    
    // Create the order
    const order = new Order({
      ...orderData,
      orderId,
      status: 'pending',
      paymentStatus: 'pending',
    });
    
    // Save the order
    const savedOrder = await order.save();
    
    console.log(`Order created: ${orderId}`);
    return savedOrder;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Function to get an order by ID
export const getOrderById = async (orderId: string): Promise<IOrder | null> => {
  try {
    return await Order.findOne({ orderId });
  } catch (error) {
    console.error(`Error getting order ${orderId}:`, error);
    throw error;
  }
};

// Function to get all orders
export const getAllOrders = async (): Promise<IOrder[]> => {
  try {
    return await Order.find().sort({ createdAt: -1 });
  } catch (error) {
    console.error('Error getting all orders:', error);
    throw error;
  }
};

// Function to get orders for a specific user
export const getUserOrders = async (userId: string): Promise<IOrder[]> => {
  try {
    return await Order.find({ userId }).sort({ createdAt: -1 });
  } catch (error) {
    console.error(`Error getting orders for user ${userId}:`, error);
    throw error;
  }
};

// Function to update order status
export const updateOrderStatus = async (
  orderId: string,
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled'
): Promise<IOrder> => {
  try {
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }
    
    // Update the status
    order.status = status;
    
    // If the order is confirmed, update inventory
    if (status === 'confirmed' && order.status !== 'confirmed') {
      await updateInventoryForOrder(orderId);
    }
    
    // Save the updated order
    const updatedOrder = await order.save();
    
    console.log(`Order ${orderId} status updated to ${status}`);
    return updatedOrder;
  } catch (error) {
    console.error(`Error updating order ${orderId} status:`, error);
    throw error;
  }
};

// Function to update payment status
export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded',
  paymentId?: string
): Promise<IOrder> => {
  try {
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }
    
    // Update the payment status
    order.paymentStatus = paymentStatus;
    
    // Update payment ID if provided
    if (paymentId) {
      order.paymentId = paymentId;
    }
    
    // If payment is successful, confirm the order
    if (paymentStatus === 'paid' && order.status === 'pending') {
      order.status = 'confirmed';
      await updateInventoryForOrder(orderId);
    }
    
    // Save the updated order
    const updatedOrder = await order.save();
    
    console.log(`Order ${orderId} payment status updated to ${paymentStatus}`);
    return updatedOrder;
  } catch (error) {
    console.error(`Error updating order ${orderId} payment status:`, error);
    throw error;
  }
};

// Function to cancel an order
export const cancelOrder = async (orderId: string): Promise<IOrder> => {
  try {
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }
    
    // Check if the order can be cancelled
    if (order.status === 'delivered' || order.status === 'cancelled') {
      throw new Error(`Order ${orderId} cannot be cancelled`);
    }
    
    // Update the status to cancelled
    order.status = 'cancelled';
    
    // Save the updated order
    const updatedOrder = await order.save();
    
    console.log(`Order ${orderId} cancelled`);
    return updatedOrder;
  } catch (error) {
    console.error(`Error cancelling order ${orderId}:`, error);
    throw error;
  }
}; 