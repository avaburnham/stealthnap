import { Link } from 'expo-router';
import { View, Text, Button } from 'react-native';

export const options = {
  title: 'StealthNap',
};

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 24 }}>
        Welcome to StealthNap!
      </Text>
      <Link href="/gear" asChild>
        <Button title="Go to Gear" />
      </Link>
      <View style={{ height: 12 }} />
      <Link href="/locations" asChild>
        <Button title="Go to Locations" />
      </Link>
    </View>
  );
}
