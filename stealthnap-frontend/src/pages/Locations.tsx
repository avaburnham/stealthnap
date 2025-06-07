import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

type LocationItem = {
  id: number;
  name: string;
  zipCode: string;
  address?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
};

const DEFAULT_CENTER: LatLngExpression = [34.0522, -118.2437]; // Los Angeles for example

export default function Locations() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:4000/api/locations')
      .then(res => res.json())
      .then(data => {
        setLocations(data);
        setLoading(false);
      });
  }, []);

  console.log(locations); // For debugging: See your locations in browser console

  return (
    <div className="container">
      <h2 className="mb-4">Camping Locations</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Textual List */}
          <ul className="list-group mb-4">
            {locations.map(loc => (
              <li className="list-group-item" key={loc.id}>
                <strong>{loc.name}</strong> <span className="badge bg-secondary">{loc.zipCode}</span>
                <br />
                {loc.address && <span>{loc.address}<br /></span>}
                <span className="text-muted">{loc.notes}</span>
              </li>
            ))}
          </ul>
          {/* Map */}
          <div style={{ height: '400px', width: '100%', marginBottom: '2rem' }}>
            <MapContainer center={DEFAULT_CENTER} zoom={10} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />
              {locations
                .filter(loc => loc.latitude != null && loc.longitude != null)
                .map(loc => (
                  <Marker
                    key={loc.id}
                    position={[Number(loc.latitude), Number(loc.longitude)]}
                  >
                    <Popup>
                      <strong>{loc.name}</strong><br />
                      {loc.address && <span>{loc.address}<br /></span>}
                      {loc.notes}
                    </Popup>
                  </Marker>
                ))}
            </MapContainer>
          </div>
        </>
      )}
    </div>
  );
}
