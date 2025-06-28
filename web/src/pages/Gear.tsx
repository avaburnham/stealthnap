// src/pages/Gear.tsx

import React, { useEffect, useState } from 'react';

type GearItem = {
  id: number;
  name: string;
  category: string;
  description?: string;
};

export default function Gear() {
  const [gear, setGear] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchGear();
  }, []);

  const fetchGear = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/gear');
      const data = await res.json();
      setGear(data);
    } catch (err) {
      console.error('Failed to fetch gear:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !category.trim()) {
      alert('Name and category are required.');
      return;
    }

    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to add gear.');
      return;
    }

    try {
      const res = await fetch('http://localhost:4000/api/gear', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, category, description }),
      });

      if (res.ok) {
        setName('');
        setCategory('');
        setDescription('');
        fetchGear(); // refresh list
      } else {
        const errorData = await res.json();
        alert(`Failed to add gear: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error submitting gear:', err);
      alert('An error occurred while adding gear.');
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Recommended Camping Gear</h2>

      {loading ? (
        <div>Loading...</div>
      ) : gear.length === 0 ? (
        <div>No gear items found.</div>
      ) : (
        <ul className="list-group mb-4">
          {gear.map(item => (
            <li className="list-group-item" key={item.id}>
              <strong>{item.name}</strong>{' '}
              <span className="badge bg-secondary">{item.category}</span>
              <br />
              <span className="text-muted">{item.description}</span>
            </li>
          ))}
        </ul>
      )}

      <h3 className="mb-3">Add New Gear</h3>
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <input
            className="form-control"
            placeholder="Category"
            value={category}
            onChange={e => setCategory(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Gear
        </button>
      </form>
    </div>
  );
}
