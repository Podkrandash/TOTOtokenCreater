import React from 'react';
import styled from 'styled-components';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useRouter } from 'next/router';
import { useTon } from '@/hooks/useTon';
import { PageHeader } from '@/components/PageHeader';
import { useTokenStore, JettonToken } from '@/store/tokenStore';

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

// Добавляю массив популярных токенов
const popularTokens = [
  {
    id: 'dex',
    name: 'DeDust DEX',
    symbol: 'DEX',
    description: 'Токен децентрализованной биржи DeDust',
    image: 'https://dedust.io/assets/DustIcon.svg',
    contractAddress: 'EQCcw6hha5out7hfTiGkQM8E5jxCKCGHoY35bRUm-C5Fqkqu',
    marketCap: '10M$',
    price: '2.41 TON',
    change: '+5.3%',
  },
  {
    id: 'dust',
    name: 'DeDust DUST',
    symbol: 'DUST',
    description: 'Нативный токен экосистемы DeDust',
    image: 'https://dedust.io/logo.svg',
    contractAddress: 'EQAvDfWFG0oYX19jwNDNBBL1rKNT9XfaGP9HyTb5nb2Eml6y',
    marketCap: '15M$',
    price: '3.85 TON',
    change: '+2.7%',
  },
  {
    id: 'bolt',
    name: 'Scaleton BOLT',
    symbol: 'BOLT',
    description: 'Токен платформы Scaleton',
    image: 'https://scaleton.io/logo.png',
    contractAddress: 'EQD2NmD_lH5f5u1Kj3KfGyTvhZSX0Eg6qp2a5IQUKXxOG7dn',
    marketCap: '8M$',
    price: '1.15 TON',
    change: '+12.4%',
  },
  {
    id: 'ton',
    name: 'Wrapped TON',
    symbol: 'wTON',
    description: 'Обернутые TON внутри сети TON',
    image: 'https://ton.org/download/ton_symbol.png',
    contractAddress: 'EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez',
    marketCap: '120M$',
    price: '1.00 TON',
    change: '0.0%',
  },
];

// Новые токены на DEX
const newTokens = [
  {
    id: 'new_token_1',
    name: 'RocketFi',
    symbol: 'RCKT',
    description: 'Новый DeFi токен на TON',
    image: 'https://ton.org/images/tokens/rocket.png',
    contractAddress: 'EQBxUa7tkMwnYbMtUkQQZ7jBankfNhrpWLQvLxLBuhKB_8Qq',
    marketCap: '2.5M$',
    price: '0.75 TON',
    change: '+23.4%',
    launchDate: '2023-11-15',
  },
  {
    id: 'new_token_2',
    name: 'MetaTON',
    symbol: 'META',
    description: 'Метавселенная на TON',
    image: 'https://ton.org/images/tokens/meta.png',
    contractAddress: 'EQD8dJyIQfvCkRGt-drqxM_w-CmVpR7YvGTkOagMiZCqM9h2',
    marketCap: '1.8M$',
    price: '1.21 TON',
    change: '+8.7%',
    launchDate: '2023-11-18',
  },
  {
    id: 'new_token_3',
    name: 'TONPlay',
    symbol: 'PLAY',
    description: 'Игровой токен экосистемы TON',
    image: 'https://ton.org/images/tokens/play.png',
    contractAddress: 'EQAkyZ6ylINDgpZqJVIPbovIKZ3tBmnsuWnv7sxHq7IMV0BV',
    marketCap: '5.2M$',
    price: '3.45 TON',
    change: '+15.2%',
    launchDate: '2023-11-20',
  },
  {
    id: 'new_token_4',
    name: 'TONPay',
    symbol: 'TPAY',
    description: 'Платежный токен на TON',
    image: 'https://ton.org/images/tokens/pay.png',
    contractAddress: 'EQCXsNYsPk9oYLxv2aYZbm2rYV2ke6HoNpX_2dhkmwc5zxdY',
    marketCap: '3.7M$',
    price: '1.85 TON',
    change: '+6.3%',
    launchDate: '2023-11-22',
  },
];

const EmptyStateContainer = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => theme.space.xl};
  margin-top: ${({ theme }) => theme.space.md};
  border: 1px dashed ${({ theme }) => theme.colors.borderLight};
  background-color: transparent;
`;

const EmptyStateIcon = styled.div`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.space.md};
  opacity: 0.5;
`;

const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 16px;
  line-height: 1.5;
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

// Компонент для отображения биржи
const ExchangeView: React.FC<{router: any}> = ({ router }) => {
  const [activeTab, setActiveTab] = React.useState('new');
  const { tokens } = useTokenStore();
  const { wallet } = useTon();

  const handleTokenClick = (tokenId: string) => {
    router.push(`/token/${tokenId}`);
  };
  
  const handleTradeClick = (e: React.MouseEvent, action: 'buy' | 'sell', token: any) => {
    e.stopPropagation(); // Предотвращаем всплытие события (не переходим на страницу токена)
    alert(`${action === 'buy' ? 'Покупка' : 'Продажа'} ${token.symbol} в разработке`);
    // Здесь будет логика для открытия торгового интерфейса
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
        <SearchIcon>🔍</SearchIcon>
      </ExchangeHeader>

      <TokenList>
        {displayedTokens.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            {activeTab === 'popular' ? 'Загрузка популярных токенов...' : 
             activeTab === 'new' ? 'Загрузка новых токенов...' :
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
    </ExchangeContainer>
  );
}

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