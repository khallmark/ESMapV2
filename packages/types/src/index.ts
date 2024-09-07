export interface Call {
  id: number;
  source: string;
  category: string;
  description: string;
  location: string;
  callTime: string;
  closed: string | null;
  lat: number;
  lng: number;
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