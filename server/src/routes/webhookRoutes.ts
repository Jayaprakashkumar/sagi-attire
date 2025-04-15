import express from 'express';
import { syncProduct } from '../services/contentfulService';
import { createClient } from 'contentful';
import { handleWebhook } from '../controllers/webhookController';

const router = express.Router();

// Initialize Contentful client
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID || '',
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN || '',
});

// Contentful webhook handler
router.post('/contentful', async (req, res) => {
  try {
    // Verify webhook secret if provided
    const webhookSecret = process.env.CONTENTFUL_WEBHOOK_SECRET;
    if (webhookSecret) {
      const signature = req.headers['x-contentful-webhook-secret'];
      if (signature !== webhookSecret) {
        return res.status(401).json({ error: 'Invalid webhook secret' });
      }
    }
    
    // Get the entry from the webhook payload
    const { sys, fields } = req.body;
    
    // Check if it's a product entry
    if (sys.contentType.sys.id === 'product') {
      // Sync the product
      await syncProduct(req.body);
      console.log(`Webhook: Synced product ${sys.id}`);
    }
    
    res.status(200).json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing Contentful webhook:', error);
    res.status(500).json({ error: 'Failed to process webhook' });
  }
});

router.post('/razorpay', handleWebhook);

export default router; 