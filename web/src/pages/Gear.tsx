// src/pages/Gear.tsx

import React, { useEffect, useState } from 'react';

// Rename the type to GearItem
type GearItem = {
  id: number;
  name: string;
  category: string;
  description?: string;
};

export default function Gear() {
  const [gear, setGear] = useState<GearItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/gear')
      .then(res => res.json())
      .then(data => {
        setGear(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container">
      <h2 className="mb-4">Recommended Camping Gear</h2>
      {loading ? (
        <div>Loading...</div>
      ) : gear.length === 0 ? (
        <div>No gear items found.</div>
      ) : (
        <ul className="list-group">
          {gear.map(item => (
            <li className="list-group-item" key={item.id}>
              <strong>{item.name}</strong> <span className="badge bg-secondary">{item.category}</span>
              <br />
              <span className="text-muted">{item.description}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
