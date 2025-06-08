import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

type Location = {
  id: number;
  name: string;
  address?: string;
  notes?: string;
};

export default function LocationsScreen() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // IMPORTANT: Use your LAN IP instead of localhost for physical devices!
        const response = await fetch('http://localhost:4000/api/locations');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setLocations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchLocations();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ marginTop: 48 }} />;
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  }

  if (locations.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No locations found.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={locations}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.name}>{item.name}</Text>
            {item.address && <Text style={styles.address}>{item.address}</Text>}
            {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { padding: 14, marginBottom: 14, backgroundColor: '#f6f5fa', borderRadius: 8 },
  name: { fontWeight: 'bold', fontSize: 18 },
  address: { color: '#555', marginTop: 4 },
  notes: { color: '#888', marginTop: 2, fontStyle: 'italic' },
});
