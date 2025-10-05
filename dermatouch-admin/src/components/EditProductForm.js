// src/components/EditProductForm.js
import React, { useState, useEffect } from 'react';

const EditProductForm = ({ product, onProductUpdated, onCancel }) => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');

  useEffect(() => {
    // When the product prop changes, update the form fields
    if (product) {
      setName(product.name);
      setCategory(product.category);
      setPrice(product.price);
    }
  }, [product]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5001/api/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, price }),
      });
      if (!response.ok) throw new Error('Update failed');
      const updatedProduct = await response.json();
      onProductUpdated(updatedProduct);
    } catch (error) {
      alert('Error updating product.');
    }
  };

  return (
    <div className="edit-product-form">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
        <input type="text" value={category} onChange={e => setCategory(e.target.value)} />
        <input type="number" value={price} onChange={e => setPrice(e.target.value)} />
        <button type="submit">Update Product</button>
        <button type="button" onClick={onCancel}>Cancel</button>
      </form>
    </div>
  );
};

export default EditProductForm;