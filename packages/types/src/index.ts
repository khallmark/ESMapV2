export interface Call {
  id: number;
  source: string;
  cid: string;
  category: string;
  location: string;
  description: string;
  callTime: string;
  closedTime: string | null;
}

export interface GeocodedCall extends Call {
  latitude: number;
  longitude: number;
}

export interface MapCall {
  id: number;
  lat: number;
  lng: number;
  tooltip: string;
  category: string;
}

export interface Source {
  id: number;
  tag: string;
  url: string;
  parser: string;
  updateTime: string;
}

export interface User {
  id: number;
  email: string;
  name?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Add more shared types as needed