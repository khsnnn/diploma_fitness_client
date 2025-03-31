export interface Club {
  id: number;
  name: string;
  address: string;
  rating: number;
  coordinates: { lat: number; lng: number };
  clusters: string[];
  schedule: string;
  status: 'open' | 'closed';
}