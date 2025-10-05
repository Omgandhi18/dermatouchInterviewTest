// src/screens/CartScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Button, SafeAreaView, Alert } from 'react-native';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; // <-- 1. Import AuthContext
import { placeOrder } from '../api/orderApi';       // <-- 2. Import placeOrder
import { useNavigation } from '@react-navigation/native'; 

const CartScreen = () => {
  const { items, removeFromCart, clearCart } = useContext(CartContext);
    const { userToken } = useContext(AuthContext);
  const navigation = useNavigation();

  // Calculate the total price
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // 5. Create the checkout handler
  const handleCheckout = async () => {
    try {
      const response = await placeOrder(items, userToken);
      if (response.order) {
        Alert.alert('Success', 'Your order has been placed!', [
          {
            text: 'OK',
            onPress: () => {
              clearCart();
              navigation.navigate('My Orders');
            },
          },
        ]);
      } else {
        Alert.alert('Error', response.message || 'Could not place order.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An unexpected error occurred during checkout.');
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Your cart is empty.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price} x {item.quantity}</Text>
            </View>
            <Button title="Remove" color="red" onPress={() => removeFromCart(item.id)} />
          </View>
        )}
      />
      <View style={styles.footer}>
        <Text style={styles.totalText}>Total: ₹{totalPrice.toFixed(2)}</Text>
        <Button title="Checkout" onPress={handleCheckout} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: 'gray',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemPrice: {
    fontSize: 14,
    color: 'gray',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: 'white',
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default CartScreen;