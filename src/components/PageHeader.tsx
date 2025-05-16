import React from 'react';
import styled from 'styled-components';

interface PageHeaderProps {
  title?: string;
}

const HeaderContainer = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.space.lg} 0; // Отступ сверху и снизу для самого заголовка
  // Убираем position:fixed и padding-left/right, т.к. он будет внутри Main
  // background-color: #000000; // Фон теперь будет от Main
  // z-index: 100;
  display: flex;
  align-items: center;
  // height: 60px; // Высота будет по контенту или можно оставить, если нужен отступ
  margin-bottom: ${({ theme }) => theme.space.md}; // Отступ от заголовка до остального контента страницы
`;

const TitleText = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.heading};
  margin: 0;

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