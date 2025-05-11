export interface Filters {
  lat?: number;
  lon?: number;
  distance: number;
  min_rating?: number;
  categories?: string[];
  subcategories?: string[];
  type?: string;
}

export const allCategories = [
  'Дополнительно в фитнес клубе',
  'Зоны фитнес клуба',
  'Аэробика',
  'Банный комплекс',
  'Тренажёрный зал',
  'Фитнес-программы',
  'Водные виды спорта',
  'Единоборства',
  'Настольные виды спорта',
  'Командные виды спорта',
  'Зимние виды спорта',
  'Специальные группы',
  'Зоны клуба',
] as const;