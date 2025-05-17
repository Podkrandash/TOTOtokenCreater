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
import { useTokenStore, JettonToken } from '@/store/tokenStore';
import { fetchTokenById, MarketTokenData } from '@/services/tokenService';
import { useTon } from '@/hooks/useTon';
import { useDex } from '@/hooks/useDex';
import { DexTokenData } from '@/services/dexService';

// Добавляем константу tonCoinData
const tonCoinData = {
  id: 'ton',
  name: 'Toncoin',
  symbol: 'TON',
  date: 'Launched Aug 2020',
  iconUrl: 'https://ton.org/download/ton_symbol.png',
  contractAddress: 'Native Token',
  totalSupplyLabel: 'Total Supply',
  totalSupplyValue: '5.09B TON',
  marketCapLabel: 'Market Cap',
  marketCapUSD: '$11.52B',
  priceUSD: '2.26',
  priceChange24h: 1.8,
  holders: '6.1M+',
  transactions: '250M+',
  volume24h: '$45.3M',
  telegramLink: 'https://t.me/toncoin'
};

// --- Styled Components --- 
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100%; // Используем min-height для растягивания
  background-color: ${({ theme }) => theme.colors.backgroundSecondary}; // Используем цвет фона темы
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
  background-color: ${({ theme }) => theme.colors.backgroundSecondary}; // Используем цвет фона темы
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
  background-color: ${({ theme }) => theme.colors.backgroundSecondary}; // Используем цвет фона темы
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
  background-color: ${({ theme }) => theme.colors.backgroundSecondary}; // Используем цвет фона темы
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

// Убираем BottomNav и связанные компоненты, добавляем стили для DEX интерфейса
const DexStatusBadge = styled.div<{$status: 'pending' | 'success' | 'error'}>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 12px;
  font-weight: 500;
  margin-left: ${({ theme }) => theme.space.md};
  background-color: ${({ theme, $status }) => 
    $status === 'success' ? theme.colors.primary + '20' : 
    $status === 'error' ? theme.colors.error + '20' : 
    theme.colors.backgroundGlass};
  color: ${({ theme, $status }) => 
    $status === 'success' ? theme.colors.primary : 
    $status === 'error' ? theme.colors.error : 
    theme.colors.textSecondary};
  
  &::before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: ${({ theme }) => theme.space.xs};
    background-color: ${({ theme, $status }) => 
      $status === 'success' ? theme.colors.primary : 
      $status === 'error' ? theme.colors.error : 
      theme.colors.textSecondary};
  }
`;

const LiquidityInfo = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${({ theme }) => theme.space.xs};
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const SlippageSelector = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xs};
  margin-top: ${({ theme }) => theme.space.sm};
`;

const SlippageButton = styled.button<{$active?: boolean}>`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  font-size: 12px;
  background-color: ${({ theme, $active }) => 
    $active ? theme.colors.backgroundGlass : 'transparent'};
  border: 1px solid ${({ theme, $active }) => 
    $active ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.sm};
  color: ${({ theme, $active }) => 
    $active ? theme.colors.primary : theme.colors.textSecondary};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

// Тип для данных токена, объединяющий JettonToken, tonCoinData и поля с DEX
type DisplayTokenData = JettonToken & 
  Omit<Partial<typeof tonCoinData>, 'volume24h' | 'marketCapUSD'> & 
  Omit<Partial<MarketTokenData>, 'volume24h'> & 
  Omit<Partial<DexTokenData>, 'volume24h'> &
  { 
    volume24h?: string | number;
    marketCapUSD?: string;
  };

const NotFoundContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.space.xl};
  text-align: center;
  min-height: 300px;
`;

