// src/screens/ProductListScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
  Text
} from 'react-native';
import { getProducts } from '../api/productApi';
import ProductCard from '../components/ProductCard';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

const ProductListScreen = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // For initial load only
  const [searchQuery, setSearchQuery] = useState('');

  // useFocusEffect will run when the screen comes into view
  useFocusEffect(
    useCallback(() => {
      const fetchInitialProducts = async () => {
        try {
          setIsLoading(true);
          const data = await getProducts(); // Fetch all products initially
          setProducts(data);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchInitialProducts();
    }, [])
  );

  useEffect(() => {
    // This effect handles searching without a full-screen reload.
    const handler = setTimeout(async () => {
      if (!isLoading) { // Don't search while initial load is happening
        const data = await getProducts(searchQuery);
        setProducts(data);
      }
    }, 300); // Debounce for 300ms to avoid API calls on every keystroke

    return () => {
      clearTimeout(handler); // Cleanup the timeout
    };
  }, [searchQuery, isLoading]);

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centered}>
          <ActivityIndicator size="large" />
        </View>
      );
    }

    if (products.length === 0) {
      return (
        <View style={styles.centered}>
            <Text>No products found.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={products}
        renderItem={({ item }) => <ProductCard product={item} />}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Search for products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      {renderContent()}
    </SafeAreaView>
  );
};

// Styles remain the same
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
  searchBar: {
    height: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    margin: 16,
    fontSize: 16,
  },
  list: {
    paddingBottom: 16,
  },
});

export default ProductListScreen;