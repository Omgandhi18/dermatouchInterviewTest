// index.js

const express = require('express');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products'); 
const orderRoutes = require('./routes/orders');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 5001; // Use port 5001 to avoid conflicts with React's 3000

// Middleware
app.use(cors()); // Allows cross-origin requests
app.use(express.json()); // Allows us to parse JSON in the request body

// A simple test route to make sure the server is running
app.get('/', (req, res) => {
  res.json({ message: `Dermatouch API is running on port ${PORT}` });
});

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});