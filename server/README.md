# Sagi Attire Inventory Management Backend

This is the backend service for Sagi Attire's inventory management system. It provides APIs for managing product inventory, processing orders, and syncing with Contentful CMS.

## Features

- **Inventory Management**: Track product inventory with size variants
- **Order Processing**: Handle order creation, status updates, and cancellation
- **Contentful Integration**: Sync product data from Contentful CMS
- **Webhook Support**: Receive real-time updates from Contentful

## Tech Stack

- **Node.js**: Runtime environment
- **Express**: Web framework
- **TypeScript**: Programming language
- **MongoDB**: Database
- **Contentful**: Headless CMS integration

## Project Structure

```
server/
├── src/
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── config/           # Configuration files
│   ├── middleware/       # Express middleware
│   └── index.ts          # Entry point
├── .env                  # Environment variables
├── package.json          # Dependencies
└── tsconfig.json         # TypeScript configuration
```

## API Endpoints

### Inventory

- `GET /api/inventory`: Get all product inventory
- `GET /api/inventory/:productId`: Get inventory for a specific product
- `GET /api/inventory/:productId/availability`: Check product availability
- `POST /api/inventory/:productId/adjust`: Adjust inventory (admin only)
- `POST /api/inventory/sync`: Sync inventory with Contentful (admin only)

### Orders

- `POST /api/orders`: Create a new order
- `GET /api/orders`: Get all orders (admin only)
- `GET /api/orders/user/:userId`: Get orders for a specific user
- `GET /api/orders/:orderId`: Get order by ID
- `PATCH /api/orders/:orderId/status`: Update order status (admin only)
- `PATCH /api/orders/:orderId/payment`: Update payment status
- `POST /api/orders/:orderId/cancel`: Cancel order

### Webhooks

- `POST /api/webhooks/contentful`: Contentful webhook handler

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/sagi-attire
   CONTENTFUL_SPACE_ID=your_contentful_space_id
   CONTENTFUL_ACCESS_TOKEN=your_contentful_access_token
   CONTENTFUL_WEBHOOK_SECRET=your_webhook_secret
   NODE_ENV=development
   ```
4. Start the development server:
   ```
   npm run dev
   ```
5. Build for production:
   ```
   npm run build
   ```
6. Start the production server:
   ```
   npm start
   ```

## Contentful Webhook Setup

1. Go to your Contentful space settings
2. Navigate to Webhooks
3. Create a new webhook
4. Set the URL to `https://your-api-url/api/webhooks/contentful`
5. Select the events you want to trigger the webhook (e.g., Entry publish, Entry unpublish)
6. Set the webhook secret in your `.env` file

## License

ISC 