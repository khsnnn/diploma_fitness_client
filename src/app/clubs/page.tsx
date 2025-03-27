import Map from '@/components/Map';
import { Club } from '@/types/club';

// Пример данных (позже заменим на API)
const mockClubs: Club[] = [
  {
    id: 1,
    name: 'Фитнес-клуб "Сила"',
    address: 'ул. Ленина, 10',
    rating: 4.5,
    coordinates: { lat: 57.15, lng: 65.55 },
    categories: ['фитнес'],
    schedule: 'Пн-Пт 8:00-22:00',
    status: 'open',
  },
  {
    id: 2,
    name: 'Йога-центр "Гармония"',
    address: 'ул. Мира, 5',
    rating: 4.0,
    coordinates: { lat: 57.14, lng: 65.56 },
    categories: ['йога'],
    schedule: 'Пн-Вс 9:00-21:00',
    status: 'closed',
  },
];

export default function ClubsPage() {
  return (
    <div>
      <h1>Список клубов</h1>
      <Map clubs={mockClubs} />
    </div>
  );
}