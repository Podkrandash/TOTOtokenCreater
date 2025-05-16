import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import {
  ArrowBackIcon,
  CopyIcon,
  ExternalLinkIcon,
  MoreVertIcon,
  QuestionIcon,
  StarIcon,
  FireIcon,
  BrokenHeartIcon,
  ChartIcon,
  InfoIcon,
  ChatIcon
} from '@/components/icons';

// --- Styled Components --- 
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%; // Используем min-height для растягивания
  background-color: #000; // Строго черный фон
`;

const QuestionIconWrapper = styled.div`
  margin-left: auto;
  cursor: pointer;
  display: flex; // для выравнивания иконки
  align-items: center;
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.md};
  position: sticky;
  top: 0;
  background-color: rgba(0,0,0,0.8); // полупрозрачный черный для эффекта "залипания"
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  z-index: 10;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  padding: ${({ theme }) => theme.space.xs} 0;
  background: none;
  border: none;
  cursor: pointer;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TopBarActions = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.sm};
`;

const AddressButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 13px;
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const ActionIcon = styled.button`
  color: ${({ theme }) => theme.colors.textSecondary};
  background: none;
  border: none;
  padding: ${({ theme }) => theme.space.xs};
  border-radius: ${({ theme }) => theme.radii.sm};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  }
`;

const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.space.md};
  gap: ${({ theme }) => theme.space.md};
`;

const TokenIconImg = styled.img`
  width: 48px; // Увеличим иконку
  height: 48px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.border};
  border: 2px solid ${({ theme }) => theme.colors.borderLight}; // Рамка для иконки
`;

const TokenNameDate = styled.div``;

const TokenName = styled.h1`
  font-size: 24px; // Увеличим
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 2px 0;
`;

const TokenDate = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

// Адаптируем LiquidityInfo для TON
const SupplyInfo = styled.div`
  padding: 0 ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.sm};
`;

const SupplyText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
`;

const MarketInfoContainer = styled.div`
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  margin: 0 ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const PriceAndStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const PriceInfo = styled.div``;

const MarketCapLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 4px 0;
`;

const PriceLarge = styled.p`
  font-size: 30px; // Немного уменьшим для баланса
  font-weight: 700; // Жирнее
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1;
`;

const PriceChangeSmall = styled.span<{$isPositive?: boolean}>`
  font-size: 14px;
  margin-left: ${({ theme }) => theme.space.sm};
  color: ${({ theme, $isPositive }) => $isPositive ? theme.colors.success : theme.colors.error};
`;

const StatsInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 13px;
  gap: 6px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 150px; 
`;
const StatLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;
const StatValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const TimeframeSelector = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  background-color: #101010; // Чуть темнее для контраста
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TimeframeButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xs};
`;

const TimeframeButton = styled.button<{$active?: boolean}>`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  font-size: 13px;
  font-weight: 500;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  background-color: ${({ theme, $active }) => $active ? theme.colors.primary + '20' : 'transparent'}; // Фон для активной кнопки
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.primary : 'transparent'};
  transition: all 0.2s ease;
  cursor: pointer;
  &:hover {
    border-color: ${({ theme, $active }) => !$active && theme.colors.borderLight};
    color: ${({ theme, $active }) => !$active && theme.colors.text};
  }
`;

const ChartContainer = styled.div`
  height: 280px; // Увеличим высоту
  background-color: #0A0A0A; // Очень темный фон для графика
  margin: ${({ theme }) => `${theme.space.md} ${theme.space.md}`};
  border-radius: ${({ theme }) => theme.radii.lg};
  display: flex;
  flex-direction: column; // для размещения сетки и линии
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  position: relative;
  overflow: hidden;
`;

// Пример простой SVG линии для графика
const ChartLineSVG = () => (
  <svg width="100%" height="100%" viewBox="0 0 300 150" preserveAspectRatio="none" style={{ position: 'absolute', top: 0, left: 0}}>
    <defs>
      <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="rgba(0,163,255,0.1)" />
        <stop offset="100%" stopColor="rgba(0,163,255,0.8)" />
      </linearGradient>
      <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="rgba(0,163,255,0.2)" />
        <stop offset="100%" stopColor="rgba(0,163,255,0)" />
      </linearGradient>
    </defs>
    {/* Пример пути, имитирующего график */}
    <path d="M0 100 Q 50 50, 100 80 T 200 60 T 300 90" stroke="url(#lineGradient)" strokeWidth="2.5" fill="url(#areaGradient)" />
  </svg>
);

// Стилизованная сетка для графика
const ChartGrid = styled.div`
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    display: grid;
    grid-template-columns: repeat(10, 1fr);
    grid-template-rows: repeat(5, 1fr);
    opacity: 0.1;
    & > div {
        border-right: 1px solid ${({ theme }) => theme.colors.borderLight};
        border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
        &:last-child { border-right: none; }
    }
