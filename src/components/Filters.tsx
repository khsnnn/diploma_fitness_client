'use client';

import { useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import type { Filters } from '@/types/filters';
import { allClusters } from '@/types/filters';

interface FiltersProps {
  onFilterChange: (filters: Filters) => void;
}

const FiltersContainer = styled.div`
  padding: 20px;
  background-color: #f5f5f5;
  border-radius: 8px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 10px;
  font-weight: bold;
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

export default function Filters({ onFilterChange }: FiltersProps) {
  const [filters, setFilters] = useState<Filters>({
    rating: 3.0,
    distance: 10,
    clusters: [],
  });

  const handleRatingChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newRating = parseFloat(e.target.value);
    const updatedFilters = { ...filters, rating: newRating };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleDistanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newDistance = parseInt(e.target.value, 10);
    const updatedFilters = { ...filters, distance: newDistance };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleClustersChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
    const updatedFilters = { ...filters, clusters: selectedOptions };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <FiltersContainer>
      <Label>
        Минимальный рейтинг: {filters.rating}
        <RangeInput
          type="range"
          min="0"
          max="5"
          step="0.1"
          value={filters.rating}
          onChange={handleRatingChange}
        />
      </Label>

      <Label>
        Максимальное расстояние (км): {filters.distance}
        <RangeInput
          type="range"
          min="0"
          max="10"
          step="1"
          value={filters.distance}
          onChange={handleDistanceChange}
        />
      </Label>

      <Label>
        Категории услуг:
        <Select
          multiple
          value={filters.clusters}
          onChange={handleClustersChange}
        >
          {allClusters.map((cluster) => (
            <option key={cluster} value={cluster}>
              {cluster}
            </option>
          ))}
        </Select>
      </Label>
    </FiltersContainer>
  );
}