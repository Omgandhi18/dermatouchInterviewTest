import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext'; // <-- Import

export default function App() {
  return (
    <AuthProvider>
      <CartProvider> {/* <-- Add CartProvider here */}
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </CartProvider>
    </AuthProvider>
  );
}