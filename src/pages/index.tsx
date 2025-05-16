import React from 'react';
import styled from 'styled-components';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useRouter } from 'next/router';
import { useTon } from '@/hooks/useTon';
import { PageHeader } from '@/components/PageHeader';

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
  // Здесь можно будет разместить иконки и цифры как на скриншоте
`;

const TokenMarketCapAndTime = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  margin-left: ${({ theme }) => theme.space.sm};
`;

const TokenMarketCap = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: #4CAF50; // Зеленый цвет для MK
`;

const TokenTime = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
  // Иконка "недоступно" или время
`;

// Заглушка данных для биржи
const dummyTokens = [
  { id: 'eat', iconUrl: 'https://placekitten.com/40/40', name: 'EAT Token Super Long Name Here', stats: '👁 0  💬 2', marketCap: '$1.5K', time: '🚫 48с' },
  { id: 'wolfton', iconUrl: 'https://placekitten.com/41/41', name: 'WOLFTON', stats: '👁 11  💬 25', marketCap: '$4.5K', time: '⏱ 3мин' },
  { id: 'trilo333', iconUrl: 'https://placekitten.com/42/42', name: 'TRILO333', stats: '👁 7  💬 13', marketCap: '$1.5K', time: '🚫 10мин' },
  { id: 'duk', iconUrl: 'https://placekitten.com/43/43', name: 'DUK', stats: '👁 3  💬 6', marketCap: '$1.5K', time: '🚫 14мин' },
];

// Компонент для отображения биржи
const ExchangeView: React.FC<{router: any}> = ({ router }) => {
  const [activeTab, setActiveTab] = React.useState('New');

  const handleTokenClick = (tokenId: string) => {
    router.push(`/token/${tokenId}`);
  };

  return (
    <ExchangeContainer>
      <ExchangeHeader>
        <TabContainer>
          <TabButton $active={activeTab === 'New'} onClick={() => setActiveTab('New')}>New</TabButton>
          <TabButton $active={activeTab === 'DEX'} onClick={() => setActiveTab('DEX')}>DEX</TabButton>
          <TabButton $active={activeTab === 'MCap'} onClick={() => setActiveTab('MCap')}>MCap</TabButton>
        </TabContainer>
        <SearchIcon onClick={() => alert('Search clicked (not implemented)')}>🔍</SearchIcon> 
      </ExchangeHeader>
      <TokenList>
        {dummyTokens.map((token) => (
          <TokenRow key={token.id} onClick={() => handleTokenClick(token.id)}>
            <TokenIcon src={token.iconUrl} alt={token.name} />
            <TokenNameAndStats>
              <TokenName>{token.name}</TokenName>
              <TokenStats>{token.stats}</TokenStats>
            </TokenNameAndStats>
            <TokenMarketCapAndTime>
              <TokenMarketCap>{token.marketCap}</TokenMarketCap>
              <TokenTime>{token.time}</TokenTime>
            </TokenMarketCapAndTime>
          </TokenRow>
        ))}
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