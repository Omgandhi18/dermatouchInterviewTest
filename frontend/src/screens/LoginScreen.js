// src/screens/LoginScreen.js
import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  SafeAreaView
} from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  // State for the input fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Get the login function from our context
  const { login } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    try {
      const response = await login(email, password);
      // If the login is successful, the userToken in AuthContext will be set,
      // and the AppNavigator will automatically switch to the MainTabs.
      if (response.message) {
        // If there's a message, it's likely an error from our backend
        Alert.alert('Login Failed', response.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Login Failed', 'An unexpected error occurred.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Welcome Back!</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry // Hides the password
        />

        <Button title="Login" onPress={handleLogin} />

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.linkText}>
            Don't have an account? Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  linkText: {
    marginTop: 20,
    color: 'blue',
    fontSize: 16,
  },
});

export default LoginScreen;