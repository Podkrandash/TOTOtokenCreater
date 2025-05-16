import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useTon } from '@/hooks/useTon';
import { useTokenStore } from '@/store/tokenStore';
import { useRouter } from 'next/router';
import { useTonConnectUI } from '@tonconnect/ui-react';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
`;

const WalletCard = styled(Card)`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const WalletHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const WalletTitle = styled.h2`
  margin: 0;
  font-size: 24px;
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const WalletAddress = styled.div`
  font-size: 14px;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.space.sm};
  border-radius: ${({ theme }) => theme.radii.md};
  word-break: break-all;
  margin-bottom: ${({ theme }) => theme.space.md};
  
  @media (max-width: 480px) {
    font-size: 12px;
  }
`;

const InfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => `${theme.space.sm} 0`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const InfoLabel = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InfoValue = styled.div`
  font-weight: 500;
  
  &.highlight {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 600;
  }
`;

const TokensSection = styled.div`
  margin-top: ${({ theme }) => theme.space.md};
`;

const SectionTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const TokensList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
`;

const TokenItem = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.space.sm};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.radii.md};
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${({ theme }) => `rgba(0, 136, 204, 0.1)`};
  }
`;

const TokenLogo = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: ${({ theme }) => theme.space.sm};
  font-weight: bold;
  color: white;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const TokenInfo = styled.div`
  flex: 1;
`;

const TokenName = styled.div`
  font-weight: 500;
`;

const TokenSymbol = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ConnectWalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.space.xxl} 0;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space.lg};
  text-align: center;
`;

const WalletPage = () => {
  const { wallet, connected, tonBalance, getTonBalance } = useTon();
  const { tokens } = useTokenStore();
  const router = useRouter();
  const [tonConnectUI] = useTonConnectUI();
  
  // Обновляем баланс при загрузке страницы
  useEffect(() => {
    if (connected) {
      getTonBalance();
    }
  }, [connected, getTonBalance]);
  
  const handleConnect = async () => {
    if (tonConnectUI) {
      await tonConnectUI.connectWallet();
    }
  };
  
  // Форматирование баланса
  const formattedBalance = tonBalance ? parseFloat(tonBalance).toFixed(4) : '0.0000';
  
  // Фильтруем токены пользователя
  const userTokens = connected && wallet
    ? tokens.filter(token => token.ownerAddress === wallet.account.address)
    : [];
    
  // Сокращение адреса кошелька
  const shortenAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };
  
  // Получаем первые буквы имени токена для логотипа
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };
  
  if (!connected || !wallet) {
    return (
      <Layout title="Мой кошелёк">
        <ConnectWalletContainer>
          <h2>Подключите кошелёк</h2>
          <p>Для просмотра информации о вашем кошельке и токенах, пожалуйста, подключите кошелёк TON.</p>
          <Button size="large" onClick={handleConnect} style={{ marginTop: '16px' }}>
            Подключить кошелёк
          </Button>
        </ConnectWalletContainer>
      </Layout>
    );
  }
  
  return (
    <Layout title="Мой кошелёк">
      <PageContainer>
        <WalletCard>
          <WalletHeader>
            <WalletTitle>Баланс кошелька</WalletTitle>
          </WalletHeader>
          
          <WalletAddress>
            {wallet.account.address}
          </WalletAddress>
          
          <InfoRow>
            <InfoLabel>Адрес:</InfoLabel>
            <InfoValue>{shortenAddress(wallet.account.address)}</InfoValue>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>Сеть:</InfoLabel>
            <InfoValue>{wallet.account.chain === '-239' ? 'TON Mainnet' : 'Testnet'}</InfoValue>
          </InfoRow>
          
          <InfoRow>
            <InfoLabel>Баланс TON:</InfoLabel>
            <InfoValue className="highlight">{formattedBalance} TON</InfoValue>
          </InfoRow>
        </WalletCard>
        
        <TokensSection>
          <SectionTitle>Мои токены ({userTokens.length})</SectionTitle>
          
          {userTokens.length > 0 ? (
            <TokensList>
              {userTokens.map((token) => (
                <TokenItem key={token.id} onClick={() => router.push(`/manage?token=${token.id}`)}>
                  <TokenLogo>
                    {token.image ? (
                      <img src={token.image} alt={token.name} />
                    ) : (
                      getInitials(token.name)
                    )}
                  </TokenLogo>
                  <TokenInfo>
                    <TokenName>{token.name}</TokenName>
                    <TokenSymbol>{token.symbol} · {parseFloat(token.totalSupply).toLocaleString()} токенов</TokenSymbol>
                  </TokenInfo>
                </TokenItem>
              ))}
            </TokensList>
          ) : (
            <EmptyState>
              <p>У вас пока нет созданных токенов</p>
              <Button onClick={() => router.push('/create')} style={{ marginTop: '16px' }}>
                Создать токен
              </Button>
            </EmptyState>
          )}
        </TokensSection>
      </PageContainer>
    </Layout>
  );
};

export default WalletPage; 