`;

const ReactionsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: ${({ theme }) => `${theme.space.md} ${theme.space.xl}`};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  margin-top: ${({ theme }) => theme.space.lg};
`;

const ReactionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  font-size: 13px;
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  border-radius: ${({ theme }) => theme.radii.round};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  transition: all 0.2s ease;
  
  svg {
    margin-right: 4px;
  }
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primary + '15' };
  }
`;

const TradeButtonsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => `${theme.space.lg} ${theme.space.md} ${theme.space.xl}`};
`;

const BuyButton = styled(Button)`
  background: ${({ theme }) => theme.gradients.primary} !important; // Используем градиент
  color: #fff !important; 
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 15px rgba(0, 163, 255, 0.3);
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 163, 255, 0.4);
    transform: translateY(-1px);
  }
`;

const SellButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.error} !important;
  color: #fff !important;
  font-weight: 600;
  font-size: 16px;
  box-shadow: 0 4px 15px rgba(255, 77, 77, 0.3);
   &:hover {
    box-shadow: 0 6px 20px rgba(255, 77, 77, 0.4);
    transform: translateY(-1px);
  }
`;

const BottomNav = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: ${({ theme }) => theme.space.sm} 0;
  background-color: #101010; 
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky;
  bottom: 0;
  z-index: 5;
`;

const NavItem = styled.button<{$active?: boolean}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  font-size: 10px;
  font-weight: 500;
  flex: 1;
  padding: ${({ theme }) => theme.space.xs} 0;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.2s ease;
  
  svg {
    width: 22px;
    height: 22px;
    fill: currentColor;
  }
  &:hover {
    color: ${({ theme, $active }) => !$active && theme.colors.text};
  }
