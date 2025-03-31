export interface Filters {
    rating: number;         // Минимум рейтинга (0–5)
    distance: number;       // Максимальное расстояние в км (0–10)
    clusters: string[];     // Выбранные кластеры (было categories)
  }
  
  export const allClusters = [
    'Фитнес и тренировки',
    'Танцы',
    'Йога и релакс',
    'Единоборства',
    'Аэробика и кардио',
    'Плавание и вода',
    'Игровой спорт',
    'Нишевые виды спорта',
    'Детский спорт',
    'Женский фитнес',
    'Здоровье и восстановление',
    'СПА',
    'Стретчинг и прочее',
  ] as const;