import React from 'react';
import { View, Text } from 'react-native';

export default function AboutScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", marginBottom: 16 }}>
        About StealthNap
      </Text>
      <Text style={{ fontSize: 18, textAlign: "center" }}>
        StealthNap is an app for bold, adventurous nappers to discover, share, and review great spots for a stealthy rest.
        {"\n\n"}
        Built with ❤️ using Expo and React Native.
      </Text>
    </View>
  );
}

