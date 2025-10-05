// src/components/ProductCard.js
import React, { useContext } from 'react'; // <-- Add useContext
import { View, Text, StyleSheet, Button, Alert } from 'react-native';
import { CartContext } from '../context/CartContext'; // <-- Import CartContext

// This component receives a single `product` object as a prop
const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext); // <-- Get addToCart from context

  const handleAddToCart = () => {
    addToCart(product);
    Alert.alert('Success', 'Product added to cart');
  };

  return (
    <View style={styles.card}>
      {/* A placeholder for the product image */}
      <View style={styles.imagePlaceholder} />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.price}>₹{product.price}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button title="Add to Cart" onPress={handleAddToCart} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 2,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#444',
  },
  buttonContainer: {
    justifyContent: 'center',
  },
});

export default ProductCard;