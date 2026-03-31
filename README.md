# ConstructMart - Local Construction Materials E-Commerce

A full-stack system built with the MERN stack (MongoDB, Express, React, Node.js) featuring location-based dealer discovery, real-time inventory tracking, and role-based access.

## Features Included
- **User Authentication:** JWT based auth with roles (`customer`, `dealer`, `admin`).
- **Real-Time WebSockets:** Uses Socket.io to push instantaneous stock updates and incoming order alerts.
- **Geospatial Searches:** MongoDB `$near` queries to find dealers within a certain distance radius of the user.
- **Interactive Map:** Leaflet integration for viewing nearby dealers.
- **Multi-Vendor Cart Flow:** Customers can place orders spanning multiple different local dealers in a single checkout.
- **Unified Dashboards:** Dealers can manage their stock via CRUD and accept/reject orders in real-time.

## Setup Instructions

### 1. Backend Setup
1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start MongoDB locally (ensure it is running on standard port `27017` or update the `.env`).
4. **Seed the Database** with sample products, users, and dealers:
   ```bash
   node seeder.js
   ```
5. Start the backend DEV server:
   ```bash
   node server.js
   ```
   *Server will run on http://localhost:5000*

### 2. Frontend Setup
1. Open a new terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite dev server:
   ```bash
   npm run dev
   ```
   *Frontend will be accessible at http://localhost:5173*

## Demo Credentials
Since the seeder populates the DB with dummy data, you can use these to test the flows:

| Role | Email | Password | Details |
|------|-------|----------|---------|
| **Customer** | `customer@test.com` | `123456` | Can view products, search map, and checkout. |
| **Dealer 1** | `dealer1@test.com` | `123456` | Based in Nagpur. Has inventory. |
| **Dealer 2** | `dealer2@test.com` | `123456` | Based in Wardha. Has inventory. |

Enjoy exploring ConstructMart!
