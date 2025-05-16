import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import styled, { css } from 'styled-components';
import { Layout } from '@/components/Layout'; // Предполагается, что Layout не будет иметь свою BottomNavBar на этой странице
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
// import { useTokenStore, JettonToken } from '@/store/tokenStore'; // Для получения данных токена

// --- Styled Components --- 
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%; // Заполняем всю высоту, так как Layout может быть без padding-bottom
  background-color: #000; // Черный фон страницы, как на скриншоте
`;

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.md};
  position: sticky; // Или fixed, если нужно поверх контента
  top: 0;
  background-color: #000; // Или 약간 투명한 배경
  z-index: 10;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
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
  font-size: 14px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ActionIcon = styled.button`
  color: ${({ theme }) => theme.colors.textSecondary};
  &:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

const TokenHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.md};
  gap: ${({ theme }) => theme.space.sm};
`;

const TokenIconImg = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.border};
`;

const TokenNameDate = styled.div``;

const TokenName = styled.h1`
  font-size: 20px;
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 2px 0;
`;

const TokenDate = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const LiquidityInfo = styled.div`
  padding: 0 ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.sm};
`;

const LiquidityText = styled.div`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
`;

const LiquidityBarContainer = styled.div`
  width: 100%;
  height: 6px;
  background-color: ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.round};
  overflow: hidden;
`;

const LiquidityBarFill = styled.div<{$percentage: number}>`
  width: ${({ $percentage }) => $percentage}%;
  height: 100%;
  background-color: #A1F47B; // Светло-зеленый с вашего скриншота
  border-radius: ${({ theme }) => theme.radii.round};
`;

const PriceAndStats = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start; // Чтобы цена и статы были на одном уровне
  padding: ${({ theme }) => theme.space.md};
`;

const PriceInfo = styled.div``;

const MarketCapLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0 0 4px 0;
`;

const PriceLarge = styled.p`
  font-size: 32px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text};
  margin: 0;
  line-height: 1;
`;

const StatsInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  font-size: 13px;
  gap: 4px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  width: 140px; // Примерная ширина
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
  justify-content: space-between; // Для кнопки графика
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  background-color: #121212; // Немного темнее чем основной фон карточек
`;

const TimeframeButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.xs};
`;

const TimeframeButton = styled.button<{$active?: boolean}>`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  font-size: 13px;
  color: ${({ theme, $active }) => $active ? theme.colors.text : theme.colors.textSecondary};
  background-color: ${({ theme, $active }) => $active ? theme.colors.backgroundSecondary : 'transparent'};
  border-radius: ${({ theme }) => theme.radii.sm};
  border: 1px solid ${({ theme, $active }) => $active ? theme.colors.border : 'transparent'};
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderLight};
  }
`;

const PLInfo = styled.div`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  font-size: 12px;
  color: #D32F2F; // Красный для P&L
  background-color: rgba(211, 47, 47, 0.1);
  border-radius: ${({ theme }) => theme.radii.sm};
  margin: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  display: inline-block;
`;

const ChartContainer = styled.div`
  height: 250px; // Заглушка для графика
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  margin: 0 ${({ theme }) => theme.space.md} ${({ theme }) => theme.space.lg};
  border-radius: ${({ theme }) => theme.radii.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const ReactionsContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.xl}`};
`;

const ReactionButton = styled.button`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
  font-size: 14px;
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  border-radius: ${({ theme }) => theme.radii.round};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  
  svg {
    margin-right: 4px; // Отступ для иконки внутри кнопки
  }
`;

const TradeButtonsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  padding: ${({ theme }) => `${theme.space.md} ${theme.space.md}`};
`;

const BuyButton = styled(Button)`
  background-color: #A1F47B !important;
  color: #000 !important; // Черный текст на светло-зеленом
  font-weight: 600;
`;

const SellButton = styled(Button)`
  background-color: #FF4081 !important; // Розовый
  color: #fff !important;
  font-weight: 600;
`;

const BottomNav = styled.nav`
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: ${({ theme }) => theme.space.sm} 0;
  background-color: #121212; // Такой же как TimeframeSelector
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  position: sticky; // Или fixed, если нужно всегда внизу
  bottom: 0;
`;

const NavItem = styled.button<{$active?: boolean}>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  font-size: 10px;
  flex: 1;
  padding: ${({ theme }) => theme.space.xs} 0;
  
  svg {
    width: 22px;
    height: 22px;
    fill: currentColor;
  }
