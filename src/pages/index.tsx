import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useRouter } from 'next/router';
import { useTon } from '@/hooks/useTon';
import { PageHeader } from '@/components/PageHeader';
import { useTokenStore, JettonToken } from '@/store/tokenStore';
import { 
  fetchAllTokens, 
  fetchPopularTokens, 
  fetchNewTokens, 
  startTokenPriceUpdates, 
  stopTokenPriceUpdates,
  MarketTokenData
} from '@/services/tokenService';

const Hero = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space.xl};
  
  @media (max-width: 480px) {
    margin-bottom: ${({ theme }) => theme.space.lg};
  }
`;

const HeroTitle = styled.h1`
  font-size: min(48px, 10vw); // Адаптивный размер шрифта
  margin-bottom: ${({ theme }) => theme.space.md};
  line-height: 1.2;
  
  span {
    color: ${({ theme }) => theme.colors.primary};
  }
  
  @media (max-width: 480px) {
    font-size: min(32px, 8vw);
    margin-bottom: ${({ theme }) => theme.space.sm};
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 700px;
  margin: 0 auto ${({ theme }) => theme.space.lg};
  line-height: 1.5;
  
  @media (max-width: 480px) {
    font-size: 16px;
    margin-bottom: ${({ theme }) => theme.space.md};
  }
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.space.md};
  margin-bottom: ${({ theme }) => theme.space.xl};
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.space.sm};
    margin-bottom: ${({ theme }) => theme.space.lg};
  }
`;

const FeatureCardStyled = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.space.lg};
  
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.space.md};
  }
`;

const FeatureIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: rgba(0, 136, 204, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.space.md};
  font-size: 24px;
  color: ${({ theme }) => theme.colors.primary};
  
  @media (max-width: 480px) {
    width: 48px;
    height: 48px;
    font-size: 20px;
    margin-bottom: ${({ theme }) => theme.space.sm};
  }
`;

const FeatureTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.space.sm};
  font-size: 20px;
  
  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const FeatureText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
  font-size: 16px;
  
  @media (max-width: 480px) {
    font-size: 14px;
  }
`;

const CTA = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.space.xl};
  
  @media (max-width: 480px) {
    margin-top: ${({ theme }) => theme.space.lg};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  justify-content: center;
  margin-top: ${({ theme }) => theme.space.lg};
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
    gap: ${({ theme }) => theme.space.sm};
    margin-top: ${({ theme }) => theme.space.md};
  }
`;

const ExchangeContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const ExchangeHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between; // Для будущей кнопки поиска
  margin-bottom: ${({ theme }) => theme.space.lg};
  // Стили для табов (New, Listings, Hot, Bluming) можно добавить здесь
  // Например, через вложенный styled component
`;

const TabContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
  align-items: center;
  overflow-x: auto; // Для мобильных, если табы не влезают
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;

const TabButton = styled.button<{$active?: boolean}>`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.md}`};
  font-size: 16px; // Можно уменьшить для мобильных, если нужно
  font-weight: 500;
  color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.textSecondary};
  background-color: transparent;
  border: none;
  border-bottom: 2px solid ${({ theme, $active }) => $active ? theme.colors.primary : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap; // Чтобы текст таба не переносился

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SearchIcon = styled.div`
  width: 28px;
  height: 28px;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  display: flex; 
  align-items: center; 
  justify-content:center;
  font-size: 22px; // Размер символа
  border-radius: ${({ theme }) => theme.radii.md};
  transition: background-color 0.2s ease, color 0.2s ease;
  flex-shrink: 0; // Чтобы иконка не сжималась

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.backgroundGlass};
  }
`;

const TokenList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.sm};
`;

const TokenRow = styled.div`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.space.sm} 0; // Отступы только сверху/снизу
  // background-color: ${({ theme }) => theme.colors.background}; // Немного другой фон для строки
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundGlass};
  }

  &:last-child {
    border-bottom: none;
  }
`;

const TokenIcon = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.border}; // Placeholder color
`;

const TokenNameAndStats = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0; // Для корректного text-overflow
`;

const TokenName = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TokenStats = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.xs};
`;

const TokenPrice = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const TokenChange = styled.div<{$positive?: boolean}>`
  font-size: 12px;
  color: ${({ theme, $positive }) => 
    $positive ? theme.colors.success : theme.colors.error};
  margin-left: auto;
  padding-right: ${({ theme }) => theme.space.sm};
`;

const TokenMarketCap = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-right: ${({ theme }) => theme.space.sm};
`;

// Торговый интерфейс
const TradeInterface = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
  margin-left: auto;
  align-items: center;
`;

