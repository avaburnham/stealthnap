// src/pages/Locations.tsx

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// 🔧 Fix missing default marker icons in Leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

type LocationItem = {
  id: number;
  name: string;
  zipCode: string;
  address?: string;
  notes?: string;
  latitude?: number;
  longitude?: number;
  country?: string;
  user?: {
    email: string;
  };
};

export default function Locations() {
  const [locations, setLocations] = useState<LocationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [country, setCountry] = useState('');

  const [mapCenter, setMapCenter] = useState<LatLngExpression>([34.0522, -118.2437]); // default to LA
  const [mapZoom, setMapZoom] = useState(10);

  useEffect(() => {
    fetchLocations();
  }, []);

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords;
          setMapCenter([latitude, longitude]);
          setMapZoom(12);
        },
        error => {
          console.warn('📍 Geolocation error:', error.message);
        }
      );
    } else {
      console.warn('📍 Geolocation not supported');
    }
  }, []);

  const fetchLocations = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/locations');
      const data = await res.json();
      setLocations(data);
    } catch (err) {
      console.error('Failed to fetch locations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    if (!token) {
      alert('You must be logged in to add a location.');
      return;
    }

    const parsedLat = latitude.trim() !== '' ? parseFloat(latitude) : undefined;
    const parsedLng = longitude.trim() !== '' ? parseFloat(longitude) : undefined;

    const newLocation = {
      name,
      zipCode,
      address,
      notes,
      latitude: parsedLat,
      longitude: parsedLng,
      country,
    };

    console.log('Submitting location:', newLocation);

    try {
      const res = await fetch('http://localhost:4000/api/locations', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newLocation),
      });

      if (res.ok) {
        setName('');
        setZipCode('');
        setAddress('');
        setNotes('');
        setLatitude('');
        setLongitude('');
        setCountry('');
        fetchLocations();
      } else {
        const errorData = await res.json();
        alert(`Failed to add location: ${errorData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error('Error adding location:', err);
      alert('An error occurred while adding location.');
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Camping Locations</h2>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Add Form */}
          <h4 className="mb-3">Add a New Location</h4>
          <form onSubmit={handleSubmit} className="mb-5">
            <div className="mb-2">
              <input className="form-control" placeholder="Name" value={name} onChange={e => setName(e.target.value)} required />
            </div>
            <div className="mb-2">
              <input className="form-control" placeholder="Zip Code" value={zipCode} onChange={e => setZipCode(e.target.value)} required />
            </div>
            <div className="mb-2">
              <input className="form-control" placeholder="Country (optional, e.g. US)" value={country} onChange={e => setCountry(e.target.value)} />
            </div>
            <div className="mb-2">
              <input className="form-control" placeholder="Address (optional)" value={address} onChange={e => setAddress(e.target.value)} />
            </div>
            <div className="mb-2">
              <textarea className="form-control" placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} />
            </div>
            <div className="mb-2">
              <input className="form-control" placeholder="Latitude (optional)" value={latitude} onChange={e => setLatitude(e.target.value)} />
            </div>
            <div className="mb-3">
              <input className="form-control" placeholder="Longitude (optional)" value={longitude} onChange={e => setLongitude(e.target.value)} />
            </div>
            <button className="btn btn-primary" type="submit">Add Location</button>
          </form>

          {/* Textual List */}
          <ul className="list-group mb-4">
            {locations.map(loc => (
              <li className="list-group-item" key={loc.id}>
                <strong>{loc.name}</strong>{' '}
                <span className="badge bg-secondary">{loc.zipCode}</span>
                <br />
                {loc.country && <span className="text-muted">Country: {loc.country}<br /></span>}
                {loc.address && <span>{loc.address}<br /></span>}
                {loc.notes && <span className="text-muted">{loc.notes}<br /></span>}
                {loc.user?.email && <span className="text-muted">Added by {loc.user.email}</span>}
              </li>
            ))}
          </ul>

          {/* Map */}
          <div style={{ height: '400px', width: '100%', marginBottom: '2rem' }}>
            <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; OpenStreetMap contributors'
              />

              {/* Debug: Log each marker */}
              {(() => {
                console.log("Rendering markers for:");
                locations
                  .filter(loc => loc.latitude != null && loc.longitude != null)
                  .forEach(loc => console.log(loc.name, loc.latitude, loc.longitude));
                return null;
              })()}

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
                      {loc.notes}<br />
                      {loc.country && <span>Country: {loc.country}<br /></span>}
                      {loc.user?.email && <span className="text-muted">Added by {loc.user.email}</span>}
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
