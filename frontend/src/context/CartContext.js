// src/context/CartContext.js
import React, { createContext, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);

  const addToCart = (product) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        // If item already exists, increase quantity
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        // Otherwise, add new item with quantity of 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (productId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};