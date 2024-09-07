export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function validateCoordinates(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}