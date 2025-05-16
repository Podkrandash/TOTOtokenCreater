import React from 'react';
import styled from 'styled-components';

interface PageHeaderProps {
  title?: string;
}

const HeaderContainer = styled.div`
  width: 100%;
  padding: ${({ theme }) => theme.space.lg} 0; // Отступы сверху и снизу
  padding-left: ${({ theme }) => theme.space.lg}; // Отступ слева, чтобы соответствовать Main
  padding-right: ${({ theme }) => theme.space.lg}; // Отступ справа
  position: fixed; // Фиксируем сверху
  top: 0;
  left: 0;
  right: 0;
  background-color: #000000; // Фон как у Container
  z-index: 100; // Выше чем Main, но ниже BottomNavBar, если будут пересечения
  display: flex;
  align-items: center;
  height: 60px; // Зададим фиксированную высоту, например

  @media (max-width: 768px) {
    padding-left: ${({ theme }) => theme.space.md};
    padding-right: ${({ theme }) => theme.space.md};
    height: 50px;
  }
`;

const TitleText = styled.h1`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 600; // Используем стилевое значение для заголовков
  font-family: ${({ theme }) => theme.fonts.heading};
  margin: 0;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

export const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  if (!title) {
    return null; // Не отображаем ничего, если нет заголовка
  }

  return (
    <HeaderContainer>
      <TitleText>{title}</TitleText>
    </HeaderContainer>
  );
}; 