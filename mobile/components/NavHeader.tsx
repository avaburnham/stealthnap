import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function NavHeader() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.replace('/')}>
        <Text style={styles.brand}>StealthNap</Text>
      </Pressable>
      <View style={styles.links}>
        <Pressable onPress={() => router.push('/locations')}>
          <Text style={styles.link}>Locations</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/gear')}>
          <Text style={styles.link}>Gear</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingTop: 45,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f5f4ff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e1e0f7',
  },
  brand: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#6844b9',
  },
  links: {
    flexDirection: 'row',
    gap: 24,
  },
  link: {
    fontSize: 16,
    color: '#6844b9',
    marginLeft: 18,
    fontWeight: 'bold',
  },
});
