import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-4">Emergency Services Activity - Orange County, FL</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/map" className="hover:text-blue-300">Live Map</Link></li>
            <li><Link to="/list" className="hover:text-blue-300">Call List</Link></li>
            <li><a href="https://davnit.net/emergency-services-activity-map/" className="hover:text-blue-300">About</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;