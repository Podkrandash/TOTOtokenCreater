import React from 'react';
import styled from 'styled-components';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useRouter } from 'next/router';
import { useTonConnectUI } from '@tonconnect/ui-react';

const Hero = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.space.xxl};
`;

const HeroTitle = styled.h1`
  font-size: 48px;
  margin-bottom: ${({ theme }) => theme.space.md};
  
  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const HeroSubtitle = styled.p`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 700px;
  margin: 0 auto ${({ theme }) => theme.space.lg};
  line-height: 1.5;
`;

const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.space.lg};
  margin-bottom: ${({ theme }) => theme.space.xxl};
`;

const FeatureCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.space.lg};
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
`;

const FeatureTitle = styled.h3`
  margin-bottom: ${({ theme }) => theme.space.sm};
  font-size: 20px;
`;

const FeatureText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.5;
`;

const CTA = styled.div`
  text-align: center;
  margin-top: ${({ theme }) => theme.space.xxl};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  justify-content: center;
  margin-top: ${({ theme }) => theme.space.lg};
  
  @media (max-width: 600px) {
    flex-direction: column;
    align-items: center;
  }
`;

export default function Home() {
  const router = useRouter();
  const [tonConnectUI] = useTonConnectUI();
  
  const features = [
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
    if (tonConnectUI) {
      await tonConnectUI.connectWallet();
    }
  };
  
  const isWalletConnected = tonConnectUI && tonConnectUI.wallet;
  
  return (
    <Layout>
      <Hero>
        <HeroTitle>
          Создавайте <span>Jetton токены</span> на блокчейне TON
        </HeroTitle>
        <HeroSubtitle>
          TOTO Trade - простая платформа для создания и управления Jetton токенами на блокчейне TON.
          Никакого кода, только несколько простых шагов для запуска вашего токена.
        </HeroSubtitle>
        <ButtonGroup>
          {isWalletConnected ? (
            <Button size="large" onClick={() => router.push('/create')}>
              Создать токен
            </Button>
          ) : (
            <Button size="large" onClick={handleConnect}>
              Подключить кошелек
            </Button>
          )}
          <Button size="large" variant="outline" onClick={() => router.push('/manage')}>
            Управление токенами
          </Button>
        </ButtonGroup>
      </Hero>
      
      <Features>
        {features.map((feature, index) => (
          <FeatureCard key={index}>
            <FeatureIcon>{feature.icon}</FeatureIcon>
            <FeatureTitle>{feature.title}</FeatureTitle>
            <FeatureText>{feature.text}</FeatureText>
          </FeatureCard>
        ))}
      </Features>
      
      <CTA>
        <HeroTitle>
          Готовы начать?
        </HeroTitle>
        <HeroSubtitle>
          Подключите свой TON кошелек и создайте свой первый токен прямо сейчас!
        </HeroSubtitle>
        <Button size="large" onClick={isWalletConnected ? () => router.push('/create') : handleConnect}>
          {isWalletConnected ? 'Создать токен' : 'Подключить кошелек'}
        </Button>
      </CTA>
    </Layout>
  );
} 