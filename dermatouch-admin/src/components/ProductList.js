// src/components/ProductList.js
import React, { useState, useEffect } from 'react';

const ProductList = ({ products, isLoading, onProductDeleted, onEditClick }) => {


    const handleDelete = async (productId) => {
    // Add a confirmation dialog for safety
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Notify the parent component to update the state
      onProductDeleted(productId);

    } catch (error) {
      console.error(error);
      alert('Error deleting product.');
    }
  };

  if (isLoading) {
    return <p>Loading products...</p>;
  }

  return (
    <div className="product-list">
      <h2>Manage Products</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>₹{product.price}</td>
              <td>
                <button onClick={() => onEditClick(product)}>Edit</button>
                <button onClick={() => handleDelete(product.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList;