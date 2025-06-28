import React, { useEffect, useState } from 'react';
import { Link } from 'expo-router';
import { TouchableOpacity, View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const squareSize = 140;

const buttonStyle = {
  width: squareSize,
  height: squareSize,
  backgroundColor: '#4A90E2',
  borderRadius: 16,
  alignItems: 'center',
  justifyContent: 'center',
  margin: 12,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.18,
  shadowRadius: 4,
  elevation: 3,
};

const buttonTextStyle = {
  color: '#fff',
  fontSize: 20,
  fontWeight: 'bold',
  textAlign: 'center',
  letterSpacing: 1,
};

export default function HomeScreen() {
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Auth check
  useEffect(() => {
    let mounted = true;
    async function checkAuth() {
      setLoading(true);
      const jwt = await SecureStore.getItemAsync('token');
      const storedEmail = await SecureStore.getItemAsync('email');
      if (mounted) {
        setToken(jwt && jwt.length > 0 ? jwt : null);
        setEmail(storedEmail && storedEmail.length > 0 ? storedEmail : null);
        setLoading(false);
      }
    }
    checkAuth();
    return () => { mounted = false; };
  }, []);

  async function handleLogout() {
    await SecureStore.deleteItemAsync('token');
    await SecureStore.deleteItemAsync('email');
    setToken(null);
    setEmail(null);
    Alert.alert('Logged out', 'You have been logged out.');
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
      <Text style={{ fontSize: 34, fontWeight: 'bold', marginBottom: 16 }}>
        StealthNap
      </Text>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 32 }}>
        For the Bold and Brave.
      </Text>

      {/* Auth Section */}
      {token ? (
        <>
          {email && (
            <Text style={{ marginBottom: 8, fontSize: 16, color: "#555" }}>
              Welcome, <Text style={{ fontWeight: "bold" }}>{email}</Text>
            </Text>
          )}
          <Button title="Logout" onPress={handleLogout} color="#F44336" />
        </>
      ) : (
        <View style={{ flexDirection: 'row', marginBottom: 24 }}>
          <Link href="/login" asChild>
            <TouchableOpacity style={buttonStyle}>
              <Text style={buttonTextStyle}>Login</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/signup" asChild>
            <TouchableOpacity style={buttonStyle}>
              <Text style={buttonTextStyle}>Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}

      {/* Main app navigation buttons */}
      <View style={{ flexDirection: 'row', marginBottom: 8 }}>
        <Link href="/gear" asChild>
          <TouchableOpacity style={buttonStyle}>
            <Text style={buttonTextStyle}>Gear</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/locations" asChild>
          <TouchableOpacity style={buttonStyle}>
            <Text style={buttonTextStyle}>Locations</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <Link href="/forum" asChild>
          <TouchableOpacity style={buttonStyle}>
            <Text style={buttonTextStyle}>Forum</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/about" asChild>
          <TouchableOpacity style={buttonStyle}>
            <Text style={buttonTextStyle}>About</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
