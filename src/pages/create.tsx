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
  padding: ${({ theme }) => theme.space.xxl} 0;
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.lg};
  max-width: 500px;
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
    <Layout title="Создание Jetton токена">
      {!isWalletConnected ? (
        <ConnectWalletContainer>
          <Title>Подключите кошелек для создания токена</Title>
          <Subtitle>
            Для создания и управления Jetton токенами необходимо подключить ваш TON кошелек.
          </Subtitle>
          <Button size="large" onClick={handleConnect}>
            Подключить кошелек
          </Button>
        </ConnectWalletContainer>
      ) : (
        <CreateTokenForm />
      )}
    </Layout>
  );
} 