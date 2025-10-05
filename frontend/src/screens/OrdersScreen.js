// src/screens/OrdersScreen.js
import React, { useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, SafeAreaView } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../context/AuthContext';
import { getMyOrders } from '../api/orderApi';

const OrdersScreen = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userToken } = useContext(AuthContext);

  // useFocusEffect runs every time the screen comes into view
  useFocusEffect(
    useCallback(() => {
      const fetchOrders = async () => {
        try {
          setIsLoading(true);
          const data = await getMyOrders(userToken);
          setOrders(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      if (userToken) {
        fetchOrders();
      }
    }, [userToken])
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.centered}>
        <Text>No past orders found.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={item => item.orderId.toString()}
        renderItem={({ item }) => (
          <View style={styles.orderCard}>
            <Text style={styles.orderId}>Order ID: {item.orderId}</Text>
            <Text>Date: {new Date(item.orderDate).toLocaleDateString()}</Text>
            <Text>Items: {item.items.length}</Text>
            <Text style={styles.orderTotal}>Total: ₹{item.totalAmount.toFixed(2)}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderCard: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderId: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderTotal: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'right',
  },
});

export default OrdersScreen;