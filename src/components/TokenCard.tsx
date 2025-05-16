import styled from 'styled-components';
import React from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { JettonToken } from '@/store/tokenStore';

interface TokenCardProps {
  token: JettonToken;
  onView?: (token: JettonToken) => void;
  onManage?: (token: JettonToken) => void;
}

const TokenContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.md};
  
  @media (max-width: 480px) {
    margin-bottom: ${({ theme }) => theme.space.sm};
  }
`;

const TokenLogo = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 18px;
  margin-right: ${({ theme }) => theme.space.md};
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 16px;
    margin-right: ${({ theme }) => theme.space.sm};
  }
`;

const TokenInfo = styled.div`
  flex: 1;
`;

const TokenName = styled.h3`
  font-size: 18px;
  margin: 0;
  margin-bottom: ${({ theme }) => theme.space.xs};
  
  @media (max-width: 480px) {
    font-size: 16px;
  }
`;

const TokenSymbol = styled.span`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 600;
  background-color: rgba(0, 136, 204, 0.1);
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 14px;
  display: inline-block;
  
  @media (max-width: 480px) {
    font-size: 12px;
    padding: ${({ theme }) => `calc(${theme.space.xs} / 2) ${theme.space.xs}`};
  }
`;

const TokenDetail = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const TokenLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
  
  @media (max-width: 480px) {
    font-size: 13px;
  }
`;

const TokenValue = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 180px;
  
  @media (max-width: 480px) {
    font-size: 13px;
    max-width: 150px;
  }
  
  @media (max-width: 375px) {
    max-width: 120px;
  }
`;

const TokenActions = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: ${({ theme }) => theme.space.md};
  gap: ${({ theme }) => theme.space.sm};
  
  @media (max-width: 480px) {
    margin-top: ${({ theme }) => theme.space.sm};
  }
`;

export const TokenCard: React.FC<TokenCardProps> = ({ token, onView, onManage }) => {
  // Получаем первые буквы имени токена для логотипа
  const getInitials = (name: string) => {
    return name.substring(0, 2).toUpperCase();
  };
  
  // Форматируем большие числа
  const formatNumber = (num: string) => {
    const n = parseFloat(num);
    if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
    if (n >= 1e6) return (n / 1e6).toFixed(2) + 'M';
    if (n >= 1e3) return (n / 1e3).toFixed(2) + 'K';
    return n.toString();
  };
  
  // Сокращаем адрес
  const shortenAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  return (
    <Card padding="20px" width="100%">
      <TokenContainer>
        <TokenHeader>
          <TokenLogo>
            {token.image ? (
              <img src={token.image} alt={token.name} />
            ) : (
              getInitials(token.name)
            )}
          </TokenLogo>
          <TokenInfo>
            <TokenName>{token.name}</TokenName>
            <TokenSymbol>{token.symbol}</TokenSymbol>
          </TokenInfo>
        </TokenHeader>
        
        <TokenDetail>
          <TokenLabel>Всего токенов:</TokenLabel>
          <TokenValue>{formatNumber(token.totalSupply)}</TokenValue>
        </TokenDetail>
        
        <TokenDetail>
          <TokenLabel>Контракт:</TokenLabel>
          <TokenValue>{shortenAddress(token.contractAddress)}</TokenValue>
        </TokenDetail>
        
        <TokenDetail>
          <TokenLabel>Создан:</TokenLabel>
          <TokenValue>
            {new Date(token.createdAt).toLocaleDateString()}
          </TokenValue>
        </TokenDetail>
        
        <TokenActions>
          <Button 
            variant="outline" 
            size="small" 
            onClick={() => onView && onView(token)}
            fullWidth
          >
            Детали
          </Button>
          <Button 
            variant="primary" 
            size="small" 
            onClick={() => onManage && onManage(token)}
            fullWidth
          >
            Управление
          </Button>
        </TokenActions>
      </TokenContainer>
    </Card>
  );
}; 