const TradeButton = styled.button<{$buy?: boolean}>`
  padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
  background: ${({ theme, $buy }) => $buy ? theme.colors.success + '20' : theme.colors.error + '20'};
  color: ${({ theme, $buy }) => $buy ? theme.colors.success : theme.colors.error};
  border: 1px solid ${({ theme, $buy }) => $buy ? theme.colors.success : theme.colors.error};
  border-radius: ${({ theme }) => theme.radii.sm};
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${({ theme, $buy }) => $buy ? theme.colors.success + '40' : theme.colors.error + '40'};
  }
`;

// Индикатор обновления цен
const UpdateIndicator = styled.div<{$updating?: boolean}>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${({ theme, $updating }) => 
    $updating ? theme.colors.success : theme.colors.textSecondary};
  opacity: ${({ $updating }) => $updating ? 1 : 0.5};
  margin-left: ${({ theme }) => theme.space.sm};
  transition: all 0.2s ease;
  position: relative;
  
  &:after {
    content: '';
    display: ${({ $updating }) => $updating ? 'block' : 'none'};
    position: absolute;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.success};
    opacity: 0.3;
    top: -4px;
    left: -4px;
    animation: pulse 1.5s infinite;
  }
  
  @keyframes pulse {
    0% {
      transform: scale(0.8);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.15;
    }
    100% {
      transform: scale(0.8);
      opacity: 0.3;
    }
  }
`;

// Модальное окно для торговли
const TradeModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.space.md};
`;

const TradeModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space.lg};
  max-width: 450px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const TradeModalHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const TradeModalTitle = styled.h2`
  margin: 0;
  font-size: 20px;
  flex: 1;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.textSecondary};
  
  &:hover {
    color: ${({ theme }) => theme.colors.text};
  }
`;

const TradeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
`;

const AmountInput = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.xs};
`;

const InputLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InputGroup = styled.div`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  overflow: hidden;
`;

const Input = styled.input`
  flex: 1;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  border: none;
  outline: none;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
`;

const InputSuffix = styled.div`
  display: flex;
  align-items: center;
  padding: 0 ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.backgroundGlass};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-weight: 500;
  min-width: 80px;
  justify-content: center;
`;

const TradeInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  padding: ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-top: ${({ theme }) => theme.space.sm};
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const TradeInfoRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: ${({ theme }) => theme.space.xs};
  font-size: 14px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const TradeInfoLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const TradeInfoValue = styled.span`
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const TradeButtonLarge = styled.button<{$buy?: boolean}>`
  padding: ${({ theme }) => `${theme.space.md}`};
  background-color: ${({ theme, $buy }) => $buy ? theme.colors.success : theme.colors.error};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.radii.md};
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    opacity: 0.9;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// Компонент для отображения биржи
const ExchangeView: React.FC<{router: any}> = ({ router }) => {
  const [activeTab, setActiveTab] = useState('new');
  const { tokens } = useTokenStore();
  const { wallet } = useTon();
  const [marketTokens, setMarketTokens] = useState<MarketTokenData[]>([]);
  const [newTokens, setNewTokens] = useState<MarketTokenData[]>([]);
  const [popularTokens, setPopularTokens] = useState<MarketTokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Состояние для торговой модалки
  const [tradeModal, setTradeModal] = useState<{
    isOpen: boolean;
    token: MarketTokenData | null;
    action: 'buy' | 'sell' | null;
  }>({
    isOpen: false,
    token: null,
    action: null
  });
  const [tradeAmount, setTradeAmount] = useState('');
  
  // Загружаем токены при первом рендере
  useEffect(() => {
    const loadTokens = async () => {
      setIsLoading(true);
      try {
        const [allTokens, newTokensList, popularTokensList] = await Promise.all([
          fetchAllTokens(),
          fetchNewTokens(),
          fetchPopularTokens()
        ]);
        
        setMarketTokens(allTokens);
        setNewTokens(newTokensList);
        setPopularTokens(popularTokensList);
      } catch (error) {
        console.error('Ошибка при загрузке токенов:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadTokens();
    
    // Запускаем автоматическое обновление цен
    startTokenPriceUpdates(() => {
      setIsUpdating(true);
      
      // Перезагружаем данные
      loadTokens().then(() => {
        setTimeout(() => setIsUpdating(false), 1000);
      });
    });
    
    // Очищаем при размонтировании
    return () => {
      stopTokenPriceUpdates();
    };
  }, []);

  const handleTokenClick = (tokenId: string) => {
    // При клике переходим на страницу токена
    router.push(`/token/${tokenId}`);
  };
  
  const handleTradeClick = (e: React.MouseEvent, action: 'buy' | 'sell', token: MarketTokenData) => {
    e.stopPropagation(); // Предотвращаем всплытие события
    setTradeModal({
      isOpen: true,
      token,
      action
    });
    setTradeAmount(''); // Сбрасываем сумму при открытии модалки
  };
  
  const closeTradeModal = () => {
    setTradeModal({
      isOpen: false,
      token: null,
      action: null
    });
  };
  
  const executeTrade = () => {
    if (!tradeModal.token || !tradeModal.action || !tradeAmount) return;
    
    // В реальном приложении здесь было бы API для торговли
    alert(
      `${tradeModal.action === 'buy' ? 'Покупка' : 'Продажа'} ${tradeAmount} ${tradeModal.token.symbol} успешно выполнена!`
    );
    
    closeTradeModal();
  };

  // Определяем, какие токены отображать в зависимости от выбранной вкладки
  let displayedTokens;
  switch (activeTab) {
    case 'new':
      displayedTokens = newTokens;
      break;
    case 'popular':
      displayedTokens = popularTokens;
      break;
    case 'my':
      displayedTokens = tokens;
      break;
    default:
      displayedTokens = newTokens;
  }

  // Расчет стоимости в модальном окне
  const calculateTradeDetails = () => {
    if (!tradeModal.token || !tradeAmount) {
      return { total: '0', fee: '0', receive: '0' };
    }
    
    const amount = parseFloat(tradeAmount);
    if (isNaN(amount)) {
      return { total: '0', fee: '0', receive: '0' };
    }
    
    const price = parseFloat(tradeModal.token.price.replace(' TON', ''));
    const total = amount * price;
    const fee = total * 0.005; // 0.5% комиссия
    
    return {
      total: total.toFixed(2),
      fee: fee.toFixed(2),
      receive: tradeModal.action === 'buy' 
        ? amount.toFixed(2) 
        : (total - fee).toFixed(2)
    };
  };
  
  const { total, fee, receive } = calculateTradeDetails();

  return (
    <ExchangeContainer>
      <ExchangeHeader>
        <TabContainer>
          <TabButton 
            $active={activeTab === 'new'} 
            onClick={() => setActiveTab('new')}
          >
            New
          </TabButton>
          <TabButton 
            $active={activeTab === 'popular'} 
            onClick={() => setActiveTab('popular')}
          >
            Популярные
          </TabButton>
          <TabButton 
            $active={activeTab === 'my'} 
            onClick={() => setActiveTab('my')}
          >
            Мои токены
          </TabButton>
        </TabContainer>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <SearchIcon>🔍</SearchIcon>
          <UpdateIndicator $updating={isUpdating} title={isUpdating ? 'Обновление цен...' : 'Цены в реальном времени'} />
        </div>
      </ExchangeHeader>

      <TokenList>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            Загрузка токенов...
          </div>
        ) : displayedTokens.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            {activeTab === 'popular' ? 'Популярные токены не найдены' : 
             activeTab === 'new' ? 'Новые токены не найдены' :
             'У вас пока нет токенов. Создайте свой первый токен!'}
          </div>
        ) : (
          displayedTokens.map((token) => (
            <TokenRow key={token.id} onClick={() => handleTokenClick(token.id)}>
              <TokenIcon src={token.image || '/placeholder-token.png'} alt={token.name} />
              <TokenNameAndStats>
                <TokenName>{token.name} ({token.symbol})</TokenName>
                <TokenStats>
                  {activeTab !== 'my' ? (
                    <>
                      <TokenPrice>{(token as any).price}</TokenPrice>
                      <TokenMarketCap>MC: {(token as any).marketCap}</TokenMarketCap>
                    </>
                  ) : (
                    `Адрес: ${token.contractAddress ? token.contractAddress.slice(0, 10) + '...' : 'Обработка...'}`
                  )}
                </TokenStats>
              </TokenNameAndStats>
              {activeTab !== 'my' ? (
                <>
                  <TokenChange $positive={(token as any).change.startsWith('+')}>
                    {(token as any).change}
                  </TokenChange>
                  <TradeInterface>
                    <TradeButton $buy onClick={(e) => handleTradeClick(e, 'buy', token)}>
                      Купить
                    </TradeButton>
                    <TradeButton onClick={(e) => handleTradeClick(e, 'sell', token)}>
                      Продать
                    </TradeButton>
                  </TradeInterface>
                </>
              ) : null}
            </TokenRow>
          ))
        )}
      </TokenList>
      
      {/* Модальное окно торговли */}
      {tradeModal.isOpen && tradeModal.token && (
        <TradeModal onClick={closeTradeModal}>
          <TradeModalContent onClick={(e) => e.stopPropagation()}>
            <TradeModalHeader>
              <TradeModalTitle>
                {tradeModal.action === 'buy' ? 'Купить' : 'Продать'} {tradeModal.token.symbol}
              </TradeModalTitle>
              <CloseButton onClick={closeTradeModal}>×</CloseButton>
            </TradeModalHeader>
            
            <TradeForm onSubmit={(e) => { e.preventDefault(); executeTrade(); }}>
              <AmountInput>
                <InputLabel>Количество</InputLabel>
                <InputGroup>
                  <Input 
                    type="number" 
                    placeholder="0.00" 
                    value={tradeAmount} 
                    onChange={(e) => setTradeAmount(e.target.value)}
                    autoFocus
                    min="0"
                    step="0.01"
                  />
                  <InputSuffix>{tradeModal.token.symbol}</InputSuffix>
                </InputGroup>
              </AmountInput>
              
              {tradeAmount && (
                <TradeInfo>
                  <TradeInfoRow>
                    <TradeInfoLabel>Цена</TradeInfoLabel>
                    <TradeInfoValue>{tradeModal.token.price}</TradeInfoValue>
                  </TradeInfoRow>
                  <TradeInfoRow>
                    <TradeInfoLabel>Сумма</TradeInfoLabel>
                    <TradeInfoValue>{total} TON</TradeInfoValue>
                  </TradeInfoRow>
                  <TradeInfoRow>
                    <TradeInfoLabel>Комиссия (0.5%)</TradeInfoLabel>
                    <TradeInfoValue>{fee} TON</TradeInfoValue>
                  </TradeInfoRow>
                  <TradeInfoRow>
                    <TradeInfoLabel>Вы {tradeModal.action === 'buy' ? 'получите' : 'отправите'}</TradeInfoLabel>
                    <TradeInfoValue>
                      {tradeModal.action === 'buy' ? `${receive} ${tradeModal.token.symbol}` : `${receive} TON`}
                    </TradeInfoValue>
                  </TradeInfoRow>
                </TradeInfo>
              )}
              
              <TradeButtonLarge 
                $buy={tradeModal.action === 'buy'} 
                type="submit"
                disabled={!tradeAmount || parseFloat(tradeAmount) <= 0}
              >
                {tradeModal.action === 'buy' ? 'Купить' : 'Продать'} {tradeModal.token.symbol}
              </TradeButtonLarge>
            </TradeForm>
          </TradeModalContent>
        </TradeModal>
      )}
    </ExchangeContainer>
  );
};

