'use client';

import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'next/navigation';
import styled from 'styled-components';
import { Club } from '@/types/club';
import { WebSocketClient } from '@/lib/websocket';

async function fetchClub(id: string): Promise<Club> {
  const response = await fetch(`http://localhost:8080/api/clubs/${id}`);
  if (!response.ok) {
    throw new Error('Ошибка при загрузке клуба');
  }
  return response.json();
}

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

export default function ClubPage() {
  const params = useParams();
  const id = params.id as string;
  const queryClient = useQueryClient();

  const { data: club, isLoading, error } = useQuery<Club>({
    queryKey: ['club', id],
    queryFn: () => fetchClub(id),
  });

  useEffect(() => {
    const wsClient = new WebSocketClient('ws://localhost:8080/ws');
    wsClient.connect((data) => {
      if (data.clubId === parseInt(id)) {
        queryClient.setQueryData<Club>(['club', id], (oldClub) =>
          oldClub ? { ...oldClub, status: data.status } : oldClub
        );
      }
    });
    return () => wsClient.disconnect();
  }, [queryClient, id]);

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {(error as Error).message}</div>;
  if (!club) return <div>Клуб не найден</div>;

  return (
    <ClubContainer>
      <ClubTitle>{club.name}</ClubTitle>
      <ClubDetail>Адрес: {club.address}</ClubDetail>
      <ClubDetail>Рейтинг: {club.rating}</ClubDetail>
      <ClubDetail>Статус: {club.status === 'open' ? 'Открыт' : 'Закрыт'}</ClubDetail>
      <ClubDetail>Расписание: {club.schedule}</ClubDetail>
      <ClubDetail>Категории: {club.clusters.join(', ')}</ClubDetail>
    </ClubContainer>
  );
}