import { Club } from '@/types/club';
import { Filters } from '@/types/filters';

export async function fetchClubs(filters: Filters): Promise<Club[]> {
  const url = new URL('http://localhost:8080/clubs');

  if (filters.lat !== undefined) {
    url.searchParams.append('lat', filters.lat.toString());
  }
  if (filters.lon !== undefined) {
    url.searchParams.append('lon', filters.lon.toString());
  }
  if (filters.distance < 1000) {
    url.searchParams.append('distance', filters.distance.toString());
  }
  if (filters.min_rating !== undefined && filters.min_rating > 0) {
    url.searchParams.append('min_rating', filters.min_rating.toString());
  }
  if (filters.categories && filters.categories.length > 0) {
    url.searchParams.append('categories', filters.categories.join(','));
  }
  if (filters.subcategories && filters.subcategories.length > 0) {
    url.searchParams.append('subcategories', filters.subcategories.join(','));
  }
  if (filters.type) {
    url.searchParams.append('type', filters.type);
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Ошибка при загрузке клубов');
  }
  return response.json();
}

export async function fetchClub(id: string): Promise<Club> {
  const response = await fetch(`http://localhost:8080/clubs/${id}`);
  if (!response.ok) {
    throw new Error('Ошибка при загрузке клуба');
  }
  return response.json();
}