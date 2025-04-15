import { ProductInventory, IProductInventory } from '../models/ProductInventory';
import { InventoryTransaction } from '../models/InventoryTransaction';
import { Order } from '../models/Order';

// Function to get inventory for a specific product
export const getProductInventory = async (productId: string): Promise<IProductInventory | null> => {
  try {
    return await ProductInventory.findOne({ productId });
  } catch (error) {
    console.error(`Error getting inventory for product ${productId}:`, error);
    throw error;
  }
};

// Function to get inventory for all products
export const getAllProductInventory = async (): Promise<IProductInventory[]> => {
  try {
    return await ProductInventory.find().sort({ name: 1 });
  } catch (error) {
    console.error('Error getting all product inventory:', error);
    throw error;
  }
};

// Function to check if a product is in stock
export const checkProductAvailability = async (
  productId: string,
  size: string,
  quantity: number
): Promise<boolean> => {
  try {
    const product = await ProductInventory.findOne({ productId });
    
    if (!product) {
      return false;
    }
    
    const sizeInventory = product.sizes.find(s => s.name === size);
    
    if (!sizeInventory) {
      return false;
    }
    
    return sizeInventory.quantity >= quantity;
  } catch (error) {
    console.error(`Error checking availability for product ${productId}:`, error);
    throw error;
  }
};

// Function to update inventory for an order
export const updateInventoryForOrder = async (orderId: string): Promise<void> => {
  try {
    const order = await Order.findOne({ orderId });
    
    if (!order) {
      throw new Error(`Order not found: ${orderId}`);
    }
    
    // Process each item in the order
    for (const item of order.items) {
      const { productId, size, quantity } = item;
      
      // Find the product inventory
      const product = await ProductInventory.findOne({ productId });
      
      if (!product) {
        throw new Error(`Product inventory not found: ${productId}`);
      }
      
      // Find the size in the product inventory
      const sizeIndex = product.sizes.findIndex(s => s.name === size);
      
      if (sizeIndex === -1) {
        throw new Error(`Size ${size} not found for product ${productId}`);
      }
      
      // Check if enough quantity is available
      const currentQuantity = product.sizes[sizeIndex].quantity as number;
      if (quantity && currentQuantity < quantity) {
        throw new Error(`Insufficient quantity for product ${productId}, size ${size}`);
      }
      
      // Update the quantity
      product.sizes[sizeIndex].quantity = currentQuantity - (quantity || 0);
      product.sizes[sizeIndex].lastUpdated = new Date();
      
      // Update total quantity
      product.totalQuantity = product.sizes.reduce((total, size) => total + size.quantity, 0);
      
      // Update stock status
      if (product.totalQuantity > 10) {
        product.stockStatus = 'in_stock';
      } else if (product.totalQuantity > 0) {
        product.stockStatus = 'low_stock';
      } else {
        product.stockStatus = 'out_of_stock';
      }
      
      // Save the updated product
      await product.save();
      
      // Create inventory transaction record
      await InventoryTransaction.create({
        productId,
        size,
        quantityChange: -(quantity || 0),
        transactionType: 'order',
        reference: orderId,
        notes: `Order ${orderId}`,
      });
    }
    
    console.log(`Inventory updated for order: ${orderId}`);
  } catch (error) {
    console.error(`Error updating inventory for order ${orderId}:`, error);
    throw error;
  }
};

// Function to adjust inventory (admin function)
export const adjustInventory = async (
  productId: string,
  size: string,
  quantityChange: number,
  adminId: string,
  notes?: string
): Promise<IProductInventory> => {
  try {
    const product = await ProductInventory.findOne({ productId });
    
    if (!product) {
      throw new Error(`Product inventory not found: ${productId}`);
    }
    
    // Find the size in the product inventory
    const sizeIndex = product.sizes.findIndex(s => s.name === size);
    
    if (sizeIndex === -1) {
      // If size doesn't exist, add it
      product.sizes.push({
        name: size,
        quantity: quantityChange > 0 ? quantityChange : 0,
        lastUpdated: new Date(),
      });
    } else {
      // Update existing size
      const newQuantity = product.sizes[sizeIndex].quantity + quantityChange;
      
      if (newQuantity < 0) {
        throw new Error(`Cannot reduce quantity below 0 for product ${productId}, size ${size}`);
      }
      
      product.sizes[sizeIndex].quantity = newQuantity;
      product.sizes[sizeIndex].lastUpdated = new Date();
    }
    
    // Update total quantity
    product.totalQuantity = product.sizes.reduce((total, size) => total + size.quantity, 0);
    
    // Update stock status
    if (product.totalQuantity > 10) {
      product.stockStatus = 'in_stock';
    } else if (product.totalQuantity > 0) {
      product.stockStatus = 'low_stock';
    } else {
      product.stockStatus = 'out_of_stock';
    }
    
    // Save the updated product
    const updatedProduct = await product.save();
    
    // Create inventory transaction record
    await InventoryTransaction.create({
      productId,
      size,
      quantityChange,
      transactionType: 'admin_adjustment',
      reference: adminId,
      notes: notes || `Admin adjustment by ${adminId}`,
    });
    
    console.log(`Inventory adjusted for product: ${productId}, size: ${size}`);
    return updatedProduct;
  } catch (error) {
    console.error(`Error adjusting inventory for product ${productId}:`, error);
    throw error;
  }
}; 