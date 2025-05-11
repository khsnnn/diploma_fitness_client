'use client';

import { useQuery } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import styled from 'styled-components';
import { Club } from '@/types/club';
import { fetchClub } from '@/lib/api';

const ClubContainer = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: 20px auto;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ClubTitle = styled.h1`
  margin: 0 0 20px;
  font-size: 2em;
`;

const ClubDetail = styled.p`
  margin: 10px 0;
  font-size: 1.1em;
`;

const ScheduleList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ScheduleItem = styled.li`
  margin: 5px 0;
`;

export default function ClubPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: club, isLoading, error } = useQuery<Club>({
    queryKey: ['club', id],
    queryFn: () => fetchClub(id),
  });

  console.log('Club data:', club); // Отладка

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {(error as Error).message}</div>;
  if (!club) return <div>Клуб не найден</div>;

  return (
    <ClubContainer>
      <ClubTitle>{club.name}</ClubTitle>
      <ClubDetail>Адрес: {club.address}</ClubDetail>
      <ClubDetail>Описание: {club.description}</ClubDetail>
      <ClubDetail>Часы работы: {club.working_hours}</ClubDetail>
      <ClubDetail>Рейтинг: {club.rating}</ClubDetail>
      <ClubDetail>Статус: {club.status === 'active' ? 'Открыт' : 'Закрыт'}</ClubDetail>
      <ClubDetail>
        Категории: {(club.categories || []).map((cat) => cat.name).join(', ') || 'Нет категорий'}
      </ClubDetail>
      <ClubDetail>
        Расписание:
        <ScheduleList>
          {(club.schedules || []).map((schedule) => (
            <ScheduleItem key={schedule.id}>
              {schedule.day}: {schedule.time} - {schedule.activity} ({schedule.instructor})
            </ScheduleItem>
          )) || 'Нет расписания'}
        </ScheduleList>
      </ClubDetail>
    </ClubContainer>
  );
}