`;

// Dummy data - в реальном приложении будет приходить из API или store
const dummyTokenData = {
  id: 'toto',
  name: 'TOTO',
  date: '14 май',
  iconUrl: 'https://placekitten.com/80/80',
  contractAddress: 'EQCkR...v3Y-WH',
  liquidityPercentage: 55.87,
  liquidityRatio: '838.1/1,500 TON',
  marketCapLabel: 'Рыночная капитализация',
  marketCapUSD: '$10.3K',
  holders: '162',
  transactions: '3,018',
  volume: '$95.2K',
  pl: '-$1.23 -18.86%',
  telegramLink: 'https://t.me/yourtokenchat' // Добавим ссылку для кнопки чата
};

export default function TokenPage() {
  const router = useRouter();
  const { id: tokenId } = router.query;
  const [activeTimeframe, setActiveTimeframe] = useState('1мин');
  const [tokenData, setTokenData] = useState<any>(dummyTokenData); // Заменить any на тип токена

  // useEffect(() => {
  //   // Здесь будет логика загрузки данных токена по tokenId
  //   // Например, из useTokenStore или через API
  //   // const fetchedToken = useTokenStore.getState().tokens.find(t => t.id === tokenId);
  //   // if (fetchedToken) setTokenData(fetchedToken);
  //   // Для заглушки просто используем dummyTokenData, если tokenId совпадает
  //   if (tokenId === dummyTokenData.id) {
  //       setTokenData(dummyTokenData);
  //   } else {
  //       // Handle token not found, redirect or show error
  //       // router.push('/');
  //   }
  // }, [tokenId, router]);

  if (!tokenData) {
    return <Layout><PageContainer>Загрузка данных токена...</PageContainer></Layout>; // Или более красивый лоадер
  }
  
  const handleBack = () => router.back();
  const handleCopyAddress = () => navigator.clipboard.writeText(tokenData.contractAddress).then(() => alert('Адрес скопирован!'));
  const handleOpenExplorer = () => alert('Open in explorer (not implemented)');
  const handleMoreOptions = () => alert('More options (not implemented)');
  const handleWhatIsThis = () => alert('What is this? (not implemented)');
  const handleReaction = (reaction: string) => alert(`${reaction} clicked (not implemented)`);
  const handleBuy = () => alert('Buy clicked (not implemented)');
  const handleSell = () => alert('Sell clicked (not implemented)');
  const handleOpenChat = () => {
    if (tokenData.telegramLink) {
      window.open(tokenData.telegramLink, '_blank');
    } else {
      alert('Ссылка на чат не указана для этого токена');
    }
  }

  return (
    <Layout> {/* Обертка Layout нужна для общих стилей и темы, но ее BottomNavBar будет скрыт или не будет рендериться */}
      <PageContainer>
        <TopBar>
          <BackButton onClick={handleBack}><ArrowBackIcon size={20}/> Назад</BackButton>
          <TopBarActions>
            <AddressButton onClick={handleCopyAddress}>
              <CopyIcon size={14}/> {tokenData.contractAddress.substring(0,6)}...{tokenData.contractAddress.slice(-4)}
            </AddressButton>
            <ActionIcon onClick={handleOpenExplorer} title="Посмотреть в эксплорере"><ExternalLinkIcon size={20}/></ActionIcon>
            <ActionIcon onClick={handleMoreOptions} title="Дополнительно"><MoreVertIcon size={20}/></ActionIcon>
          </TopBarActions>
        </TopBar>

        <TokenHeader>
          <TokenIconImg src={tokenData.iconUrl} alt={tokenData.name} />
          <TokenNameDate>
            <TokenName>{tokenData.name}</TokenName>
            <TokenDate>{tokenData.date}</TokenDate>
          </TokenNameDate>
        </TokenHeader>

        <LiquidityInfo>
          <LiquidityText>
            {tokenData.liquidityPercentage}% {tokenData.liquidityRatio}
            <QuestionIcon size={14} style={{ marginLeft: 'auto', cursor:'pointer' }} onClick={handleWhatIsThis}/>
          </LiquidityText>
          <LiquidityBarContainer>
            <LiquidityBarFill $percentage={tokenData.liquidityPercentage} />
          </LiquidityBarContainer>
        </LiquidityInfo>

        <PriceAndStats>
          <PriceInfo>
            <MarketCapLabel>{tokenData.marketCapLabel}</MarketCapLabel>
            <PriceLarge>{tokenData.marketCapUSD}</PriceLarge>
          </PriceInfo>
          <StatsInfo>
            <StatRow><StatLabel>Холдеры</StatLabel><StatValue>{tokenData.holders}</StatValue></StatRow>
            <StatRow><StatLabel>Транзакции</StatLabel><StatValue>{tokenData.transactions}</StatValue></StatRow>
            <StatRow><StatLabel>Объем торговли</StatLabel><StatValue>{tokenData.volume}</StatValue></StatRow>
          </StatsInfo>
        </PriceAndStats>

        <TimeframeSelector>
          <TimeframeButtons>
            {['МКап', 'Цена', '1мин', '5мин', '15мин'].map(tf => (
              <TimeframeButton 
                key={tf} 
                $active={activeTimeframe === tf} 
                onClick={() => setActiveTimeframe(tf)}>
                {tf}
              </TimeframeButton>
            ))}
          </TimeframeButtons>
          <ActionIcon title="Настройки графика"><ChartIcon size={20}/></ActionIcon> {/* Иконка настроек графика */} 
        </TimeframeSelector>

        {activeTimeframe !== 'МКап' && activeTimeframe !== 'Цена' && (
            <PLInfo>{tokenData.pl}</PLInfo>
        )}

        <ChartContainer>
          Заглушка для графика {activeTimeframe}
        </ChartContainer>

        <ReactionsContainer>
          <ReactionButton onClick={() => handleReaction('Star')}><StarIcon /> {179}</ReactionButton>
          <ReactionButton onClick={() => handleReaction('Fire')}><FireIcon /> {123}</ReactionButton>
          <ReactionButton onClick={() => handleReaction('BrokenHeart')}><BrokenHeartIcon /> {22}</ReactionButton>
        </ReactionsContainer>

        <TradeButtonsContainer>
          <BuyButton fullWidth size="large" onClick={handleBuy}>Купить</BuyButton>
          <SellButton fullWidth size="large" onClick={handleSell}>Продать</SellButton>
        </TradeButtonsContainer>
        
        {/* Нижняя навигация специфичная для этой страницы. Layout свою не покажет или она будет перекрыта */}
        <BottomNav>
          <NavItem $active={true}><ChartIcon /> Торговать</NavItem>
          <NavItem onClick={() => alert('Info tab clicked')}><InfoIcon /> Инфо</NavItem>
          <NavItem onClick={handleOpenChat}><ChatIcon /> Чат</NavItem>
        </BottomNav>
      </PageContainer>
    </Layout>
  );
} 