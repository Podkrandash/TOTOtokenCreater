import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { useTon } from '@/hooks/useTon';
import { useTokenStore, JettonToken } from '@/store/tokenStore';
import { useRouter } from 'next/router';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { TokenCard } from '@/components/TokenCard';

const WalletPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xl};
  align-items: center;
  padding: ${({ theme }) => theme.space.md} 0;
`;

const BalanceDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.space.lg} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  width: 100%;
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const TonBalanceAmount = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space.xs};

  @media (max-width: 480px) {
    font-size: 24px;
  }
`;

const UsdBalanceAmount = styled.div`
  font-family: 'Eurostile Bold Extended', ${({ theme }) => theme.fonts.heading};
  font-weight: bold;
  text-transform: uppercase;
  font-size: 48px;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 0.05em;

  @media (max-width: 768px) {
    font-size: 40px;
  }
  @media (max-width: 480px) {
    font-size: 32px;
  }
`;

const TokensGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.space.md};
  width: 100%;
  max-width: 1200px;
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SectionTitle = styled.h2`
  font-size: 24px;
  color: ${({ theme }) => theme.colors.text};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space.lg};
  
  @media (max-width: 480px) {
    font-size: 20px;
  }
`;

const ConnectWalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.space.xxl} 0;
  height: calc(100vh - 200px);
`;

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.space.xl};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  width: 100%;
  max-width: 500px;
`;

const WalletPage = () => {
  const { wallet, connected, tonBalance, getTonBalance } = useTon();
  const { tokens } = useTokenStore();
  const router = useRouter();
  const [tonConnectUI] = useTonConnectUI();
  
  const TON_TO_USD_RATE = 1.5;

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
  
  const handleViewToken = (token: JettonToken) => {
    router.push(`/manage?token=${token.id}`);
  };

  const formattedTonBalance = tonBalance ? parseFloat(tonBalance).toFixed(4) : '0.0000';
  const usdBalance = tonBalance ? (parseFloat(tonBalance) * TON_TO_USD_RATE).toFixed(2) : '0.00';

  const userTokens = connected && wallet
    ? tokens.filter(token => token.ownerAddress === wallet.account.address)
    : [];
    
  if (!connected || !wallet) {
    return (
      <Layout title="Мой кошелёк">
        <ConnectWalletContainer>
          <h2>Подключите кошелёк</h2>
          <p style={{ marginBottom: '24px', maxWidth: '400px' }}>
            Для просмотра баланса и ваших токенов, пожалуйста, подключите кошелёк TON.
          </p>
          <Button size="large" onClick={handleConnect}>
            Подключить кошелёк
          </Button>
        </ConnectWalletContainer>
      </Layout>
    );
  }
  
  return (
    <Layout title="Мой кошелёк">
      <WalletPageContainer>
        <BalanceDisplay>
          <TonBalanceAmount>{formattedTonBalance} TON</TonBalanceAmount>
          <UsdBalanceAmount>${usdBalance}</UsdBalanceAmount>
        </BalanceDisplay>

        {userTokens.length > 0 ? (
          <>
            <SectionTitle>Мои Jetton Токены</SectionTitle>
            <TokensGrid>
              {userTokens.map((token) => (
                <TokenCard
                  key={token.id}
                  token={token}
                  onView={() => handleViewToken(token)}
                  onManage={() => handleViewToken(token)}
                />
              ))}
            </TokensGrid>
          </>
        ) : (
          <EmptyStateContainer>
            <SectionTitle style={{ marginBottom: '16px' }}>У вас пока нет Jetton токенов</SectionTitle>
            <p style={{ marginBottom: '24px', color: '${({ theme }) => theme.colors.textSecondary}' }}>
              Создайте свой первый токен, чтобы он появился здесь.
            </p>
            <Button onClick={() => router.push('/create')}>
              Создать токен
            </Button>
          </EmptyStateContainer>
        )}
      </WalletPageContainer>
    </Layout>
  );
};

export default WalletPage; 