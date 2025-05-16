import React from 'react';
import { Layout } from '@/components/Layout';
import { CreateTokenForm } from '@/components/CreateTokenForm';
import { useTonConnectUI } from '@tonconnect/ui-react';
import styled from 'styled-components';
import { Button } from '@/components/Button';

const ConnectWalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => `${theme.space.xl} ${theme.space.sm}`};
  max-width: 100%;
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.space.md};
  font-size: 28px;
  
  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: ${({ theme }) => theme.space.sm};
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.lg};
  max-width: 500px;
  line-height: 1.5;
  
  @media (max-width: 480px) {
    font-size: 15px;
    margin-bottom: ${({ theme }) => theme.space.md};
  }
`;

export default function Create() {
  const [tonConnectUI] = useTonConnectUI();
  
  const handleConnect = async () => {
    if (tonConnectUI) {
      await tonConnectUI.connectWallet();
    }
  };
  
  const isWalletConnected = tonConnectUI && tonConnectUI.wallet;
  
  return (
    <Layout>
      {!isWalletConnected ? (
        <ConnectWalletContainer>
          <Title>Подключите кошелёк для создания токена</Title>
          <Subtitle>
            Для создания и управления Jetton токенами необходимо подключить ваш TON кошелек.
          </Subtitle>
          <Button size="large" onClick={handleConnect}>
            Подключить кошелёк
          </Button>
        </ConnectWalletContainer>
      ) : (
        <CreateTokenForm />
      )}
    </Layout>
  );
} 