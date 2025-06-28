import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSignUp() {
    const res = await fetch('https://your-api-url/api/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (res.ok) {
      Alert.alert('Success', 'Account created!');
      router.replace('/login');
    } else {
      Alert.alert('Sign Up failed', data.error || 'Unknown error');
    }
  }

  return (
    <View style={{ padding: 24 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Sign Up</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={{ borderBottomWidth: 1, marginBottom: 16 }} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={{ borderBottomWidth: 1, marginBottom: 16 }} />
      <Button title="Create Account" onPress={handleSignUp} />
      <Text style={{ marginTop: 16 }}>Already have an account?</Text>
      <Button title="Login" onPress={() => router.push('/login')} />
    </View>
  );
}
