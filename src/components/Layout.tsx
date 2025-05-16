import styled, { css } from 'styled-components';
import React from 'react';
import { useRouter } from 'next/router';
import { HomeIcon, CreateIcon, TokensIcon, WalletIcon } from './icons'; // Импортируем SVG иконки

// Удаляем старые плейсхолдеры
// const HomeIconPlaceholder = () => <IconSymbol>H</IconSymbol>;
// const CreateIconPlaceholder = () => <IconSymbol>+</IconSymbol>;
// const TokensIconPlaceholder = () => <IconSymbol>T</IconSymbol>;
// const WalletIconPlaceholder = () => <IconSymbol>W</IconSymbol>;

// const IconSymbol = styled.span`...`; // IconSymbol больше не нужен

interface LayoutProps {
  children: React.ReactNode;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 100%;
  min-height: -webkit-fill-available;
  position: relative; 
  background: #000000; // Строго черный фон
  padding: 0 16px; // Отступы по бокам для "вкладки" Main

  @media (max-width: 768px) {
    padding: 0 8px;
  }
`;

const Main = styled.main`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-top-left-radius: ${({ theme }) => theme.radii.xl};
  border-top-right-radius: ${({ theme }) => theme.radii.xl};
  margin-top: 110px; // Возвращаем 110px
  padding: ${({ theme }) => theme.space.lg}; // Внутренние отступы Main, здесь будет и PageHeader
  padding-bottom: 90px; // Отступ для нижней панели + немного запаса
  position: relative; // Для позиционирования PageTitle внутри
  width: 100%; // Занимает всю доступную ширину внутри Container (с учетом padding)
  box-shadow: ${({ theme }) => theme.shadows.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.space.md};
    margin-top: 90px; // Пропорционально для мобильных
    padding-bottom: 80px;
    border-top-left-radius: ${({ theme }) => theme.radii.lg};
    border-top-right-radius: ${({ theme }) => theme.radii.lg};
  }
`;

// TopBar теперь не нужен как отдельный элемент, PageTitle будет внутри Main
// Если все же нужен какой-то разделитель или фон для заголовка, его можно стилизовать внутри Main

const BottomNavBar = styled.nav`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: auto;
  max-width: calc(100% - 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px;
  background-color: ${({ theme }) => theme.colors.backgroundGlass}; 
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: ${({ theme }) => theme.radii.xl};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  z-index: 1000;
`;

const NavItem = styled.div<{
  $active?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  // Убираем color отсюда, так как он будет наследоваться от SVG или задаваться SVG иконке напрямую
  // color: ${({ theme, $active }) => ($active ? theme.colors.text : theme.colors.textSecondary)};
  background-color: ${({ $active, theme }) => ($active ? theme.colors.primary + '22' : 'transparent')}; // Немного фона для активного элемента
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: ${({ theme }) => theme.radii.md};
  
  &:hover {
    // color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.primary + '11'}; 
  }
  
  // SVG иконки теперь будут основными
  svg {
    width: 26px; // Немного увеличим размер для наглядности
    height: 26px;
    fill: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSecondary)}; // Динамический цвет для SVG
    transition: fill 0.25s ease;
  }

  &:hover svg {
    fill: ${({ theme }) => theme.colors.primary};
  }
`;

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const isActive = (path: string) => router.pathname === path;

  const navItems = [
    { path: '/', label: 'Главная', icon: <HomeIcon /> },
    { path: '/create', label: 'Создать', icon: <CreateIcon /> },
    { path: '/manage', label: 'Токены', icon: <TokensIcon /> },
    { path: '/wallet', label: 'Кошелёк', icon: <WalletIcon /> },
  ];

  return (
    <Container>
      <Main>
        {children}
      </Main>
      
      <BottomNavBar>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            onClick={() => {
              console.log(`Navigating to: ${item.path}`);
              router.push(item.path);
            }}
            $active={isActive(item.path)}
            title={item.label}
          >
            {/* React.cloneElement(item.icon, { color: isActive(item.path) ? theme.colors.primary : theme.colors.textSecondary }) */}
            {item.icon} {/* Передаем иконку как есть, цвет управляется стилями NavItem svg */}
          </NavItem>
        ))}
      </BottomNavBar>
    </Container>
  );
}; 