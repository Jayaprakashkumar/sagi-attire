import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the document
export interface IProductInventory extends Document {
  productId: string;
  name: string;
  category: string;
  sizes: Array<{
    name: string;
    quantity: number;
    lastUpdated: Date;
  }>;
  totalQuantity: number;
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastSynced: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Create the schema
const ProductInventorySchema = new Schema<IProductInventory>(
  {
    productId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    sizes: [
      {
        name: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 0,
          min: 0,
        },
        lastUpdated: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    totalQuantity: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    stockStatus: {
      type: String,
      enum: ['in_stock', 'low_stock', 'out_of_stock'],
      default: 'out_of_stock',
    },
    lastSynced: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
export const ProductInventory = mongoose.model<IProductInventory>(
  'ProductInventory',
  ProductInventorySchema
); 