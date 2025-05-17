import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/Button';
import { useRouter } from 'next/router';
import { useTon } from '@/hooks/useTon';
import { PageHeader } from '@/components/PageHeader';

// Стили для модального окна
const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space.lg};
  max-width: 450px;
  width: 90%;
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.md};
`;

const ModalTitle = styled.h3`
  margin: 0;
  font-size: 22px;
  color: ${({ theme }) => theme.colors.primary};
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

const ModalBody = styled.div`
  margin-bottom: ${({ theme }) => theme.space.lg};
  
  p {
    margin-bottom: ${({ theme }) => theme.space.sm};
    line-height: 1.5;
  }
  
  strong {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TokenInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.radii.md};
  padding: ${({ theme }) => theme.space.md};
  margin: ${({ theme }) => theme.space.md} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
`;

const TokenIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 16px;
`;

const TokenDetails = styled.div``;

const TokenName = styled.div`
  font-weight: bold;
  font-size: 16px;
`;

const TokenSymbol = styled.div`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
`;

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

const FeatureCardStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: ${({ theme }) => theme.space.lg};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
  
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

export default function Home() {
  const router = useRouter();
  const { connected, wallet, isConnectionRestoring, connect } = useTon();
  const [showModal, setShowModal] = useState(false);
  
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
  
  // Проверяем, нужно ли показать модальное окно при первой загрузке
  useEffect(() => {
    const hasSeenModal = localStorage.getItem('tonger_announcement_seen');
    if (!hasSeenModal) {
      setShowModal(true);
      // Установим флаг, чтобы больше не показывать окно
      localStorage.setItem('tonger_announcement_seen', 'true');
    }
  }, []);

  const handleCloseModal = () => {
    setShowModal(false);
  };
  
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
      {showModal && (
        <Modal>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Отличные новости!</ModalTitle>
              <CloseButton onClick={handleCloseModal}>×</CloseButton>
            </ModalHeader>
            <ModalBody>
              <p>Мы рады сообщить, что токен <strong>Tonger (TGR)</strong> теперь доступен на бирже Blum!</p>
              <p>Вы можете приобрести токены или узнать больше о проекте на официальном сайте биржи.</p>
              
              <TokenInfo>
                <TokenIcon>T</TokenIcon>
                <TokenDetails>
                  <TokenName>Tonger</TokenName>
                  <TokenSymbol>TGR</TokenSymbol>
                </TokenDetails>
              </TokenInfo>
              
              <p>Благодарим за поддержку нашего проекта!</p>
            </ModalBody>
            <Button fullWidth onClick={handleCloseModal}>Понятно</Button>
          </ModalContent>
        </Modal>
      )}
      
      <PageHeader title="Главная" />
      <Hero>
        <HeroTitle>
          Создавайте <span>Jetton токены</span> на блокчейне TON
        </HeroTitle>
        <HeroSubtitle>
          Tonger - простая платформа для создания и управления Jetton токенами на блокчейне TON.
          Никакого кода, только несколько простых шагов.
        </HeroSubtitle>
        <ButtonGroup>
          {!connected ? (
            <Button size="large" onClick={handleConnect}>
              Подключить кошелек
            </Button>
          ) : (
            <Button size="large" onClick={() => router.push('/create')}>
              Создать токен
            </Button>
          )}
          <Button size="large" variant="outline" onClick={() => router.push('/manage')}>
            Управление токенами
          </Button>
        </ButtonGroup>
      </Hero>
      
      <Features>
        {features.map((feature, index) => (
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
          {connected 
            ? 'Создайте свой первый Jetton и начните управлять им прямо сейчас!'
            : 'Подключите свой TON кошелек и создайте свой первый токен прямо сейчас!'}
        </HeroSubtitle>
        {!connected ? (
          <Button size="large" onClick={handleConnect}>
            Подключить кошелек
          </Button>
        ) : (
          <Button size="large" onClick={() => router.push('/create')}>
            Создать токен
          </Button>
        )}
      </CTA>
    </Layout>
  );
} 