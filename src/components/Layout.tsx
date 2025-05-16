import styled from 'styled-components';
import React from 'react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useRouter } from 'next/router';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  cursor: pointer;
  
  span {
    margin-left: ${({ theme }) => theme.space.xs};
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
`;

const NavLink = styled.a<{ $active?: boolean }>`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.text};
  font-weight: ${({ $active }) => $active ? 600 : 400};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.radii.sm};
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.space.lg};
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
`;

const Footer = styled.footer`
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
`;

const Title = styled.h1`
  margin-bottom: ${({ theme }) => theme.space.lg};
  font-size: 28px;
  text-align: center;
`;

export const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const router = useRouter();
  
  const isActive = (path: string) => router.pathname === path;
  
  return (
    <Container>
      <Header>
        <Logo onClick={() => router.push('/')}>
          <span>TOTO Trade</span>
        </Logo>
        <Nav>
          <NavLink 
            onClick={() => router.push('/')} 
            $active={isActive('/')}
          >
            Главная
          </NavLink>
          <NavLink 
            onClick={() => router.push('/create')} 
            $active={isActive('/create')}
          >
            Создать токен
          </NavLink>
          <NavLink 
            onClick={() => router.push('/manage')} 
            $active={isActive('/manage')}
          >
            Управление
          </NavLink>
          <TonConnectButton />
        </Nav>
      </Header>
      <Main>
        {title && <Title>{title}</Title>}
        {children}
      </Main>
      <Footer>
        &copy; {new Date().getFullYear()} TOTO Trade - платформа для создания Jetton токенов на блокчейне TON
      </Footer>
    </Container>
  );
}; 