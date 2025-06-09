import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

type Location = {
  id: number;
  name: string;
  address?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
};

export default function LocationsScreen() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        // Swap "localhost" for your computer's LAN IP if using a real device
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

  if (loading) return <ActivityIndicator style={{ marginTop: 48 }} />;
  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Error: {error}</Text>
      </View>
    );
  if (locations.length === 0)
    return (
      <View style={styles.center}>
        <Text>No locations found.</Text>
      </View>
    );

  // Pick a reasonable default center
  const initialRegion = {
    latitude: locations[0]?.latitude || 37.0902,
    longitude: locations[0]?.longitude || -95.7129,
    latitudeDelta: 20,
    longitudeDelta: 20,
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Map */}
      <MapView
        style={styles.map}
        initialRegion={initialRegion}
      >
        {locations
          .filter(loc => loc.latitude && loc.longitude)
          .map(loc => (
            <Marker
              key={loc.id}
              coordinate={{
                latitude: loc.latitude!,
                longitude: loc.longitude!,
              }}
              title={loc.name}
              description={loc.notes || loc.address}
            />
          ))}
      </MapView>
      {/* List */}
      <FlatList
        style={{ flex: 1 }}
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
  map: {
    width: Dimensions.get('window').width,
    height: 250,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { padding: 14, marginBottom: 14, backgroundColor: '#f6f5fa', borderRadius: 8 },
  name: { fontWeight: 'bold', fontSize: 18 },
  address: { color: '#555', marginTop: 4 },
  notes: { color: '#888', marginTop: 2, fontStyle: 'italic' },
});
