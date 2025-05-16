import styled, { css } from 'styled-components';
import React from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useRouter } from 'next/router';
// Здесь можно будет добавить иконки, если они появятся

// Плейсхолдеры для иконок (можно заменить на SVG)
const HomeIcon = () => <>🏠</>; // U+1F3E0
const CreateIcon = () => <>➕</>; // U+2795
const TokensIcon = () => <>🪙</>; // U+1FA99
const WalletIcon = () => <>💼</>; // U+1F4BC

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
  background: ${({ theme }) => theme.colors.background}; // Основной фон из темы
`;

const Main = styled.main<{
  $hasTitle?: boolean;
}>`
  flex: 1;
  padding: ${({ theme }) => theme.space.md};
  padding-top: ${({ theme, $hasTitle }) => $hasTitle ? `calc(${theme.space.md} + 50px)` : theme.space.md};
  padding-bottom: 100px; // Увеличим отступ для плавающей панели
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.space.sm};
    padding-top: ${({ theme, $hasTitle }) => $hasTitle ? `calc(${theme.space.sm} + 50px)` : theme.space.sm};
    padding-bottom: 90px;
  }
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.md};
  background-color: rgba(20, 20, 20, 0.7); // Полупрозрачный темный фон
  backdrop-filter: blur(10px); // Эффект размытия
  -webkit-backdrop-filter: blur(10px);
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border-bottom: 1px solid rgba(50, 50, 50, 0.5);
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  height: 50px;
`;

const PageTitle = styled.h1`
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const BottomNavBar = styled.nav`
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: auto; // Ширина по контенту
  max-width: calc(100% - 40px);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.space.sm}; 
  padding: ${({ theme }) => theme.space.sm};
  background-color: rgba(30, 30, 30, 0.75); // Чуть темнее и прозрачнее
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: ${({ theme }) => theme.radii.lg}; // Более круглые края
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  padding-bottom: calc(${({ theme }) => theme.space.sm} + env(safe-area-inset-bottom, 0));

  @media (max-width: 480px) {
    gap: ${({ theme }) => theme.space.xs};
    padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
    padding-bottom: calc(${({ theme }) => theme.space.xs} + env(safe-area-inset-bottom, 0));
  }
`;

const NavItem = styled.div<{
  $active?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 56px;
  width: 56px;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: ${({ theme }) => theme.radii.md};
  position: relative;
  font-size: 24px; // Для Emoji иконок

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: rgba(0, 136, 204, 0.1);
  }
  
  ${({ $active, theme }) => $active && css`
    color: ${theme.colors.text};
    background-color: ${theme.colors.primary};
  `}
  
  // Для SVG иконок (если появятся)
  svg {
    width: 28px;
    height: 28px;
  }
  
  @media (max-width: 480px) {
    height: 50px;
    width: 50px;
    font-size: 22px;
    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

const ConnectButtonWrapper = styled.div`
  position: fixed; 
  top: 10px;
  right: 16px;
  z-index: 101; // Выше TopBar
  
  .ton-connect-button button {
    background-color: ${({ theme }) => theme.colors.secondary} !important;
    color: ${({ theme }) => theme.colors.text} !important;
    border-radius: ${({ theme }) => theme.radii.md} !important;
    box-shadow: ${({ theme }) => theme.shadows.sm} !important;
    font-size: 14px !important;
    padding: 8px 12px !important;
  }

  @media (max-width: 480px) {
    right: 8px;
    top: 12px;
    .ton-connect-button button {
      font-size: 13px !important;
      padding: 6px 10px !important;
    }
  }
`;

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
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
      {title && (
        <TopBar>
          <PageTitle>{title}</PageTitle>
        </TopBar>
      )}
      <ConnectButtonWrapper>
        <TonConnectButton />
      </ConnectButtonWrapper>
      <Main $hasTitle={!!title}>{children}</Main>
      
      <BottomNavBar>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            onClick={() => router.push(item.path)}
            $active={isActive(item.path)}
            title={item.label} // Всплывающая подсказка с названием
          >
            {item.icon}
          </NavItem>
        ))}
      </BottomNavBar>
    </Container>
  );
}; 