import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchCallDetails } from '../services/api';

interface CallDetails {
  id: number;
  source: string;
  category: string;
  description: string;
  location: string;
  callTime: string;
  closed: string;
  lat: number;
  lng: number;
}

const CallDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [callDetails, setCallDetails] = useState<CallDetails | null>(null);

  useEffect(() => {
    const loadCallDetails = async () => {
      if (id) {
        const data = await fetchCallDetails(parseInt(id));
        setCallDetails(data);
      }
    };

    loadCallDetails();
  }, [id]);

  if (!callDetails) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Call Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="font-bold p-2">Source</td>
                <td className="p-2">{callDetails.source}</td>
              </tr>
              <tr className="border-b">
                <td className="font-bold p-2">Category</td>
                <td className="p-2">{callDetails.category}</td>
              </tr>
              <tr className="border-b">
                <td className="font-bold p-2">Description</td>
                <td className="p-2">{callDetails.description}</td>
              </tr>
              <tr className="border-b">
                <td className="font-bold p-2">Location</td>
                <td className="p-2">{callDetails.location}</td>
              </tr>
              <tr className="border-b">
                <td className="font-bold p-2">Call Time</td>
                <td className="p-2">{callDetails.callTime}</td>
              </tr>
              <tr className="border-b">
                <td className="font-bold p-2">Closed</td>
                <td className="p-2">{callDetails.closed}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="h-64 md:h-auto">
          <MapContainer center={[callDetails.lat, callDetails.lng]} zoom={15} className="h-full">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker
              position={[callDetails.lat, callDetails.lng]}
              icon={L.icon({
                iconUrl: `/icons/${callDetails.category}.png`,
                iconSize: [25, 41],
                iconAnchor: [12, 41],
              })}
            />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default CallDetailsPage;