// routes/orders.js

const express = require('express');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware'); // <-- Import middleware

const router = express.Router();

// Define paths to our mock DB files
const ordersDbPath = path.join(__dirname, '../db/orders.json');
const productsDbPath = path.join(__dirname, '../db/products.json');

// Helper functions to read/write data
const readOrders = () => JSON.parse(fs.readFileSync(ordersDbPath));
const writeOrders = (data) => fs.writeFileSync(ordersDbPath, JSON.stringify(data, null, 2));
const readProducts = () => JSON.parse(fs.readFileSync(productsDbPath));

// --- ROUTE: POST /api/orders ---
// This is a protected route. The authMiddleware will run before the main logic.
router.post('/', authMiddleware, (req, res) => {
  try {
    const { items } = req.body; // Expecting an array of items
    const userId = req.user.id; // We get this from the middleware

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart items are required.' });
    }

    const allProducts = readProducts();
    let totalAmount = 0;
    let orderItemsValid = true;

    // IMPORTANT: Calculate the total price on the server, not the client.
    // This prevents a user from manipulating the price on the frontend.
    items.forEach(item => {
      const product = allProducts.find(p => p.id === item.productId);
      if (product) {
        totalAmount += product.price * item.quantity;
      } else {
        orderItemsValid = false;
      }
    });

    if (!orderItemsValid) {
        return res.status(400).json({ message: 'One or more products in the cart are invalid.' });
    }

    // Create the new order object
    const newOrder = {
      orderId: Date.now(),
      userId,
      items,
      totalAmount,
      orderDate: new Date().toISOString(),
      status: 'Placed',
    };

    const orders = readOrders();
    orders.push(newOrder);
    writeOrders(orders);

    res.status(201).json({ message: 'Order placed successfully!', order: newOrder });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error placing order.' });
  }
});
router.get('/', authMiddleware, (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from the token via middleware

    const allOrders = readOrders();

    // Filter the orders to find only the ones matching the user's ID
    const userOrders = allOrders.filter(order => order.userId === userId);

    res.json(userOrders);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching orders.' });
  }
});

module.exports = router;