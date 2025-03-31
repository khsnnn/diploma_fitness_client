'use client';

import { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Map from '@/components/Map';
import Filters from '@/components/Filters';
import ClubList from '@/components/ClubList';
import { Club } from '@/types/club';
import { Filters as FilterType } from '@/types/filters';
import { fetchClubs } from '@/lib/api';
import { haversineDistance } from '@/lib/utils';
import { WebSocketClient } from '@/lib/websocket';
import { getStoredLocation, Coordinates } from '@/lib/geolocation';

const initialClubs: Club[] = [
  {
    id: 1,
    name: 'Фитнес-клуб "Сила"',
    address: 'ул. Ленина, 10',
    rating: 4.5,
    coordinates: { lat: 57.15, lng: 65.55 },
    clusters: ['Фитнес и тренировки', 'Силовые тренировки'],
    schedule: 'Пн-Пт 8:00-22:00',
    status: 'open',
  },
  {
    id: 2,
    name: 'Йога-центр "Гармония"',
    address: 'ул. Мира, 5',
    rating: 4.0,
    coordinates: { lat: 57.14, lng: 65.56 },
    clusters: ['Йога и релакс'],
    schedule: 'Пн-Вс 9:00-21:00',
    status: 'closed',
  },
  {
    id: 3,
    name: 'Бассейн "Волна"',
    address: 'ул. Пушкина, 15',
    rating: 2.5,
    coordinates: { lat: 57.16, lng: 65.54 },
    clusters: ['Плавание и вода'],
    schedule: 'Пн-Вс 7:00-20:00',
    status: 'open',
  },
];


export default function ClubsPage() {
  const [filters, setFilters] = useState<FilterType>({ rating: 3.0, distance: 10, clusters: [] });
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const stored = getStoredLocation();
    if (stored) {
      setUserLocation(stored);
    } else {
      setUserLocation({ lat: 57.15, lng: 65.55 }); // Тюмень по умолчанию
    }
  }, []);

  useEffect(() => {
    const wsClient = new WebSocketClient('ws://localhost:8080/ws');
    wsClient.connect((data) => {
      queryClient.setQueryData<Club[]>(['clubs', filters], (oldClubs) =>
        oldClubs?.map((club) =>
          club.id === data.clubId ? { ...club, status: data.status } : club
        )
      );
    });
    return () => wsClient.disconnect();
  }, [queryClient, filters]);

  const { data: clubs, isLoading, error } = useQuery<Club[]>({
    queryKey: ['clubs', filters],
    queryFn: () => fetchClubs(filters),
  });

  const filteredClubs = clubs?.filter((club) => {
    if (!userLocation) return true;
    const distance = haversineDistance(
      userLocation.lat,
      userLocation.lng,
      club.coordinates.lat,
      club.coordinates.lng
    );
    return distance <= filters.distance;
  });

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
  };

  if (isLoading || !userLocation) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {(error as Error).message}</div>;

  return (
    <div>
      <h1>Список клубов</h1>
      <Filters onFilterChange={handleFilterChange} />
      <Map clubs={filteredClubs || []} center={[userLocation.lat, userLocation.lng]} />
      <ClubList clubs={filteredClubs || []} />
    </div>
  );
}