'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import styled from 'styled-components';
import Link from 'next/link';
import Map from '@/components/Map';
import { Club } from '@/types/club';
import { Filters, allCategories } from '@/types/filters';
import { fetchClubs } from '@/lib/api';
import { haversineDistance } from '@/lib/utils';
import { getUserLocation, getStoredLocation, getCoordinatesFromAddress, Coordinates } from '@/lib/geolocation';

const HomeContainer = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightColumn = styled.div``;

const Title = styled.h1`
  font-size: 2.5em;
  margin-bottom: 20px;
  grid-column: 1 / -1;
`;

const LocationSection = styled.div`
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
  border-radius: 4px;
`;

const SectionTitle = styled.h2`
  font-size: 1.8em;
  margin: 10px 0;
`;

const ClubCard = styled.div`
  padding: 15px;
  border: 3px solid #eee;
  border-radius: 8px;
  margin-bottom: 1px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ClubLink = styled(Link)`
  color: #02162e;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export default function Home() {
  const [userLocation, setUserLocation] = useState<Coordinates | null>(null);
  const [address, setAddress] = useState('');
  const [draftFilters, setDraftFilters] = useState<Filters>({ distance: 10, categories: [] });
  const [appliedFilters, setAppliedFilters] = useState<Filters>({ distance: 10, categories: [] });
  const [sortBy, setSortBy] = useState<'distance' | 'rating'>('distance');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    const stored = getStoredLocation();
    if (stored) {
      setUserLocation(stored);
    } else {
      setUserLocation({ lat: 57.15, lng: 65.55 }); // Тюмень по умолчанию
    }
  }, []);

  const { data: clubs, isLoading } = useQuery<Club[]>({
    queryKey: ['clubs', appliedFilters, userLocation],
    queryFn: () => fetchClubs({ ...appliedFilters, lat: userLocation?.lat, lon: userLocation?.lng }),
  });

  const clubsWithDistance = clubs?.map((club) => ({
    ...club,
    distance: userLocation ? haversineDistance(userLocation.lat, userLocation.lng, club.lat, club.lon) : Infinity,
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
      const coords = await getCoordinatesFromAddress("Тюмень, " + address);
      setUserLocation(coords);
    } catch (error) {
      console.error('Ошибка геокодирования:', error);
      setUserLocation({ lat: 57.15, lng: 65.55 });
    }
  };

  const handleGeolocation = () => {
    getUserLocation().then((coords) => setUserLocation(coords));
  };

  if (isLoading || !userLocation) return <div>Загрузка...</div>;

  return (
    <HomeContainer>
      <Title>Поиск спортивных клубов в Тюмени</Title>

      <LeftColumn>
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

        <FiltersContainer open={isFiltersOpen}>
          <FilterSummary onClick={() => setIsFiltersOpen(!isFiltersOpen)}>
            Фильтры
          </FilterSummary>
          <FilterSection>
            <label>
              Минимальный рейтинг: {draftFilters.min_rating || 'Любой'}
              <RangeInput
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={draftFilters.min_rating || 0}
                onChange={(e) => handleFilterChange({ min_rating: parseFloat(e.target.value) })}
              />
            </label>
          </FilterSection>
          <FilterSection>
            <label>
              Максимальное расстояние (км): {draftFilters.distance === 1000 ? 'Любое' : draftFilters.distance}
              <RangeInput
                type="range"
                min="1"
                max="15"
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
                value={draftFilters.categories || []}
                onChange={(e) =>
                  handleFilterChange({
                    categories: Array.from(e.target.selectedOptions, (option) => option.value),
                  })
                }
              >
                {allCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Select>
            </label>
          </FilterSection>
          <ApplyButton onClick={handleApplyFilters}>Применить</ApplyButton>
        </FiltersContainer>

        <SortSelect
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as 'distance' | 'rating')}
        >
          <option value="distance">Сортировать по расстоянию</option>
          <option value="rating">Сортировать по рейтингу</option>
        </SortSelect>

        {/* <SectionTitle>Клубы ({sortedClubs?.length || 0})</SectionTitle> */}
        {sortedClubs?.map((club) => (
          <ClubCard key={club.id}>
            <ClubLink href={`/clubs/${club.id}`}>
              {club.name} ({club.distance === Infinity ? 'Неизвестно' : `${club.distance.toFixed(1)} км`})
            </ClubLink>
            <span>Рейтинг: {club.rating}</span>
          </ClubCard>
        ))}
      </LeftColumn>

      <RightColumn>
        <Map clubs={sortedClubs || []} center={[userLocation.lat, userLocation.lng]} userLocation={userLocation} />
      </RightColumn>
    </HomeContainer>
  );
}