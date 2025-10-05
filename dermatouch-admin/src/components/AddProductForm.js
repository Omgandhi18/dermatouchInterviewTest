// src/components/AddProductForm.js
import React, { useState } from 'react';

const AddProductForm = ({ onProductAdded }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !category || !price) {
      alert('Please fill out all fields.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5001/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, price }),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const newProduct = await response.json();
      onProductAdded(newProduct); // Notify parent component to update the list

      // Clear form
      setName('');
      setCategory('');
      setPrice('');

    } catch (error) {
      console.error(error);
      alert('Error creating product.');
    }
  };

  return (
    <div className="add-product-form">
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};

export default AddProductForm;