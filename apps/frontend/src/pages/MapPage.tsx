import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchMapData } from '../services/api';

interface MapCall {
  id: number;
  lat: number;
  lng: number;
  tooltip: string;
  category: string;
}

const MapPage: React.FC = () => {
  const [mapCalls, setMapCalls] = useState<MapCall[]>([]);

  useEffect(() => {
    const loadMapData = async () => {
      const data = await fetchMapData();
      setMapCalls(data.calls);
    };

    loadMapData();
    const interval = setInterval(loadMapData, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-screen">
      <MapContainer center={[28.48449, -81.25188]} zoom={12} className="h-full">
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {mapCalls.map((call) => (
          <Marker
            key={call.id}
            position={[call.lat, call.lng]}
            icon={L.icon({
              iconUrl: `/icons/${call.category}.png`,
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
            })}
          >
            <Popup>{call.tooltip}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default MapPage;