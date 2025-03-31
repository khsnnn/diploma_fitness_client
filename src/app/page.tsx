'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import Link from 'next/link';
import { Club } from '@/types/club';
import { Filters, allClusters } from '@/types/filters';
import { fetchClubs } from '@/lib/api';
import { haversineDistance } from '@/lib/utils';
import { getUserLocation, getStoredLocation, getCoordinatesFromAddress, Coordinates } from '@/lib/geolocation';

const HomeContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 2.5em;
  margin-bottom: 20px;
`;

const LocationSection = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const AddressInput = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const GeoButton = styled.button`
  padding: 8px 16px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #218838;
  }
`;

const FiltersContainer = styled.details`
  margin-bottom: 20px;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
`;

const FilterSummary = styled.summary`
  cursor: pointer;
  font-weight: bold;
`;

const FilterSection = styled.div`
  margin-top: 10px;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border-radius: 4px;
`;

const RangeInput = styled.input`
  width: 100%;
  margin-top: 5px;
`;

const ApplyButton = styled.button`
  margin-top: 15px;
  padding: 10px 20px;
  background-color: #0070f3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #005bb5;
  }
`;

const SortSelect = styled.select`
  padding: 8px;
  margin-bottom: 20px;
  border-radius: 4px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8em;
  margin: 20px 0 10px;
`;

const ClubCard = styled.div`
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ClubLink = styled(Link)`
  color: #0070f3;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ExploreLink = styled(Link)`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #0070f3;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  &:hover {
    background-color: #005bb5;
  }
`;

export default function Home() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState('');
  const [draftFilters, setDraftFilters] = useState<Filters>({ rating: 0, distance: 1000, clusters: [] });
  const [appliedFilters, setAppliedFilters] = useState<Filters>({ rating: 0, distance: 1000, clusters: [] });
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Загружаем сохранённое местоположение при старте
  useEffect(() => {
    const stored = getStoredLocation();
    if (stored) {
      setUserLocation(stored);
    } else {
      setUserLocation({ lat: 57.15, lng: 65.55 }); // Тюмень по умолчанию
    }
  }, []);

  const { data: clubs, isLoading } = useQuery<Club[]>({
    queryKey: ['clubs', appliedFilters],
    queryFn: () => fetchClubs(appliedFilters),
  });

  const clubsWithDistance = clubs?.map((club) => ({
    ...club,
    distance: userLocation
      ? haversineDistance(userLocation.lat, userLocation.lng, club.coordinates.lat, club.coordinates.lng)
      : Infinity,
  }));

  const sortedClubs = clubsWithDistance?.sort((a, b) =>
    sortBy === 'distance' ? a.distance - b.distance : b.rating - a.rating
  );

  const handleFilterChange = (newFilters: Partial<Filters>) => {
    setDraftFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
    setIsFiltersOpen(false);
  };

  const handleAddressSubmit = async () => {
    try {
      const coords = await getCoordinatesFromAddress(address);
      setUserLocation(coords);
      setAddress(''); // Очищаем поле после применения
    } catch (error) {
      console.error('Ошибка геокодирования:', error);
      setUserLocation({ lat: 57.15, lng: 65.55 }); // Тюмень по умолчанию при ошибке
    }
  };

  const handleGeolocation = () => {
    getUserLocation().then((coords) => setUserLocation(coords));
  };

  if (isLoading || !userLocation) return <div>Загрузка...</div>;

  return (
    <HomeContainer>
      <Title>Поиск спортивных клубов в Тюмени</Title>

      {/* Ввод адреса и геолокация */}
      <LocationSection>
        <AddressInput
          type="text"
          placeholder="Введите адрес (например, ул. Ленина, Тюмень)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAddressSubmit()}
        />
        <GeoButton onClick={handleGeolocation}>Использовать геолокацию</GeoButton>
      </LocationSection>

      {/* Фильтры */}
      <FiltersContainer open={isFiltersOpen}>
        <FilterSummary onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
          Фильтры
        </FilterSummary>
        <FilterSection>
          <label>
            Минимальный рейтинг: {draftFilters.rating || 'Любой'}
            <RangeInput
              type="range"
              min="0"
              max="5"
              step="0.1"
              value={draftFilters.rating}
              onChange={(e) => handleFilterChange({ rating: parseFloat(e.target.value) })}
            />
          </label>
        </FilterSection>
        <FilterSection>
          <label>
            Максимальное расстояние (км): {draftFilters.distance === 1000 ? 'Любое' : draftFilters.distance}
            <RangeInput
              type="range"
              min="0"
              max="100"
              step="1"
              value={draftFilters.distance}
              onChange={(e) => handleFilterChange({ distance: parseInt(e.target.value, 10) })}
            />
          </label>
        </FilterSection>
        <FilterSection>
          <label>
            Категории услуг:
            <Select
              multiple
              value={draftFilters.clusters}
              onChange={(e) =>
                handleFilterChange({
                  clusters: Array.from(e.target.selectedOptions, (option) => option.value),
                })
              }
            >
              {allClusters.map((cluster) => (
                <option key={cluster} value={cluster}>
                  {cluster}
                </option>
              ))}
            </Select>
          </label>
        </FilterSection>
        <ApplyButton onClick={handleApplyFilters}>Применить</ApplyButton>
      </FiltersContainer>

      {/* Сортировка */}
      <SortSelect
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating')}
      >
        <option value="distance">Сортировать по расстоянию</option>
        <option value="rating">Сортировать по рейтингу</option>
      </SortSelect>

      {/* Клубы */}
      <SectionTitle>Клубы ({sortedClubs?.length || 0})</SectionTitle>
      {sortedClubs?.map((club) => (
        <ClubCard key={club.id}>
          <ClubLink href={`/clubs/${club.id}`}>
            {club.name} ({club.distance === Infinity ? 'Неизвестно' : `${club.distance.toFixed(1)} км`})
          </ClubLink>
          <span>Рейтинг: {club.rating}</span>
        </ClubCard>
      ))}
      <ExploreLink href="/clubs">Расширенный поиск с картой</ExploreLink>
    </HomeContainer>
  );
}