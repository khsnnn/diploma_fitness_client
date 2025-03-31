'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Club } from '@/types/club';

interface MapProps {
  clubs: Club[];
  center?: LatLngExpression;
}

export default function Map({ clubs, center = [57.15, 65.55] }: MapProps) {
  return (
    <MapContainer center={center} zoom={12} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {clubs.map((club) => (
        <Marker key={club.id} position={[club.coordinates.lat, club.coordinates.lng]}>
          <Popup>
            <h3>{club.name}</h3>
            <p>{club.address}</p>
            <p>Рейтинг: {club.rating}</p>
            <p>Статус: {club.status === 'open' ? 'Открыт' : 'Закрыт'}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}