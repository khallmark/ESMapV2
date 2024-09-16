import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

interface Call {
  id: number;
  latitude: number;
  longitude: number;
  description: string;
  category: string;
}

interface MapProps {
  calls: Call[];
}

export function Map({ calls }: MapProps) {
  return (
    <MapContainer center={[28.48449, -81.25188]} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {calls.map(call => (
        <Marker key={call.id} position={[call.latitude, call.longitude]}>
          <Popup>
            {call.description} <br /> <a href={`/call?id=${call.id}`}>Details</a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}