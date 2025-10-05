// src/screens/RegisterScreen.js
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

// --- CHANGE 1: Component Name ---
const RegisterScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // --- CHANGE 2: Get `register` from context ---
  const { register } = useContext(AuthContext);
  const navigation = useNavigation();

  // --- CHANGE 3: The handler function ---
  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }
    try {
      const response = await register(email, password);
      if (response.message === 'User registered successfully!') {
        Alert.alert(
          'Success',
          'You have registered successfully! Please log in.',
          [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        // Handle errors from backend (e.g., user already exists)
        Alert.alert('Registration Failed', response.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Registration Failed', 'An unexpected error occurred.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        {/* --- CHANGE 4: The Title --- */}
        <Text style={styles.title}>Create an Account</Text>
        
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
          secureTextEntry
        />

        {/* --- CHANGE 5: Button Title and Action --- */}
        <Button title="Register" onPress={handleRegister} />

        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          {/* --- CHANGE 6: The Link Text --- */}
          <Text style={styles.linkText}>
            Already have an account? Log In
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

// --- Styles are the same, no changes needed here ---
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

// --- CHANGE 7: Export the correct component ---
export default RegisterScreen;