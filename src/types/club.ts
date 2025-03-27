export interface Club {
  id: number;
  name: string;
  address: string;
  rating: number;         // 0–5
  coordinates: {
    lat: number;          // Широта (57.0–57.3)
    lng: number;          // Долгота (65.0–65.8)
  };
  categories: string[];   // Например, ["фитнес", "йога"]
  schedule: string;       // Например, "Пн-Пт 8:00-22:00"
  status: 'open' | 'closed'; // Статус в реальном времени
}