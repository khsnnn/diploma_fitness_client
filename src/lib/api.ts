import { Club } from '@/types/club';
import { Filters } from '@/types/filters';

export async function fetchClubs(filters?: Filters): Promise<Club[]> {
  const url = new URL('http://localhost:8080/api/clubs'); // Замени на реальный URL

  if (filters) {
    if (filters.rating > 0) {
      url.searchParams.append('rating', filters.rating.toString());
    }
    if (filters.distance < 1000) {
      url.searchParams.append('distance', filters.distance.toString());
    }
    if (filters.clusters.length > 0) {
      url.searchParams.append('clusters', filters.clusters.join(','));
    }
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error('Ошибка при загрузке клубов');
  }
  return response.json();
}