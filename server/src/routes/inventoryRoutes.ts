import express from 'express';
import { 
  getProductInventory, 
  getAllProductInventory, 
  checkProductAvailability,
  adjustInventory
} from '../services/inventoryService';
import { syncAllProducts } from '../services/contentfulService';

const router = express.Router();

// Get all product inventory
router.get('/', async (req, res) => {
  try {
    const inventory = await getAllProductInventory();
    res.json(inventory);
  } catch (error) {
    console.error('Error getting all product inventory:', error);
    res.status(500).json({ error: 'Failed to get product inventory' });
  }
});

// Get inventory for a specific product
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const inventory = await getProductInventory(productId);
    
    if (!inventory) {
      return res.status(404).json({ error: 'Product inventory not found' });
    }
    
    res.json(inventory);
  } catch (error) {
    console.error('Error getting product inventory:', error);
    res.status(500).json({ error: 'Failed to get product inventory' });
  }
});

// Check product availability
router.get('/:productId/availability', async (req, res) => {
  try {
    const { productId } = req.params;
    const { size, quantity } = req.query;
    
    if (!size || !quantity) {
      return res.status(400).json({ error: 'Size and quantity are required' });
    }
    
    const isAvailable = await checkProductAvailability(
      productId,
      size as string,
      parseInt(quantity as string, 10)
    );
    
    res.json({ available: isAvailable });
  } catch (error) {
    console.error('Error checking product availability:', error);
    res.status(500).json({ error: 'Failed to check product availability' });
  }
});

// Adjust inventory (admin only)
router.post('/:productId/adjust', async (req, res) => {
  try {
    const { productId } = req.params;
    const { size, quantityChange, adminId, notes } = req.body;
    
    if (!size || quantityChange === undefined || !adminId) {
      return res.status(400).json({ error: 'Size, quantityChange, and adminId are required' });
    }
    
    const updatedInventory = await adjustInventory(
      productId,
      size,
      parseInt(quantityChange, 10),
      adminId,
      notes
    );
    
    res.json(updatedInventory);
  } catch (error) {
    console.error('Error adjusting inventory:', error);
    res.status(500).json({ error: 'Failed to adjust inventory' });
  }
});

// Sync inventory with Contentful (admin only)
router.post('/sync', async (req, res) => {
  try {
    await syncAllProducts();
    res.json({ message: 'Inventory synced with Contentful successfully' });
  } catch (error) {
    console.error('Error syncing inventory with Contentful:', error);
    res.status(500).json({ error: 'Failed to sync inventory with Contentful' });
  }
});

export default router; 