import styled, { css } from 'styled-components';
import React from 'react';
import { TonConnectButton, useTonWallet } from '@tonconnect/ui-react';
import { useRouter } from 'next/router';
import { useTon } from '@/hooks/useTon';
import { useTokenStore } from '@/store/tokenStore';
// Предположим, у вас есть иконки. Если нет, можно использовать текст или SVG.
// import { HomeIcon, CreateIcon, ManageIcon, WalletIcon, TokensIcon } from '@/components/icons'; 

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  position: relative; // Для позиционирования BottomNavBar относительно этого контейнера, если нужно
`;

const Main = styled.main<{
  $hasTitle?: boolean;
}>`
  flex: 1;
  padding: ${({ theme }) => theme.space.lg};
  padding-top: ${({ theme, $hasTitle }) => $hasTitle ? theme.space.lg : `calc(${theme.space.lg} + 50px)`};
  padding-bottom: 120px; // Увеличим отступ для более высокой панели
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const TopBar = styled.header`
  display: flex;
  align-items: center;
  justify-content: center; // Заголовок по центру
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  position: sticky;
  top: 0;
  z-index: 10; // Чтобы был над контентом при скролле
  width: 100%;
  height: 50px; // Фиксированная высота для TopBar
`;

const PageTitle = styled.h1`
  margin: 0; // Убираем стандартный margin у h1, так как TopBar дает padding
  font-size: 20px; // Немного уменьшим для верхней панели
  color: ${({ theme }) => theme.colors.text};
`;

const BottomNavBar = styled.nav`
  position: fixed;
  bottom: 16px; // Отступ снизу
  left: 50%;
  transform: translateX(-50%); // Центрирование
  width: auto; // Ширина по контенту
  min-width: 320px; 
  max-width: calc(100% - 32px); // Максимальная ширина с отступами по бокам
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.radii.lg}; // Закругленный остров
  box-shadow: ${({ theme }) => theme.shadows.lg};
  padding: ${({ theme }) => theme.space.sm};
  display: flex;
  align-items: center;
  justify-content: space-between; // Изменим для лучшего распределения
  gap: ${({ theme }) => theme.space.xs}; // Уменьшим gap
  z-index: 1000;

  @media (max-width: 480px) {
    min-width: calc(100% - 20px); // На маленьких экранах почти на всю ширину
    bottom: 10px;
    left: 10px;
    right: 10px;
    transform: translateX(0);
    justify-content: space-around;
  }

  // Стили для кнопки TonConnect внутри панели
  .ton-connect-button {
    // Можно добавить кастомные стили, если нужно переопределить стандартные
    // Например, уменьшить отступы или размер
  }
`;

const NavSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.space.xs};
`;

const NavItem = styled.div<{
  $active?: boolean;
}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.textSecondary)};
  font-size: 11px; // Чуть меньше для компактности
  font-weight: ${({ $active }) => ($active ? 600 : 500)};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: color 0.2s, background-color 0.2s;
  min-width: 50px;
  text-align: center;

  &:hover {
    color: ${({ theme, $active }) => !$active && theme.colors.text};
    background-color: ${({ theme, $active }) => !$active && `rgba(255,255,255,0.05)`};
  }

  // Стили для иконок (если будут)
  svg {
    width: 22px; // Чуть меньше иконки
    height: 22px;
  }

  @media (max-width: 400px) {
    font-size: 10px;
    min-width: 45px;
    padding: ${({ theme }) => `${theme.space.xs}`};
    svg {
      width: 20px;
      height: 20px;
    }
  }
`;

const WalletInfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
  padding: 0 ${({ theme }) => theme.space.xs};
  border-left: 1px solid ${({ theme }) => theme.colors.border};
  margin-left: ${({ theme }) => theme.space.xs};
  
  @media (max-width: 600px) {
    gap: ${({ theme }) => theme.space.xs};
    padding: 0;
    margin-left: 0;
    border-left: none;
    flex-direction: column; // Для мобильных может быть лучше так
    align-items: flex-end;
  }
`;

const WalletText = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  flex-direction: column;
  align-items: flex-start; 

  span {
    color: ${({ theme }) => theme.colors.text};
    font-weight: 500;
  }

  @media (max-width: 600px) {
    align-items: flex-end;
    font-size: 11px;
  }
`;

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const router = useRouter();
  const { wallet, connected, tonBalance } = useTon();
  const { tokens } = useTokenStore();
  const walletSDK = useTonWallet(); // Получаем инстанс кошелька для доп. информации

  const userTokens = connected && wallet
    ? tokens.filter(token => token.ownerAddress === wallet.account.address)
    : [];

  const isActive = (path: string) => router.pathname === path;

  const navItems = [
    { path: '/', label: 'Главная' /* icon: <HomeIcon /> */ },
    { path: '/create', label: 'Создать' /* icon: <CreateIcon /> */ },
    { path: '/manage', label: 'Кабинет' /* icon: <ManageIcon /> */ }, // Переименовал для краткости
  ];

  // Форматирование баланса
  const formattedBalance = tonBalance ? parseFloat(tonBalance).toFixed(2) : '0.00';

  return (
    <Container>
      {title && (
        <TopBar>
          <PageTitle>{title}</PageTitle>
        </TopBar>
      )}
      <Main $hasTitle={!!title}>{children}</Main>
      <BottomNavBar>
        <NavSection>
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              onClick={() => router.push(item.path)}
              $active={isActive(item.path)}
            >
              {/* item.icon */}
              <span>{item.label}</span>
            </NavItem>
          ))}
        </NavSection>
        
        {connected && walletSDK ? (
          <WalletInfoContainer>
            <WalletText>
              Баланс: <span>{formattedBalance} TON</span>
            </WalletText>
            <WalletText>
              Мои токены: <span>{userTokens.length}</span>
            </WalletText>
            <TonConnectButton />
          </WalletInfoContainer>
        ) : (
          <TonConnectButton />
        )}
      </BottomNavBar>
      {/* Старый Footer пока закомментируем или решим, нужен ли он в новом дизайне */}
      {/* <Footer>
        &copy; {new Date().getFullYear()} TOTO Trade - платформа для создания Jetton токенов на блокчейне TON
      </Footer> */}
    </Container>
  );
}; 