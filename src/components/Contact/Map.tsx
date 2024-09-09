import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './contact.css';

const CenterMap = () => {
  const map = useMap();
  
  useEffect(() => {
    setTimeout(() => {
      map.invalidateSize(); // This ensures the map resizes correctly
    }, 0);
  }, [map]);

  return null;
};

const Map: React.FC = () => {
  const position: [number, number] = [41.10476939105021, 29.0247126404938]; 
  return (
    <div className="map-container">
      <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '500px', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />
        <Marker position={position}>
          <Popup>
            Our office is located here!
          </Popup>
        </Marker>
        <CenterMap /> {/* Component to fix map centering */}
      </MapContainer>
    </div>
  );
};

export default Map;
