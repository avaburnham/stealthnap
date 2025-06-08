import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "StealthNap" }} />
      <Stack.Screen name="gear" options={{ title: "Gear" }} />
      <Stack.Screen name="locations" options={{ title: "Locations" }} />
    </Stack>
  );
}
