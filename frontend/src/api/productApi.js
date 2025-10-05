// src/api/productApi.js
import { BASE_URL } from './authApi'; // Reuse the BASE_URL from authApi.js
export const getProducts = async (searchQuery = '') => {
  try {
    // We can add search and category filters as query parameters
    const response = await fetch(`${BASE_URL}/products?search=${searchQuery}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('getProducts error:', error);
    return []; // Return an empty array on error
  }
};