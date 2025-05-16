import styled, { css } from 'styled-components';
import React from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useRouter } from 'next/router';

// Минималистичные плейсхолдеры для иконок (можно заменить на SVG)
const HomeIconPlaceholder = () => <IconSymbol>H</IconSymbol>;
const CreateIconPlaceholder = () => <IconSymbol>+</IconSymbol>;
const TokensIconPlaceholder = () => <IconSymbol>T</IconSymbol>;
const WalletIconPlaceholder = () => <IconSymbol>W</IconSymbol>;

const IconSymbol = styled.span`
  font-size: 20px;
  font-weight: 600;
`;

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
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
  margin-top: 90px;
  padding: ${({ theme }) => theme.space.lg};
  padding-bottom: 120px; // Отступ для нижней панели + немного запаса
  position: relative; // Для позиционирования PageTitle внутри
  width: 100%; // Занимает всю доступную ширину внутри Container (с учетом padding)
  box-shadow: ${({ theme }) => theme.shadows.xl};

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.space.md};
    margin-top: 70px;
    padding-bottom: 100px;
    border-top-left-radius: ${({ theme }) => theme.radii.lg};
    border-top-right-radius: ${({ theme }) => theme.radii.lg};
  }
`;

// TopBar теперь не нужен как отдельный элемент, PageTitle будет внутри Main
// Если все же нужен какой-то разделитель или фон для заголовка, его можно стилизовать внутри Main

const PageTitleContainer = styled.div`
  position: absolute;
  top: -50px; // Выносим заголовок "над" вкладкой Main
  left: 50%;
  transform: translateX(-50%);
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.text};
  padding: ${({ theme }) => theme.space.sm} ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  font-size: 18px;
  font-weight: 600;
  z-index: 5;
  white-space: nowrap;

  @media (max-width: 768px) {
    font-size: 16px;
    padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.md};
    top: -40px;
  }
`;

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
  gap: ${({ theme }) => theme.space.sm};
  padding: ${({ theme }) => theme.space.sm};
  background-color: ${({ theme }) => theme.colors.backgroundGlass}; 
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: ${({ theme }) => theme.radii.xl}; // Более круглые края
  box-shadow: ${({ theme }) => theme.shadows.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  z-index: 1000;
  padding-bottom: calc(${({ theme }) => theme.space.sm} + env(safe-area-inset-bottom, 0));

  @media (max-width: 480px) {
    gap: ${({ theme }) => theme.space.xs};
    padding: ${({ theme }) => theme.space.xs} ${({ theme }) => theme.space.sm};
    padding-bottom: calc(${({ theme }) => theme.space.xs} + env(safe-area-inset-bottom, 0));
    border-radius: ${({ theme }) => theme.radii.lg};
  }
`;

const NavItem = styled.div<{
  $active?: boolean;
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  color: ${({ theme, $active }) => ($active ? theme.colors.text : theme.colors.textSecondary)};
  background-color: ${({ $active, theme }) => ($active ? theme.colors.primary : 'transparent')};
  cursor: pointer;
  transition: all 0.25s ease;
  border-radius: ${({ theme }) => theme.radii.md};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme, $active }) => !$active && theme.colors.primary + '33'}; // primary с низкой прозрачностью
  }
  
  // Для SVG иконок (если понадобятся)
  svg {
    width: 24px;
    height: 24px;
  }
  
  @media (max-width: 480px) {
    height: 44px;
    width: 44px;
    ${IconSymbol} { // Уменьшаем размер для мобильных
      font-size: 18px;
    }
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const ConnectButtonWrapper = styled.div`
  position: fixed;
  top: 20px; 
  right: 32px; 
  z-index: 101;

  .ton-connect-button button {
    background: ${({ theme }) => theme.gradients.primary} !important; 
    color: ${({ theme }) => theme.colors.text} !important;
    border-radius: ${({ theme }) => theme.radii.md} !important;
    box-shadow: ${({ theme }) => theme.shadows.md} !important;
    font-size: 14px !important;
    padding: 8px 16px !important;
    border: none !important;
    transition: all 0.3s ease !important;
    &:hover {
      box-shadow: ${({ theme }) => theme.shadows.lg} !important;
      transform: translateY(-2px);
    }
  }

  @media (max-width: 768px) {
    top: 15px;
    right: 24px; 
    .ton-connect-button button {
      font-size: 13px !important;
      padding: 6px 12px !important;
    }
  }
  @media (max-width: 480px) {
    top: 10px;
    right: 16px; 
  }
`;

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const router = useRouter();
  const isActive = (path: string) => router.pathname === path;

  const navItems = [
    { path: '/', label: 'Главная', icon: <HomeIconPlaceholder /> },
    { path: '/create', label: 'Создать', icon: <CreateIconPlaceholder /> },
    { path: '/manage', label: 'Токены', icon: <TokensIconPlaceholder /> },
    { path: '/wallet', label: 'Кошелёк', icon: <WalletIconPlaceholder /> },
  ];

  return (
    <Container>
      <ConnectButtonWrapper>
        <TonConnectButton />
      </ConnectButtonWrapper>
      
      <Main>
        {title && <PageTitleContainer>{title}</PageTitleContainer>}
        {children}
      </Main>
      
      <BottomNavBar>
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            onClick={() => router.push(item.path)}
            $active={isActive(item.path)}
            title={item.label}
          >
            {item.icon}
          </NavItem>
        ))}
      </BottomNavBar>
    </Container>
  );
}; 