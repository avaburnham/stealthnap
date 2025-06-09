import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';

export default function GearScreen() {
  const [gear, setGear] = useState([]);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch gear list
  const fetchGear = async () => {
    const res = await fetch('http://localhost:4000/api/gear');
    const data = await res.json();
    setGear(data);
  };

  useEffect(() => {
    fetchGear();
  }, []);

  // Add gear handler
  const handleAddGear = async () => {
    if (!name.trim() || !category.trim()) return;
    setSubmitting(true);
    try {
      await fetch('http://localhost:4000/api/gear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, description }),
      });
      setName('');
      setCategory('');
      setDescription('');
      fetchGear();
    } catch (e) {
      alert('Failed to add gear');
    }
    setSubmitting(false);
  };

  return (
    <View style={{ padding: 16 }}>
      {/* Add Gear Inputs */}
      <View style={{ marginBottom: 16 }}>
        <View style={{ flexDirection: 'row', marginBottom: 8 }}>
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              borderRadius: 6,
              marginRight: 8,
            }}
            placeholder="Gear name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: '#ccc',
              padding: 8,
              borderRadius: 6,
            }}
            placeholder="Category"
            value={category}
            onChangeText={setCategory}
          />
        </View>
        <TextInput
          style={{
            borderWidth: 1,
            borderColor: '#ccc',
            padding: 8,
            borderRadius: 6,
            marginBottom: 8,
          }}
          placeholder="Description (optional)"
          value={description}
          onChangeText={setDescription}
        />
        <Button
          title={submitting ? 'Adding...' : 'Add'}
          onPress={handleAddGear}
          disabled={submitting || !name.trim() || !category.trim()}
        />
      </View>
      {/* Gear List */}
      <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Gear List:</Text>
      <FlatList
        data={gear}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.name} ({item.category})</Text>
        )}
      />
    </View>
  );
}
