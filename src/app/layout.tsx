import { ReactNode } from 'react';
import '../styles/global.css'; // Если используешь глобальные стили
import 'leaflet/dist/leaflet.css';

export const metadata = {
  title: 'Поиск спортивных клубов в Тюмени',
  description: 'Найдите спортивные клубы в Тюмени с картой и фильтрами',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <header>Навигация</header>
        <main>{children}</main>
        <footer>© 2025</footer>
      </body>
    </html>
  );
}