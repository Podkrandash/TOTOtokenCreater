import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Layout } from '@/components/Layout';
import { TokenCard } from '@/components/TokenCard';
import { useTokenStore, JettonToken } from '@/store/tokenStore';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { Button } from '@/components/Button';
import { useRouter } from 'next/router';
import { Card } from '@/components/Card';

const ConnectWalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => `${theme.space.xl} ${theme.space.sm}`};
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

const TokensGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.space.md};
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.space.sm};
  }
`;

const EmptyState = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.space.xl};
  
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.space.lg};
  }
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.space.md};
  
  @media (max-width: 480px) {
    font-size: 40px;
    margin-bottom: ${({ theme }) => theme.space.sm};
  }
`;

const EmptyStateTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.space.md};
  font-size: 24px;
  
  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: ${({ theme }) => theme.space.sm};
  }
`;

const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.lg};
  max-width: 400px;
  
  @media (max-width: 480px) {
    font-size: 15px;
    margin-bottom: ${({ theme }) => theme.space.md};
  }
`;

const TokenModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.space.md};
`;

const ModalContent = styled(Card)`
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.space.lg};
  
  @media (max-width: 480px) {
    max-height: 85vh;
    padding: ${({ theme }) => theme.space.md};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.lg};
  
  @media (max-width: 480px) {
    margin-bottom: ${({ theme }) => theme.space.md};
  }
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  word-break: break-word;
  padding-right: ${({ theme }) => theme.space.md};
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 24px;
  cursor: pointer;
  flex-shrink: 0;
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ModalSection = styled.div`
  margin-bottom: ${({ theme }) => theme.space.lg};
  
  @media (max-width: 480px) {
    margin-bottom: ${({ theme }) => theme.space.md};
  }
`;

const SectionTitle = styled.h4`
  margin-bottom: ${({ theme }) => theme.space.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  text-transform: uppercase;
`;

const TokenDetail = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

const TokenDetailLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const TokenDetailValue = styled.span`
  word-break: break-word;
`;

const ActionButton = styled(Button)`
  margin-bottom: ${({ theme }) => theme.space.sm};
`;

export default function Manage() {
  const [tonConnectUI] = useTonConnectUI();
  const { tokens } = useTokenStore();
  const router = useRouter();
  const [selectedToken, setSelectedToken] = useState<JettonToken | null>(null);
  
  // Проверяем, есть ли запрос на просмотр конкретного токена из URL
  useEffect(() => {
    const tokenId = router.query.token as string;
    if (tokenId && tokens.length > 0) {
      const token = tokens.find(t => t.id === tokenId);
      if (token) {
        setSelectedToken(token);
      }
    }
  }, [router.query, tokens]);
  
  const handleConnect = async () => {
    if (tonConnectUI) {
      await tonConnectUI.connectWallet();
    }
  };
  
  const handleViewToken = (token: JettonToken) => {
    setSelectedToken(token);
  };
  
  const handleManageToken = (token: JettonToken) => {
    setSelectedToken(token);
  };
  
  const closeModal = () => {
    setSelectedToken(null);
    
    // Удаляем параметр token из URL при закрытии модального окна
    if (router.query.token) {
      const query = { ...router.query };
      delete query.token;
      router.replace({ pathname: router.pathname, query }, undefined, { shallow: true });
    }
  };
  
  const isWalletConnected = tonConnectUI && tonConnectUI.wallet;
  
  // Фильтруем токены, которые принадлежат подключенному кошельку
  const userTokens = isWalletConnected
    ? tokens.filter(token => token.ownerAddress === tonConnectUI.wallet?.account.address)
    : [];
  
  if (!isWalletConnected) {
    return (
      <Layout title="Управление токенами">
        <ConnectWalletContainer>
          <Title>Подключите кошелёк для управления токенами</Title>
          <Subtitle>
            Для просмотра и управления вашими Jetton токенами необходимо подключить ваш TON кошелек.
          </Subtitle>
          <Button size="large" onClick={handleConnect}>
            Подключить кошелёк
          </Button>
        </ConnectWalletContainer>
      </Layout>
    );
  }
  
  return (
    <Layout title="Управление токенами">
      {userTokens.length === 0 ? (
        <EmptyState>
          <EmptyStateIcon>🪙</EmptyStateIcon>
          <EmptyStateTitle>У вас пока нет токенов</EmptyStateTitle>
          <EmptyStateText>
            Вы еще не создали ни одного Jetton токена. Создайте свой первый токен прямо сейчас!
          </EmptyStateText>
          <Button onClick={() => router.push('/create')}>
            Создать токен
          </Button>
        </EmptyState>
      ) : (
        <TokensGrid>
          {userTokens.map((token) => (
            <TokenCard
              key={token.id}
              token={token}
              onView={handleViewToken}
              onManage={handleManageToken}
            />
          ))}
        </TokensGrid>
      )}
      
      {selectedToken && (
        <TokenModal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>{selectedToken.name} ({selectedToken.symbol})</ModalTitle>
              <CloseButton onClick={closeModal}>&times;</CloseButton>
            </ModalHeader>
            
            <ModalSection>
              <SectionTitle>Информация о токене</SectionTitle>
              
              <TokenDetail>
                <TokenDetailLabel>Название</TokenDetailLabel>
                <TokenDetailValue>{selectedToken.name}</TokenDetailValue>
              </TokenDetail>
              
              <TokenDetail>
                <TokenDetailLabel>Символ</TokenDetailLabel>
                <TokenDetailValue>{selectedToken.symbol}</TokenDetailValue>
              </TokenDetail>
              
              <TokenDetail>
                <TokenDetailLabel>Описание</TokenDetailLabel>
                <TokenDetailValue>{selectedToken.description || 'Нет описания'}</TokenDetailValue>
              </TokenDetail>
              
              <TokenDetail>
                <TokenDetailLabel>Общее количество</TokenDetailLabel>
                <TokenDetailValue>{selectedToken.totalSupply}</TokenDetailValue>
              </TokenDetail>
              
              <TokenDetail>
                <TokenDetailLabel>Десятичные знаки</TokenDetailLabel>
                <TokenDetailValue>{selectedToken.decimals}</TokenDetailValue>
              </TokenDetail>
            </ModalSection>
            
            <ModalSection>
              <SectionTitle>Технические детали</SectionTitle>
              
              <TokenDetail>
                <TokenDetailLabel>Адрес контракта</TokenDetailLabel>
                <TokenDetailValue>{selectedToken.contractAddress}</TokenDetailValue>
              </TokenDetail>
              
              <TokenDetail>
                <TokenDetailLabel>Владелец</TokenDetailLabel>
                <TokenDetailValue>{selectedToken.ownerAddress}</TokenDetailValue>
              </TokenDetail>
              
              <TokenDetail>
                <TokenDetailLabel>Дата создания</TokenDetailLabel>
                <TokenDetailValue>
                  {new Date(selectedToken.createdAt).toLocaleString()}
                </TokenDetailValue>
              </TokenDetail>
            </ModalSection>
            
            <ModalSection>
              <SectionTitle>Действия</SectionTitle>
              
              <ActionButton fullWidth>
                Выпустить дополнительные токены
              </ActionButton>
              
              <ActionButton fullWidth>
                Сжечь токены
              </ActionButton>
              
              <ActionButton fullWidth variant="outline">
                Передать право владения
              </ActionButton>
            </ModalSection>
          </ModalContent>
        </TokenModal>
      )}
    </Layout>
  );
} 