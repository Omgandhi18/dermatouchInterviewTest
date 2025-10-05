// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loginUser, registerUser } from '../api/authApi';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  const login = async (email, password) => {
    const response = await loginUser(email, password);
    if (response.token) {
      setUserToken(response.token);
      await AsyncStorage.setItem('userToken', response.token);
    }
    return response;
  };

  const logout = async () => {
    setUserToken(null);
    await AsyncStorage.removeItem('userToken');
  };

  const register = async (email, password) => {
    return await registerUser(email, password);
  };

  const isLoggedIn = async () => {
    try {
      setIsLoading(true);
      let token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
    } catch (e) {
      console.log(`isLoggedIn error: ${e}`);
    } finally {
        setIsLoading(false);
    }
  };

  useEffect(() => {
    isLoggedIn();
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, register, isLoading, userToken }}>
      {children}
    </AuthContext.Provider>
  );
};