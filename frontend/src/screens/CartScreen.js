// src/screens/CartScreen.js
import React, { useContext } from 'react';
import { View, Text, StyleSheet, FlatList, Button, SafeAreaView, Alert } from 'react-native';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; // <-- 1. Import AuthContext
import { placeOrder } from '../api/orderApi';       // <-- 2. Import placeOrder
import { useNavigation } from '@react-navigation/native'; 
import RazorpayCheckout from 'react-native-razorpay'; 
import { BASE_URL } from '../api/authApi';

const PAYMENT_API_URL = `${BASE_URL}/payment`; 
const CartScreen = () => {
  const { items, removeFromCart, clearCart } = useContext(CartContext);
    const { userToken } = useContext(AuthContext);
  const navigation = useNavigation();

  // Calculate the total price
  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = async () => {
    // 1. Create a Razorpay order from our backend
    const orderResponse = await fetch(`${PAYMENT_API_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: totalPrice, currency: 'INR' }),
    });
    const orderData = await orderResponse.json();

    if (!orderData.id) {
        Alert.alert('Error', 'Could not create a payment order.');
        return;
    }

    // 2. Configure and open the Razorpay checkout screen
    const options = {
      description: 'Payment for your Dermatouch order',
      image: 'https://your-company-logo.png', // Optional
      currency: 'INR',
      key: 'rzp_test_RPq0PLVcYztflC', // Use your Key ID
      amount: orderData.amount,
      name: 'Dermatouch',
      order_id: orderData.id,
      prefill: { email: 'user@example.com', contact: '9999999999' },
      theme: { color: '#841584' }
    };

    RazorpayCheckout.open(options)
      .then(async (data) => {
        // 3. On successful payment, now place the order in OUR database
        Alert.alert('Success', `Payment successful: ${data.razorpay_payment_id}`);

        // Call our original placeOrder function
        const finalOrderResponse = await placeOrder(items, userToken);
        if (finalOrderResponse.order) {
          clearCart();
          navigation.navigate('My Orders');
        } else {
          Alert.alert('Error', 'Payment was successful, but failed to place the order.');
        }
      })
      .catch((error) => {
        // 4. Handle payment failure or cancellation
        Alert.alert('Payment Failed', `Error: ${error.code} | ${error.description}`);
      });
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