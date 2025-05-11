'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { LatLngExpression, Icon } from 'leaflet';
import { Club } from '@/types/club';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  clubs: Club[];
  center: LatLngExpression;
  userLocation?: LatLngExpression;
}

// Кастомные иконки
const userIcon = new Icon({
  src: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  shadowSize: [41, 41],
});

const clubIcon = new Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  shadowSize: [41, 41],
});

export default function Map({ clubs, center, userLocation }: MapProps) {
  return (
    <MapContainer center={center} zoom={12} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {userLocation && (
        <Marker position={userLocation} icon={userIcon}>
          <Popup>Ваш адрес</Popup>
        </Marker>
      )}
      {clubs.map((club) => (
        <Marker key={club.id} position={[club.lat, club.lon]} icon={clubIcon}>
          <Popup>
            <h3>{club.name}</h3>
            <p>{club.address}</p>
            <p>Рейтинг: {club.rating}</p>
            <p>Статус: {club.status === 'active' ? 'Открыт' : 'Закрыт'}</p>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}