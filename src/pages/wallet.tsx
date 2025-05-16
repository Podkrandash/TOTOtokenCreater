import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { useTon } from '@/hooks/useTon';
import { useRouter } from 'next/router';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { JettonToken } from '@/store/tokenStore';
import { PageHeader } from '@/components/PageHeader';

interface WalletToken {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  iconUrl?: string;
}

const WalletTokenItemContainer = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.backgroundGlass};
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.borderLight};
  box-shadow: ${({ theme }) => theme.shadows.md};
  cursor: pointer;
  transition: all 0.2s ease-out;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const TokenIconPlaceholder = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  margin-right: ${({ theme }) => theme.space.md};
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const WalletTokenInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const WalletTokenName = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const WalletTokenBalance = styled.div`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const WalletTokenItem: React.FC<{ token: WalletToken }> = ({ token }) => {
  return (
    <WalletTokenItemContainer onClick={() => alert(`Переход к деталям токена ${token.symbol} (не реализовано)`)}>
      <TokenIconPlaceholder>
        {token.iconUrl ? <img src={token.iconUrl} alt={token.name} /> : token.symbol.substring(0, 2).toUpperCase()}
      </TokenIconPlaceholder>
      <WalletTokenInfo>
        <WalletTokenName>{token.name}</WalletTokenName>
        <WalletTokenBalance>{token.balance} {token.symbol}</WalletTokenBalance>
      </WalletTokenInfo>
    </WalletTokenItemContainer>
  );
};

const WalletPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xl};
  width: 100%;
  padding: ${({ theme }) => theme.space.md} 0;
`;

const BalanceDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: ${({ theme }) => theme.space.lg} 0;
  width: 100%;
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const UsdBalanceAmount = styled.div`
  font-family: 'Eurostile Bold Extended', ${({ theme }) => theme.fonts.heading};
  font-weight: bold;
  text-transform: uppercase;
  font-size: 42px;
  color: ${({ theme }) => theme.colors.primary};
  letter-spacing: 0.05em;
  line-height: 1.1;

  @media (max-width: 768px) {
    font-size: 36px;
  }
  @media (max-width: 480px) {
    font-size: 28px;
  }
`;

const TokensGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.space.md};
  width: 100%;
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
  text-align: left;
  margin-bottom: ${({ theme }) => theme.space.md};
  width: 100%;
`;

const ConnectWalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.space.xxl} 0;
  height: calc(100vh - 250px);
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
  margin-top: ${({ theme }) => theme.space.md};
`;

const WalletPage = () => {
  const { wallet, connected, tonBalance, getTonBalance } = useTon();
  const router = useRouter();
  const [tonConnectUI] = useTonConnectUI();

  const TON_TO_USD_RATE = 1.5;
  const [walletTokens, setWalletTokens] = useState<WalletToken[]>([]);

  useEffect(() => {
    if (connected) {
      // Формируем список токенов. TON Coin обновляется на основе tonBalance.
      // Остальные токены пока для примера статичны.
      const currentTonCoin = walletTokens.find(t => t.symbol === 'TON');
      const newTonBalance = tonBalance || '0';

      // Обновляем только если баланс TON действительно изменился или его еще нет
      if (!currentTonCoin || currentTonCoin.balance !== newTonBalance) {
        setWalletTokens([
          { id: '1', name: 'TON Coin', symbol: 'TON', balance: newTonBalance, iconUrl: 'https://ton.org/download/ton_symbol.png' },
          { id: '2', name: 'USD Tether', symbol: 'USDT', balance: '1025.50', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/825.png' },
          { id: '3', name: 'Pepe', symbol: 'PEPE', balance: '12345678.90', iconUrl: 'https://s2.coinmarketcap.com/static/img/coins/64x64/24478.png' },
          { id: '4', name: 'MyExample Token', symbol: 'MET', balance: '5000' },
        ]);
      }
    } else {
      // Если не подключены, очищаем список токенов
      if (walletTokens.length > 0) { // Очищаем, только если он не пустой
        setWalletTokens([]);
      }
    }
  }, [connected, tonBalance, walletTokens]); // Добавляем walletTokens в зависимости, чтобы избежать лишних вызовов, если только tonBalance меняется

  // Запрос баланса один раз при подключении (логика getTonBalance в useTon уже это обрабатывает)
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

  const usdBalance = tonBalance ? (parseFloat(tonBalance) * TON_TO_USD_RATE).toFixed(2) : '0.00';

  if (!connected || !wallet) {
    return (
      <Layout>
        <PageHeader title="Мой кошелёк" />
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
    <Layout>
      <PageHeader title="Мой кошелёк" />
      <WalletPageContainer>
        <BalanceDisplay>
          <UsdBalanceAmount>${usdBalance}</UsdBalanceAmount>
        </BalanceDisplay>

        {walletTokens.length > 0 ? (
          <>
            <SectionTitle>Мои Активы</SectionTitle>
            <TokensGrid>
              {walletTokens.map((token) => (
                <WalletTokenItem key={token.id} token={token} />
              ))}
            </TokensGrid>
          </>
        ) : (
          <EmptyStateContainer>
            <SectionTitle style={{ marginBottom: '16px' }}>Нет данных об активах</SectionTitle>
            <p style={{ color: '${({ theme }) => theme.colors.textSecondary}' }}>
              Не удалось загрузить информацию о ваших токенах.
            </p>
          </EmptyStateContainer>
        )}
      </WalletPageContainer>
    </Layout>
  );
};

export default WalletPage; 