export default function TokenPage() {
  const router = useRouter();
  const { id: tokenIdFromQuery } = router.query;
  const { tokens: createdTokens } = useTokenStore();
  const { wallet, connected, connect } = useTon();
  const { getToken, swapTokens } = useDex();

  const [activeTimeframe, setActiveTimeframe] = useState('1D');
  const [tokenData, setTokenData] = useState<DisplayTokenData | null | 'loading'>('loading');
  
  // Состояния для DEX
  const [dexTokenData, setDexTokenData] = useState<DexTokenData | null>(null);
  
  // Загружаем данные о токене из DEX
  useEffect(() => {
    const fetchDexToken = async () => {
      if (!tokenData || tokenData === 'loading' || !tokenData.contractAddress) {
        return;
      }
      
      try {
        // Для нативного TON не делаем запрос
        if (tokenData.contractAddress === 'Native Token') {
          return;
        }
        
        const dexToken = await getToken(tokenData.contractAddress);
        if (dexToken) {
          setDexTokenData(dexToken);
        }
      } catch (error) {
        console.error('Ошибка при получении данных из DEX:', error);
      }
    };
    
    fetchDexToken();
  }, [tokenData, getToken]);

  // Существующий useEffect для загрузки данных токена
  useEffect(() => {
    if (tokenIdFromQuery) {
      if (tokenIdFromQuery === 'ton') {
        // Для /token/ton всегда показываем tonCoinData
        setTokenData(tonCoinData as DisplayTokenData);
      } else {
        // Сначала ищем в местном хранилище
        const foundLocalToken = createdTokens.find(t => t.id === tokenIdFromQuery);
        
        // Потом проверяем в сервисе токенов
        const fetchToken = async () => {
          try {
            const marketToken = await fetchTokenById(tokenIdFromQuery as string);
            if (marketToken) {
              setTokenData({
                ...tonCoinData, // Базовые поля для UI
                ...marketToken, // Поля из API маркета
                id: marketToken.id,
                name: marketToken.name,
                symbol: marketToken.symbol,
                description: marketToken.description,
                image: marketToken.image,
                iconUrl: marketToken.image, // Дублируем для UI
                contractAddress: marketToken.contractAddress,
                date: marketToken.launchDate,
                price: marketToken.price,
                change: marketToken.change,
                // Поля для отображения
                priceUSD: parseFloat(marketToken.price.replace(' TON', '')).toFixed(2),
                priceChange24h: parseFloat(marketToken.change.replace('%', '').replace('+', '')),
                marketCapUSD: marketToken.marketCap,
                volume24h: marketToken.volume,
                // Обязательные поля из JettonToken, которых может не быть в MarketTokenData
                decimals: 9, // По умолчанию
                totalSupply: "1000000000", // По умолчанию
                ownerAddress: "UNKNOWN", // По умолчанию
                createdAt: new Date(marketToken.launchDate).getTime()
              });
              return;
            }
          } catch (error) {
            console.error('Ошибка при получении данных токена:', error);
          }
          
          // Если не нашли в API маркета, используем локальный токен
          if (foundLocalToken) {
            setTokenData({
              ...tonCoinData, // Берем за основу, чтобы иметь все поля для UI
              ...foundLocalToken, // Перезаписываем полями из нашего токена
              iconUrl: foundLocalToken.image, // Используем image как iconUrl для UI
              date: new Date(foundLocalToken.createdAt).toLocaleDateString('ru-RU', { year: 'numeric', month: 'short', day: 'numeric' }),
              totalSupplyLabel: 'Total Supply',
              totalSupplyValue: `${Number(foundLocalToken.totalSupply).toLocaleString('ru-RU')} ${foundLocalToken.symbol}`,
            });
          } else {
            setTokenData(null); // Токен не найден
          }
        };
        
        fetchToken();
      }
    } else {
      setTokenData('loading'); // ID еще не пришел
    }
  }, [tokenIdFromQuery, createdTokens]);

  const handleBuyClick = () => {
    // Редирект на страницу торговли с параметрами
    router.push(`/trading?token=${tokenIdFromQuery}&action=buy`);
  };

  const handleSellClick = () => {
    // Редирект на страницу торговли с параметрами
    router.push(`/trading?token=${tokenIdFromQuery}&action=sell`);
  };

  if (tokenData === 'loading') {
    return <Layout><PageContainer>Загрузка данных токена...</PageContainer></Layout>;
  }

  if (!tokenData) {
    return (
      <Layout>
        <PageContainer>
          <TopBar>
            <BackButton onClick={() => router.back()}><ArrowBackIcon size={20}/> Назад</BackButton>
          </TopBar>
          <NotFoundContainer>
            <h2>Токен не найден</h2>
            <p>Возможно, вы перешли по неверной ссылке или токен был удален.</p>
            <Button onClick={() => router.push('/')} style={{marginTop: '16px'}}>
              На главную
            </Button>
          </NotFoundContainer>
        </PageContainer>
      </Layout>
    );
  }
  
  const handleBack = () => router.back();
  const handleCopyAddress = () => {
    if(tokenData.contractAddress && tokenData.contractAddress !== 'Native Token'){
      navigator.clipboard.writeText(tokenData.contractAddress).then(() => alert('Адрес контракта скопирован!'));
    } else if (tokenData.contractAddress === 'Native Token') {
      alert('Это нативный токен сети.');
    } else {
      alert('Адрес контракта не указан.');
    }
  }
  const handleOpenExplorer = () => {
    if(tokenData.contractAddress && tokenData.contractAddress !== 'Native Token'){
      // Открываем адрес в эксплорере TON
      window.open(`https://tonscan.org/address/${tokenData.contractAddress}`, '_blank');
    } else {
      alert('Адрес контракта не указан или это нативный токен.');
    }
  }
  const handleMoreOptions = () => alert('More options (not implemented)');
  const handleWhatIsThisSupply = () => alert('Total supply indicates the total number of tokens created.');
  const handleReaction = (reaction: string) => alert(`${reaction} clicked (not implemented)`);
  
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
          <TokenIconImg src={tokenData.iconUrl || 'https://via.placeholder.com/40?text=' + tokenData.symbol.substring(0,1) } alt={tokenData.name} />
          <TokenNameDate>
            <TokenName>{tokenData.name} ({tokenData.symbol})</TokenName>
            <TokenDate>{tokenData.date || new Date(tokenData.createdAt).toLocaleDateString('ru-RU')}</TokenDate>
          </TokenNameDate>
        </TokenHeader>

        <SupplyInfo> 
          <SupplyText>
            {tokenData.totalSupplyLabel || 'Total Supply'}: {tokenData.totalSupplyValue || `${Number(tokenData.totalSupply).toLocaleString('ru-RU')} ${tokenData.symbol}`}
            <QuestionIconWrapper onClick={handleWhatIsThisSupply}>
              <QuestionIcon size={14} />
            </QuestionIconWrapper>
          </SupplyText>
        </SupplyInfo>

        {/* Блок с MarketInfo показываем для всех токенов с ценой или TON */}
        {(tokenIdFromQuery === 'ton' || tokenData.price || tokenData.priceUSD) && (
            <MarketInfoContainer>
                <PriceAndStats>
                <PriceInfo>
                    <MarketCapLabel>{tokenData.marketCapLabel || 'Price'}</MarketCapLabel>
                    <PriceLarge>
                        {tokenData.priceUSD ? `$${tokenData.priceUSD}` : tokenData.price || 'N/A'}
                        {tokenData.priceChange24h !== undefined && 
                            <PriceChangeSmall $isPositive={tokenData.priceChange24h >= 0 || tokenData.change?.startsWith('+')}>
                                {tokenData.priceChange24h >= 0 ? '+' : ''}{tokenData.priceChange24h}%
                            </PriceChangeSmall>
                        }
                        {!tokenData.priceChange24h && tokenData.change && 
                            <PriceChangeSmall $isPositive={tokenData.change.startsWith('+')}>
                                {tokenData.change}
                            </PriceChangeSmall>
                        }
                    </PriceLarge>
                </PriceInfo>
                <StatsInfo>
                    {(tokenData.marketCapUSD || tokenData.marketCap) && 
                        <StatRow>
                            <StatLabel>Market Cap</StatLabel>
                            <StatValue>{tokenData.marketCapUSD || tokenData.marketCap}</StatValue>
                        </StatRow>
                    }
                    {(tokenData.volume24h || tokenData.volume) && 
                        <StatRow>
                            <StatLabel>Volume (24h)</StatLabel>
                            <StatValue>{tokenData.volume24h || tokenData.volume}</StatValue>
                        </StatRow>
                    }
                    {tokenData.holders && 
                        <StatRow>
                            <StatLabel>Holders</StatLabel>
                            <StatValue>{tokenData.holders}</StatValue>
                        </StatRow>
                    }
                </StatsInfo>
                </PriceAndStats>
            </MarketInfoContainer>
        )}

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
          <BuyButton fullWidth size="large" onClick={handleBuyClick}>
            Купить {tokenData.symbol || 'Token'} через DEX
          </BuyButton>
          <SellButton fullWidth size="large" onClick={handleSellClick}>
            Продать {tokenData.symbol || 'Token'} через DEX
          </SellButton>
        </TradeButtonsContainer>
      </PageContainer>
    </Layout>
  );
} 