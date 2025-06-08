import { Link } from 'expo-router';
import { View, Text, Button } from 'react-native';

export default function GearScreen() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>
        Camping Gear page coming soon!
      </Text>
      <Link href="/" asChild>
        <Button title="Back to Home" />
      </Link>
    </View>
  );
}
