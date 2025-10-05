import { BASE_URL } from './authApi'; // Reuse the BASE_URL from authApi.js
export const placeOrder = async (items, token) => {
const orderPayload = {
    items: items.map(item => ({
      productId: item.id,
      quantity: item.quantity,
    })),
  };
  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`, // Pass the token here
    },
    body: JSON.stringify(orderPayload),
  });
 
  return response.json();
};

export const getMyOrders = async (token) => {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`, // Pass the token here
    },
  });
  return response.json();
};