export default function Home() {
  const router = useRouter();
  const { connected, wallet, isConnectionRestoring, connect } = useTon();
  
  const oldFeatures = [
    {
      icon: '🚀',
      title: 'Быстрое создание',
      text: 'Создавайте токены Jetton на блокчейне TON в несколько кликов без навыков программирования.'
    },
    {
      icon: '🔒',
      title: 'Безопасность',
      text: 'Все токены создаются напрямую в блокчейне TON. Мы не храним ваши ключи или средства.'
    },
    {
      icon: '⚙️',
      title: 'Управление',
      text: 'Полный контроль над вашими токенами: настройка, выпуск, сжигание, и многое другое.'
    },
  ];
  
  const handleConnect = async () => {
    await connect();
  };
  
  if (isConnectionRestoring) {
    return (
      <Layout>
        <PageHeader title="Загрузка..." />
        <div style={{ textAlign: 'center', padding: '50px' }}>Загрузка состояния кошелька...</div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <PageHeader title={connected ? "Token Exchange" : "Главная"} />
      {connected ? (
        <ExchangeView router={router} />
      ) : (
        <>
          <Hero>
            <HeroTitle>
              Создавайте <span>Jetton токены</span> на блокчейне TON
            </HeroTitle>
            <HeroSubtitle>
              TOTO Trade - простая платформа для создания и управления Jetton токенами на блокчейне TON.
              Никакого кода, только несколько простых шагов.
            </HeroSubtitle>
            <ButtonGroup>
                <Button size="large" onClick={handleConnect}>
                  Подключить кошелек
                </Button>
              <Button size="large" variant="outline" onClick={() => router.push('/manage')}>
                Управление токенами
              </Button>
            </ButtonGroup>
          </Hero>
          
          <Features>
            {oldFeatures.map((feature, index) => (
              <FeatureCardStyled key={index}>
                <FeatureIcon>{feature.icon}</FeatureIcon>
                <FeatureTitle>{feature.title}</FeatureTitle>
                <FeatureText>{feature.text}</FeatureText>
              </FeatureCardStyled>
            ))}
          </Features>
          
          <CTA>
            <HeroTitle>
              Готовы начать?
            </HeroTitle>
            <HeroSubtitle>
              Подключите свой TON кошелек и создайте свой первый токен прямо сейчас!
            </HeroSubtitle>
            <Button size="large" onClick={handleConnect}>
              Подключить кошелек
            </Button>
          </CTA>
        </>
      )}
    </Layout>
  );
} 