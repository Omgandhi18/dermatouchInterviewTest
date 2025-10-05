// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import ProductList from './components/ProductList';
import AddProductForm from './components/AddProductForm'; // Import the form
import EditProductForm from './components/EditProductForm'; 

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5001/api/products');
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductAdded = (newProduct) => {
    setProducts(currentProducts => [...currentProducts, newProduct]);
  };
    // Add this new handler
  const handleProductDeleted = (deletedProductId) => {
    setProducts(currentProducts => 
      currentProducts.filter(p => p.id !== deletedProductId)
    );
  };

   // Handlers for editing
  const handleEditClick = (product) => {
    setEditingProduct(product);
  };
  const handleCancelEdit = () => {
    setEditingProduct(null);
  };
  const handleProductUpdated = (updatedProduct) => {
    setProducts(current => 
      current.map(p => (p.id === updatedProduct.id ? updatedProduct : p))
    );
    setEditingProduct(null); // Exit editing mode
  };


  return (
    <div className="App">
      <header className="App-header">
        <h1>Dermatouch Admin Panel</h1>
      </header>
      <main>
        {editingProduct ? (
          <EditProductForm 
            product={editingProduct} 
            onProductUpdated={handleProductUpdated} 
            onCancel={handleCancelEdit} 
          />
        ) : (
          <AddProductForm onProductAdded={handleProductAdded} />
        )}
        <ProductList 
          products={products} 
          isLoading={isLoading} 
          onProductDeleted={handleProductDeleted}
          onEditClick={handleEditClick}
        />
      </main>
    </div>
  );
}

export default App;