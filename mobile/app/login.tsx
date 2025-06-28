import React, { useState } from 'react';
import { View, Text, TextInput, Button, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:4000/api';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  async function handleSubmit() {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const endpoint = isRegistering ? `${API_URL}/signup` : `${API_URL}/login`;
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      let data: any = {};
      try {
        data = await res.json();
      } catch {
        setError('Unexpected server response.');
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      if (isRegistering) {
        setIsRegistering(false);
        setPassword('');
        setSuccess('Account created! Please log in.');
      } else {
        // Save token securely
        // You can use AsyncStorage, SecureStore, or context
        // For demo:
        Alert.alert('Success', 'Logged in!');
        // TODO: Save JWT and redirect to home
        router.replace('/'); // Go to home page
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 24 }}>
        {isRegistering ? 'Sign Up' : 'Login'}
      </Text>
      <TextInput
        placeholder="Email"
        value={email}
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        editable={!loading}
        style={{
          width: 260,
          borderBottomWidth: 1,
          marginBottom: 18,
          padding: 8,
          fontSize: 18,
        }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        editable={!loading}
        style={{
          width: 260,
          borderBottomWidth: 1,
          marginBottom: 18,
          padding: 8,
          fontSize: 18,
        }}
      />
      <Button
        title={loading ? (isRegistering ? 'Creating Account...' : 'Logging in...') : (isRegistering ? 'Create Account' : 'Login')}
        onPress={handleSubmit}
        disabled={loading}
      />
      {loading && <ActivityIndicator size="small" style={{ marginTop: 16 }} />}
      {success ? <Text style={{ color: 'green', marginTop: 16 }}>{success}</Text> : null}
      {error ? <Text style={{ color: 'red', marginTop: 16 }}>{error}</Text> : null}
      <TouchableOpacity
        onPress={() => {
          setIsRegistering(!isRegistering);
          setError('');
          setSuccess('');
        }}
        disabled={loading}
        style={{ marginTop: 24 }}
      >
        <Text style={{ color: '#007bff', fontSize: 16 }}>
          {isRegistering
            ? 'Already have an account? Login'
            : 'Create Account'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
