import React from 'react';
import styled from 'styled-components';

interface PageHeaderProps {
  title?: string;
}

const HeaderContainer = styled.div`
  width: 100%;
  // padding: ${({ theme }) => theme.space.lg} 0; // Убираем верхний и нижний padding отсюда
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.lg}; // Оставляем отступ снизу до контента
  // Можно задать минимальную высоту, если нужно, чтобы заголовок не был слишком маленьким
  // min-height: 40px; 
`;

const TitleText = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.heading};
  margin: 0; // Убираем стандартные отступы h1

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  if (!title) {
    return null;
  }

  return (
    <HeaderContainer>
      <TitleText>{title}</TitleText>
    </HeaderContainer>
  );
}; 