// src/navigation/AppNavigator.js
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthContext } from '../context/AuthContext';

// Import Screens
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProductListScreen from '../screens/ProductListScreen';
import CartScreen from '../screens/CartScreen';
import OrdersScreen from '../screens/OrdersScreen';
import { useContext } from 'react';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Stack for unauthenticated users
const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

// Tab navigator for authenticated users
const MainTabs = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Products" component={ProductListScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="My Orders" component={OrdersScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { isLoading, userToken } = useContext(AuthContext); // <-- Use the context

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return userToken ? <MainTabs /> : <AuthStack />; // <-- Dynamic rendering!
};


export default AppNavigator;