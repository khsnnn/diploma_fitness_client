export interface Coordinates {
    lat: number;
    lng: number;
  }
  
  const GEOLOCATION_KEY = 'userLocation';
  
  export function getStoredLocation(): Coordinates | null {
    const stored = localStorage.getItem(GEOLOCATION_KEY);
    return stored ? JSON.parse(stored) : null;
  }
  
  export function setStoredLocation(coords: Coordinates) {
    localStorage.setItem(GEOLOCATION_KEY, JSON.stringify(coords));
  }
  
  // Получение координат через геолокацию
  export function getUserLocation(): Promise<Coordinates> {
    return new Promise((resolve) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
            setStoredLocation(coords);
            resolve(coords);
          },
          () => {
            const defaultCoords = { lat: 57.15, lng: 65.55 }; // Тюмень по умолчанию
            setStoredLocation(defaultCoords);
            resolve(defaultCoords);
          }
        );
      } else {
        const defaultCoords = { lat: 57.15, lng: 65.55 };
        setStoredLocation(defaultCoords);
        resolve(defaultCoords);
      }
    });
  }
  
  // Преобразование адреса в координаты через Nominatim
  export async function getCoordinatesFromAddress(address: string): Promise<Coordinates> {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&limit=1`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'SportClubsTumen/1.0 (your-email@example.com)', // Nominatim требует User-Agent
      },
    });
    if (!response.ok) {
      throw new Error('Ошибка при геокодировании адреса');
    }
    const data = await response.json();
    if (data.length === 0) {
      throw new Error('Адрес не найден');
    }
    const coords = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    setStoredLocation(coords);
    console.log(coords);
    return coords;
  }