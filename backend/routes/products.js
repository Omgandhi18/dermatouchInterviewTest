// routes/products.js

const express = require('express');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Define path to products.json
const productsDbPath = path.join(__dirname, '../db/products.json');

// Helper function to read products from the DB
const readProducts = () => {
  const productsData = fs.readFileSync(productsDbPath);
  return JSON.parse(productsData);
};

// --- ROUTE: GET /api/products ---
// Supports filtering by category and searching by name
router.get('/', (req, res) => {
  try {
    const { category, search } = req.query; // Get query params
    let products = readProducts();

    // 1. Filter by category if provided
    if (category) {
      products = products.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
      );
    }

    // 2. Filter by search term if provided
    if (search) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json(products);
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching products.' });
  }
});

// --- ROUTE: POST /api/products ---
// Creates a new product
router.post('/', (req, res) => {
  try {
    const { name, category, price } = req.body;

    // Basic validation
    if (!name || !category || !price) {
      return res.status(400).json({ message: 'Name, category, and price are required.' });
    }

    const products = readProducts();

    const newProduct = {
      id: Date.now(), // Simple unique ID
      name,
      category,
      price: parseFloat(price), // Ensure price is a number
      imageUrl: 'https://example.com/images/placeholder.jpg', // Default image
    };

    products.push(newProduct);
    
    // Write the updated array back to the file
    fs.writeFileSync(productsDbPath, JSON.stringify(products, null, 2));

    res.status(201).json(newProduct);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating product.' });
  }
});

router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const products = readProducts();
    let productFound = false;
    
    const updatedProducts = products.map(p => {
      if (p.id.toString() === id) {
        productFound = true;
        // Return a new object with the updated details
        return { ...p, name, category, price: parseFloat(price) };
      }
      return p; // Return the original product if it's not the one we're updating
    });

    if (!productFound) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    fs.writeFileSync(productsDbPath, JSON.stringify(updatedProducts, null, 2));

    // Find and return the newly updated product
    const updatedProduct = updatedProducts.find(p => p.id.toString() === id);
    res.status(200).json(updatedProduct);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating product.' });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameter
    const products = readProducts();

    // Create a new array excluding the product to be deleted
    const updatedProducts = products.filter(p => p.id.toString() !== id);

    // Check if a product was actually deleted
    if (products.length === updatedProducts.length) {
      return res.status(404).json({ message: 'Product not found.' });
    }

    // Write the new array back to the file
    fs.writeFileSync(productsDbPath, JSON.stringify(updatedProducts, null, 2));

    res.status(200).json({ message: 'Product deleted successfully.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting product.' });
  }
});

module.exports = router;