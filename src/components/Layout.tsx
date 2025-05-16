import styled, { css } from 'styled-components';
import React from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useRouter } from 'next/router';
// Здесь можно будет добавить иконки, если они появятся

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative;
  max-width: 100%;
  overflow-x: hidden;
`;

const Main = styled.main<{
  $hasTitle?: boolean;
}>`
  flex: 1;
  padding: ${({ theme }) => theme.space.md}; // Уменьшим базовый отступ
  padding-top: ${({ theme, $hasTitle }) => $hasTitle ? theme.space.md : `calc(${theme.space.md} + 50px)`};
  padding-bottom: 80px; // Отступ для нижней панели
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.space.sm};
    padding-top: ${({ theme, $hasTitle }) => $hasTitle ? theme.space.sm : `calc(${theme.space.sm} + 50px)`};
    padding-bottom: 70px;
  }
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 50px;
  
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.space.sm};
  }
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const BottomNavBar = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  box-shadow: ${({ theme }) => theme.shadows.lg};
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 70px;
  z-index: 1000;
  padding-bottom: env(safe-area-inset-bottom, 0); // Для поддержки iPhone X и новее

  @media (min-width: 768px) {
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 500px;
    border-radius: ${({ theme }) => theme.radii.lg};
    bottom: 16px;
    overflow: hidden;
  }
`;

const NavItem = styled.div<{
  $active?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  cursor: pointer;
  transition: color 0.2s, background-color 0.2s;
  padding: ${({ theme }) => `${theme.space.xs} 0`};

  &:hover {
    color: ${({ theme, $active }) => !$active && theme.colors.text};
    background-color: ${({ theme, $active }) => !$active && `rgba(255,255,255,0.05)`};
  }

  // Это будет заполнитель для иконки, пока нет реальных иконок
  &::before {
    content: "${props => props.children && typeof props.children === 'string' ? props.children.charAt(0).toUpperCase() : '•'}";
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
    font-size: 14px;
    background-color: ${({ theme, $active }) => $active ? `rgba(0, 136, 204, 0.2)` : 'transparent'};
    border-radius: 50%;
    transition: background-color 0.2s;
  }
  
  // Если есть иконки SVG
  svg {
    width: 24px;
    height: 24px;
    margin-bottom: 4px;
  }
  
  @media (max-width: 320px) {
    font-size: 10px;
    
    &::before {
      width: 20px;
      height: 20px;
      font-size: 12px;
    }
    
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const ConnectButtonWrapper = styled.div`
  position: absolute;
  top: -24px;
  right: 16px;
  
  @media (max-width: 768px) {
    right: 8px;
  }
  
  @media (min-width: 768px) {
    position: fixed;
    top: auto;
    bottom: 90px;
    right: 16px;
  }
  
  .ton-connect-button {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const router = useRouter();
  const isActive = (path: string) => router.pathname === path;

  const navItems = [
    { path: '/', label: 'Главная' /* icon: <HomeIcon /> */ },
    { path: '/create', label: 'Создать' /* icon: <CreateIcon /> */ },
    { path: '/manage', label: 'Токены' /* icon: <TokensIcon /> */ },
    { path: '/wallet', label: 'Кошелёк' /* icon: <WalletIcon /> */ }, // Новый пункт для страницы кошелька
  ];

  return (
    <Container>
      {title && (
        <TopBar>
          <PageTitle>{title}</PageTitle>
        </TopBar>
      )}
      <Main $hasTitle={!!title}>{children}</Main>
      
      <ConnectButtonWrapper>
        <TonConnectButton />
      </ConnectButtonWrapper>
      
      <BottomNavBar>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            onClick={() => router.push(item.path)}
            $active={isActive(item.path)}
          >
            {/* Здесь может быть item.icon, а пока используем текст */}
            {item.label}
          </NavItem>
        ))}
      </BottomNavBar>
    </Container>
  );
}; 