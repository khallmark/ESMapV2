import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchCallList } from '../services/api';

interface Call {
  id: number;
  source: string;
  description: string;
  location: string;
  callTime: string;
  closed: string;
}

const ListPage: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);

  useEffect(() => {
    const loadCallList = async () => {
      const data = await fetchCallList();
      setCalls(data.calls);
    };

    loadCallList();
    const interval = setInterval(loadCallList, 60000); // Refresh every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">Call List</h2>
      <table className="w-full">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2">Source</th>
            <th className="p-2">Description</th>
            <th className="p-2">Location</th>
            <th className="p-2">Call Time</th>
            <th className="p-2">Closed</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((call) => (
            <tr key={call.id} className="border-b">
              <td className="p-2">{call.source}</td>
              <td className="p-2">
                <Link to={`/call/${call.id}`} className="text-blue-600 hover:underline">
                  {call.description}
                </Link>
              </td>
              <td className="p-2">{call.location}</td>
              <td className="p-2">{call.callTime}</td>
              <td className="p-2">{call.closed}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ListPage;