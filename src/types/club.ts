export interface Club {
  id: number;
  name: string;
  address: string;
  description: string;
  working_hours: string;
  rating: number;
  lat: number;
  lon: number;
  type: string;
  status: string;
  categories: Category[];
  schedules: Schedule[];
}

export interface Category {
  name: string;
  subcategories: string[];
}

export interface Schedule {
  id: number;
  club_id: number;
  day: string;
  time: string;
  activity: string;
  instructor: string;
}