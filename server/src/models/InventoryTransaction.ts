import mongoose, { Document, Schema } from 'mongoose';

// Define the interface for the document
export interface IInventoryTransaction extends Document {
  productId: string;
  size: string;
  quantityChange: number;
  transactionType: 'order' | 'admin_adjustment' | 'sync';
  reference: string;
  notes?: string;
  createdAt: Date;
}

// Create the schema
const InventoryTransactionSchema = new Schema<IInventoryTransaction>(
  {
    productId: {
      type: String,
      required: true,
      index: true,
    },
    size: {
      type: String,
      required: true,
    },
    quantityChange: {
      type: Number,
      required: true,
    },
    transactionType: {
      type: String,
      enum: ['order', 'admin_adjustment', 'sync'],
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
export const InventoryTransaction = mongoose.model<IInventoryTransaction>(
  'InventoryTransaction',
  InventoryTransactionSchema
); 