`;

// Обновленные данные для TON
const tonCoinData = {
  id: 'ton',
  name: 'Toncoin',
  symbol: 'TON',
  date: 'Launched Aug 2020', // Примерная дата
  iconUrl: 'https://ton.org/download/ton_symbol.png',
  contractAddress: 'Native Token', // TON - нативный токен
  // Заменим Liquidity на Supply/Market Info
  totalSupplyLabel: 'Total Supply',
  totalSupplyValue: '5.09B TON', // Примерное значение
  marketCapLabel: 'Market Cap',
  marketCapUSD: '$11.52B', // Примерное значение
  priceUSD: '2.26', // Примерная цена
  priceChange24h: 1.8, // Примерное изменение в %
  holders: '6.1M+', // Примерное кол-во
  transactions: '250M+', // Примерное кол-во
  volume24h: '$45.3M',
  pl: '+$0.52 +4.15%', // Пример P&L, если бы пользователь держал
  telegramLink: 'https://t.me/toncoin' 
};

export default function TokenPage() {
  const router = useRouter();
  const { id: tokenId } = router.query; // tokenId будет 'ton' если мы перешли на эту страницу
  const [activeTimeframe, setActiveTimeframe] = useState('1D'); // Изменим таймфреймы
  const [tokenData, setTokenData] = useState<any>(tonCoinData); // Используем tonCoinData
  const [activeBottomTab, setActiveBottomTab] = useState('trade');

  useEffect(() => {
    // Если бы у нас были другие токены, мы бы их загружали по tokenId
    // Сейчас просто используем tonCoinData
    if (tokenId === 'ton') {
        setTokenData(tonCoinData);
    } else {
        // Можно добавить обработку для других ID, если они появятся
        // Например, показать ошибку или заглушку "Токен не найден"
        // router.push('/'); // или 
        setTokenData({ ...tonCoinData, name: `Token ${tokenId} (Not Found)`, id: tokenId });
    }
  }, [tokenId]);

  if (!tokenData) {
    return <Layout><PageContainer>Загрузка данных токена...</PageContainer></Layout>;
  }
  
  const handleBack = () => router.back();
  const handleCopyAddress = () => {
    if(tokenData.contractAddress !== 'Native Token'){
      navigator.clipboard.writeText(tokenData.contractAddress).then(() => alert('Адрес скопирован!'));
    } else {
      alert('Это нативный токен сети.');
    }
  }
  const handleOpenExplorer = () => alert('Open in explorer (not implemented)');
  const handleMoreOptions = () => alert('More options (not implemented)');
  const handleWhatIsThisSupply = () => alert('Information about token supply (not implemented)');
  const handleReaction = (reaction: string) => alert(`${reaction} clicked (not implemented)`);
  const handleBuy = () => alert('Buy TON (not implemented)');
  const handleSell = () => alert('Sell TON (not implemented)');
  const handleOpenChat = () => {
    if (tokenData.telegramLink) {
      window.open(tokenData.telegramLink, '_blank');
    } else {
      alert('Ссылка на чат не указана для этого токена');
    }
  }

  const timeframes = ['1H', '4H', '1D', '1W', '1M', 'All'];

  return (
    <Layout>
      <PageContainer>
        <TopBar>
          <BackButton onClick={handleBack}><ArrowBackIcon size={20}/> Назад</BackButton>
          <TopBarActions>
            <AddressButton onClick={handleCopyAddress}>
              <CopyIcon size={14}/> 
              {tokenData.contractAddress === 'Native Token' ? 'Native' : `${tokenData.contractAddress.substring(0,6)}...${tokenData.contractAddress.slice(-4)}`}
            </AddressButton>
            <ActionIcon onClick={handleOpenExplorer} title="Посмотреть в эксплорере"><ExternalLinkIcon size={20}/></ActionIcon>
            <ActionIcon onClick={handleMoreOptions} title="Дополнительно"><MoreVertIcon size={20}/></ActionIcon>
          </TopBarActions>
        </TopBar>

        <TokenHeader>
          <TokenIconImg src={tokenData.iconUrl} alt={tokenData.name} />
          <TokenNameDate>
            <TokenName>{tokenData.name} ({tokenData.symbol})</TokenName>
            <TokenDate>{tokenData.date}</TokenDate>
          </TokenNameDate>
        </TokenHeader>

        <SupplyInfo> 
          <SupplyText>
            {tokenData.totalSupplyLabel}: {tokenData.totalSupplyValue}
            <QuestionIconWrapper onClick={handleWhatIsThisSupply}>
              <QuestionIcon size={14} />
            </QuestionIconWrapper>
          </SupplyText>
        </SupplyInfo>

        <MarketInfoContainer>
            <PriceAndStats>
            <PriceInfo>
                <MarketCapLabel>{tokenData.marketCapLabel}</MarketCapLabel>
                <PriceLarge>${tokenData.priceUSD} <PriceChangeSmall $isPositive={tokenData.priceChange24h >= 0}>{tokenData.priceChange24h >= 0 ? '+' : ''}{tokenData.priceChange24h}%</PriceChangeSmall></PriceLarge>
            </PriceInfo>
            <StatsInfo>
                <StatRow><StatLabel>Market Cap</StatLabel><StatValue>{tokenData.marketCapUSD}</StatValue></StatRow>
                <StatRow><StatLabel>Volume (24h)</StatLabel><StatValue>{tokenData.volume24h}</StatValue></StatRow>
                <StatRow><StatLabel>Holders</StatLabel><StatValue>{tokenData.holders}</StatValue></StatRow>
            </StatsInfo>
            </PriceAndStats>
        </MarketInfoContainer>

        <TimeframeSelector>
          <TimeframeButtons>
            {timeframes.map(tf => (
              <TimeframeButton 
                key={tf} 
                $active={activeTimeframe === tf} 
                onClick={() => setActiveTimeframe(tf)}>
                {tf}
              </TimeframeButton>
            ))}
          </TimeframeButtons>
          <ActionIcon title="Настройки графика"><ChartIcon size={20}/></ActionIcon>
        </TimeframeSelector>

        {/* Уберем PLInfo или адаптируем его, для простоты пока уберем */}
        {/* {activeTimeframe !== 'МКап' && activeTimeframe !== 'Цена' && (
            <PLInfo>{tokenData.pl}</PLInfo>
        )} */}

        <ChartContainer>
          <ChartGrid>
            {[...Array(50)].map((_, i) => <div key={i} />)}
          </ChartGrid>
          <ChartLineSVG />
          {/* Можно добавить сообщение, если нет данных для графика */}
          {/* <p>График для {activeTimeframe} {tokenData.symbol}</p> */}
        </ChartContainer>

        <ReactionsContainer>
          <ReactionButton onClick={() => handleReaction('Star')}><StarIcon /> {235}</ReactionButton>
          <ReactionButton onClick={() => handleReaction('Fire')}><FireIcon /> {188}</ReactionButton>
          <ReactionButton onClick={() => handleReaction('BrokenHeart')}><BrokenHeartIcon /> {18}</ReactionButton>
        </ReactionsContainer>

        <TradeButtonsContainer>
          <BuyButton fullWidth size="large" onClick={handleBuy}>Купить {tokenData.symbol}</BuyButton>
          <SellButton fullWidth size="large" onClick={handleSell}>Продать {tokenData.symbol}</SellButton>
        </TradeButtonsContainer>
        
        <BottomNav>
          <NavItem $active={activeBottomTab === 'trade'} onClick={() => setActiveBottomTab('trade')}><ChartIcon /> Торговать</NavItem>
          <NavItem $active={activeBottomTab === 'info'} onClick={() => {setActiveBottomTab('info'); alert('Info tab clicked (not implemented)');}}><InfoIcon /> Инфо</NavItem>
          <NavItem $active={activeBottomTab === 'chat'} onClick={() => {setActiveBottomTab('chat'); handleOpenChat();}}><ChatIcon /> Чат</NavItem>
        </BottomNav>
      </PageContainer>
    </Layout>
  );
} 