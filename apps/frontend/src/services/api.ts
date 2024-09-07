const API_BASE_URL = 'http://localhost:3001/api';

export const fetchMapData = async () => {
  const response = await fetch(`${API_BASE_URL}/calls/map`);
  return response.json();
};

export const fetchCallList = async () => {
  const response = await fetch(`${API_BASE_URL}/calls/list`);
  return response.json();
};

export const fetchCallDetails = async (id: number) => {
  const response = await fetch(`${API_BASE_URL}/calls/${id}`);
  return response.json();
};