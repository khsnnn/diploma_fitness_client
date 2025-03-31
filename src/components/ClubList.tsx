'use client';

import styled from 'styled-components';
import { Club } from '@/types/club';
import Link from 'next/link';

interface ClubListProps {
  clubs: Club[];
}

const ListContainer = styled.div`
  margin-top: 20px;
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
`;

const ClubItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;
  &:last-child {
    border-bottom: none;
  }
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ClubName = styled.h3`
  margin: 0;
  font-size: 1.2em;
`;

const ClubInfo = styled.div`
  display: flex;
  gap: 10px;
`;

export default function ClubList({ clubs }: ClubListProps) {
  return (
    <ListContainer>
      {clubs.map((club) => (
        <ClubItem key={club.id}>
          <ClubName>
            <Link href={`/clubs/${club.id}`}>{club.name}</Link>
          </ClubName>
          <ClubInfo>
            <span>Рейтинг: {club.rating}</span>
            <span>{club.status === 'open' ? 'Открыт' : 'Закрыт'}</span>
          </ClubInfo>
        </ClubItem>
      ))}
    </ListContainer>
  );
}