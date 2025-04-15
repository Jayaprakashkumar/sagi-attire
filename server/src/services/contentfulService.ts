import { createClient } from 'contentful';
import { ProductInventory } from '../models/ProductInventory';
import { InventoryTransaction } from '../models/InventoryTransaction';

// Initialize Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// Define the Contentful product type
interface ContentfulProduct {
  sys: {
    id: string;
  };
  fields: {
    name: string;
    description: any;
    price: number;
    offerInPercentage?: number;
    category?: string;
    images?: Array<{
      fields: {
        file: {
          url: string;
        };
      };
    }>;
    sizes?: Array<{
      name: string;
      quantity: number;
    }>;
  };
}

// Function to fetch all products from Contentful
export const fetchAllProducts = async (): Promise<ContentfulProduct[]> => {
  try {
    const response = await client.getEntries({
      content_type: 'product',
      limit: 1000,
    });

    return response.items as unknown as ContentfulProduct[];
  } catch (error) {
    console.error('Error fetching products from Contentful:', error);
    throw error;
  }
};

// Function to sync a single product from Contentful to MongoDB
export const syncProduct = async (product: ContentfulProduct): Promise<void> => {
  try {
    const { sys, fields } = product;
    const productId = sys.id;
    const name = fields.name;
    const category = fields.category || 'Uncategorized';
    const sizes = fields.sizes || [];

    // Calculate total quantity
    const totalQuantity = sizes.reduce((total, size) => total + size.quantity, 0);

    // Determine stock status
    let stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' = 'out_of_stock';
    if (totalQuantity > 10) {
      stockStatus = 'in_stock';
    } else if (totalQuantity > 0) {
      stockStatus = 'low_stock';
    }

    // Update or create product inventory
    const updatedProduct = await ProductInventory.findOneAndUpdate(
      { productId },
      {
        productId,
        name,
        category,
        sizes: sizes.map(size => ({
          name: size.name,
          quantity: size.quantity,
          lastUpdated: new Date(),
        })),
        totalQuantity,
        stockStatus,
        lastSynced: new Date(),
      },
      { upsert: true, new: true }
    );

    // Create inventory transaction record
    await InventoryTransaction.create({
      productId,
      size: 'all',
      quantityChange: totalQuantity,
      transactionType: 'sync',
      reference: `contentful_sync_${new Date().toISOString()}`,
      notes: 'Synced from Contentful',
    });

    console.log(`Synced product: ${name} (${productId})`);
  } catch (error) {
    console.error(`Error syncing product ${product.sys.id}:`, error);
    throw error;
  }
};

// Function to sync all products from Contentful to MongoDB
export const syncAllProducts = async (): Promise<void> => {
  try {
    console.log('Starting Contentful sync...');
    const products = await fetchAllProducts();
    
    for (const product of products) {
      await syncProduct(product);
    }
    
    console.log(`Sync completed. Processed ${products.length} products.`);
  } catch (error) {
    console.error('Error during Contentful sync:', error);
    throw error;
  }
}; 