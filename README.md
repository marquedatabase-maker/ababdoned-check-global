# Abandoned Checkout & Order Tracker SaaS

A multi-tenant SaaS application to track abandoned checkouts and orders from Shopify and GoKwik.

## Features
- **Multi-Tenant Architecture**: Users (store owners) have isolated dashboards.
- **Universal Webhook**: A single endpoint handles both Shopify and GoKwik webhooks.
- **Real-time Analytics**: Track total leads, abandoned checkouts, converted orders, and lost revenue.
- **Modern UI**: Built with React, Tailwind CSS, and Lucide icons.

## Tech Stack
- **Backend**: Node.js (ES6 Modules), Express, MongoDB, JWT
- **Frontend**: React.js (Vite), Tailwind CSS, Axios, Lucide React

## Setup Instructions

### 1. Prerequisites
- Node.js installed
- MongoDB installed and running

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure `.env` file:
   - Copy `.env.example` from the root to `backend/.env`
   - Update `MONGO_URI` and `JWT_SECRET`
4. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

### 4. Webhook Integration
- **Shopify**: Configure webhooks in Shopify Admin -> Settings -> Notifications -> Webhooks. Set the URL to your deployed server's `/webhook` endpoint.
- **GoKwik**: Configure webhooks in the GoKwik merchant portal to point to your `/webhook` endpoint.

## Webhook Data Format
The system normalizes data from both providers into a common Lead schema:
- `store_id`: Slug identifier
- `name`: Customer name
- `phone`: Customer phone
- `email`: Customer email
- `amount`: Checkout/Order amount
- `status`: started / abandoned / failed / success
- `source`: shopify / gokwik
- `created_at`: Timestamp
