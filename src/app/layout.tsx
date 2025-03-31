import { ReactNode } from 'react';
import 'leaflet/dist/leaflet.css';
import QueryProvider from '@/components/QueryProvider';

export const metadata = {
  title: 'Поиск спортивных клубов в Тюмени',
  description: 'Найдите спортивные клубы в Тюмени с картой и фильтрами',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <QueryProvider>
          <header>Навигация</header>
          <main>{children}</main>
          <footer>© 2025</footer>
        </QueryProvider>
      </body>
    </html>
  );
}