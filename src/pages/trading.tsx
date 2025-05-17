import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { fetchTokenById } from '@/services/tokenService';
import { ArrowBackIcon } from '@/components/icons';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
`;

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space.xl};
  width: 100%;
  max-width: 400px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.border};
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.space.lg};
  font-size: 24px;
  font-weight: 600;
`;

const AmountInput = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.space.md};
  text-align: center;
  font-size: 24px;
  font-weight: 500;
  background-color: transparent;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space.lg};
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

const TokenInfo = styled.div`
  margin-bottom: ${({ theme }) => theme.space.lg};
  font-size: 16px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ActionButton = styled(Button)<{ $isBuy?: boolean }>`
  margin-top: ${({ theme }) => theme.space.md};
  background-color: ${({ theme, $isBuy }) => 
    $isBuy ? theme.colors.success : theme.colors.error} !important;
  color: white !important;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 16px;
  padding: ${({ theme }) => theme.space.md};
  background: none;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 20px;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export default function TradingPage() {
  const router = useRouter();
  const { token: tokenId, action } = router.query;
  const [amount, setAmount] = useState('');
  const [tokenData, setTokenData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Загрузка данных токена
  useEffect(() => {
    if (tokenId && typeof tokenId === 'string') {
      setIsLoading(true);
      fetchTokenById(tokenId)
        .then(data => {
          setTokenData(data);
          setIsLoading(false);
        })
        .catch(error => {
          console.error('Ошибка при загрузке данных токена:', error);
          setIsLoading(false);
        });
    }
  }, [tokenId]);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Принимаем только числа
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setAmount(value);
  };
  
  const handleTrade = () => {
    if (!amount || !tokenData) return;
    
    // В реальном приложении здесь будет редирект на DeDust с параметрами
    const dedustUrl = `https://dedust.io/swap?${
      action === 'buy' 
        ? `inputCurrency=TON&outputCurrency=${tokenData.contractAddress}&exactAmount=${amount}` 
        : `inputCurrency=${tokenData.contractAddress}&outputCurrency=TON&exactAmount=${amount}`
    }`;
    
    window.open(dedustUrl, '_blank');
  };
  
  const handleBack = () => {
    router.back();
  };
  
  const isBuy = action === 'buy';
  
  if (isLoading) {
    return (
      <Layout>
        <PageContainer>
          <Card>Загрузка данных токена...</Card>
        </PageContainer>
      </Layout>
    );
  }
  
  if (!tokenData) {
    return (
      <Layout>
        <PageContainer>
          <Card>
            <Title>Токен не найден</Title>
            <Button onClick={handleBack}>Вернуться назад</Button>
          </Card>
        </PageContainer>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <BackButton onClick={handleBack}>
        <ArrowBackIcon size={20}/> Назад
      </BackButton>
      
      <PageContainer>
        <Card>
          <Title>
            {isBuy ? 'Купить' : 'Продать'} {tokenData.symbol}
          </Title>
          
          <TokenInfo>
            Текущая цена: {tokenData.price || '---'}
          </TokenInfo>
          
          <AmountInput 
            type="text"
            placeholder="Введите количество"
            value={amount}
            onChange={handleAmountChange}
            autoFocus
          />
          
          <ActionButton 
            fullWidth 
            size="large" 
            $isBuy={isBuy} 
            onClick={handleTrade}
            disabled={!amount || parseFloat(amount) <= 0}
          >
            {isBuy ? 'Купить на DeDust' : 'Продать на DeDust'}
          </ActionButton>
        </Card>
      </PageContainer>
    </Layout>
  );
} 