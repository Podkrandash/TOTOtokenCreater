import React, { useState } from 'react';
import { Layout } from '@/components/Layout';
// import { CreateTokenForm } from '@/components/CreateTokenForm'; // Будет заменено на шаги
import { useTonConnectUI } from '@tonconnect/ui-react';
import styled from 'styled-components';
import { Button } from '@/components/Button';
import { PageHeader } from '@/components/PageHeader';
import { TokenInfoStep } from '@/components/TokenCreationSteps/TokenInfoStep';
import { SocialLinksStep } from '@/components/TokenCreationSteps/SocialLinksStep';
import { LiquidityStep } from '@/components/TokenCreationSteps/LiquidityStep';
import { ReviewAndLaunchStep } from '@/components/TokenCreationSteps/ReviewAndLaunchStep';
import { useTon } from '@/hooks/useTon';
import { useTokenStore, JettonToken } from '@/store/tokenStore';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/router'; // Импортируем useRouter для перенаправления

const ConnectWalletContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: ${({ theme }) => `${theme.space.xl} ${theme.space.sm}`};
  max-width: 100%;
`;

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.space.md};
  font-size: 28px;
  
  @media (max-width: 480px) {
    font-size: 24px;
    margin-bottom: ${({ theme }) => theme.space.sm};
  }
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.space.lg};
  max-width: 500px;
  line-height: 1.5;
  
  @media (max-width: 480px) {
    font-size: 15px;
    margin-bottom: ${({ theme }) => theme.space.md};
  }
`;

export interface TokenCreationData {
  iconUrl?: string;
  name?: string;
  ticker?: string;
  description?: string;
  telegram?: string;
  twitter?: string;
  website?: string;
  // socials?: Array<{ platform: string; link: string }>; // Альтернатива для соц.сетей
  liquidityTonAmount?: number;
  // Для CreateTokenForm (старые поля, могут быть нужны для createJetton)
  decimals?: number; 
  amount?: number;   
}

export default function CreateTokenPage() {
  const [tonConnectUI] = useTonConnectUI();
  const { createJetton, wallet } = useTon();
  const { addToken } = useTokenStore();
  const router = useRouter(); // Инициализируем useRouter

  const initialFormData: TokenCreationData = {
    decimals: 9,
    amount: 1000000000,
    name: '',
    ticker: '',
    description: '',
    iconUrl: '',
    telegram: '',
    twitter: '',
    website: '',
    liquidityTonAmount: 0,
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TokenCreationData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [submissionSuccess, setSubmissionSuccess] = useState<string | null>(null);
  
  const handleConnect = async () => {
    if (tonConnectUI) {
      await tonConnectUI.connectWallet();
    }
  };
  
  const isWalletConnected = tonConnectUI && tonConnectUI.wallet;

  const handleNextStep = (data: Partial<TokenCreationData>) => {
    setFormData(prev => ({ ...prev, ...data }));
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevStep = (data?: Partial<TokenCreationData>) => {
    if (data) {
      setFormData(prev => ({ ...prev, ...data }));
    }
    setCurrentStep(prev => prev - 1);
  };

  const handleFormSubmit = async (finalData: Partial<TokenCreationData>) => {
    const allData = { ...formData, ...finalData };
    setFormData(allData);

    if (!wallet) {
      setSubmissionError('Пожалуйста, подключите кошелёк.');
      return;
    }
    if (!allData.name || !allData.ticker ) { // Простые проверки, можно расширить
        setSubmissionError('Название и тикер токена обязательны.');
        return;
    }

    setIsSubmitting(true);
    setSubmissionError(null);
    setSubmissionSuccess(null);

    try {
      // Вызов createJetton из useTon
      // Убедитесь, что createJetton принимает нужные параметры или адаптируйте allData
      const result = await createJetton(
        allData.name,
        allData.ticker,
        allData.description || '',
        allData.iconUrl, 
        allData.decimals || 9, // Гарантируем, что значение есть
        allData.amount || 1000000000 // Гарантируем, что значение есть
      );
      
      // ВАЖНО: Получение реального адреса контракта после вызова result - это сложная задача,
      // требующая анализа результата транзакции или взаимодействия с индексаторами.
      // Пока что используем заглушку.
      // const realContractAddress = parseContractAddressFromResult(result); 
      const placeholderContractAddress = `EQ_PLACEHOLDER_${uuidv4().substring(0,12)}`;
      
      const newToken: JettonToken = {
        id: uuidv4(),
        name: allData.name,
        symbol: allData.ticker,
        description: allData.description || '',
        image: allData.iconUrl,
        decimals: allData.decimals || 9,
        totalSupply: (allData.amount || 0).toString(),
        ownerAddress: wallet.account.address,
        contractAddress: placeholderContractAddress,
        createdAt: Date.now(),
        telegram: allData.telegram || undefined,
        // twitter: allData.twitter || undefined,
        // website: allData.website || undefined,
        // liquidityTonAmount: allData.liquidityTonAmount,
      };
      
      addToken(newToken);
      setSubmissionSuccess(`Запрос на создание токена ${allData.name} (${allData.ticker}) отправлен! Он появится в списке после обработки сетью.`);
      
      // Сбрасываем форму и шаги
      setFormData(initialFormData);
      setCurrentStep(1);

      // Опционально: перенаправляем пользователя через 2-3 секунды
      setTimeout(() => {
        router.push('/manage'); // или router.push(`/token/${newToken.id}`);
      }, 3000);

    } catch (err: any) {
      console.error('Ошибка при создании токена:', err);
      const errorMessage = err.message || 'Произошла ошибка при создании токена. Пожалуйста, попробуйте еще раз.';
      setSubmissionError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isWalletConnected) {
    return (
      <Layout>
        <PageHeader title="Создать токен" />
        <ConnectWalletContainer>
          <Title>Подключите кошелёк для создания токена</Title>
          <Subtitle>
            Для создания и управления Jetton токенами необходимо подключить ваш TON кошелек.
          </Subtitle>
          <Button size="large" onClick={handleConnect}>
            Подключить кошелёк
          </Button>
        </ConnectWalletContainer>
      </Layout>
    );
  }

  return (
    <Layout>
      <PageHeader title={currentStep === 1 ? "Информация о твоем токене" : currentStep === 2 ? "Социальные сети" : currentStep === 3 ? "Начальный выкуп" : "Просмотр и запуск"} />
      {submissionSuccess && <div style={{color: "green", marginBottom: '1rem'}}>{submissionSuccess}</div>}
      {submissionError && <div style={{color: "red", marginBottom: '1rem'}}>{submissionError}</div>}
      
      {currentStep === 1 && (
        <TokenInfoStep 
          onNext={handleNextStep} 
          initialData={{name: formData.name, ticker: formData.ticker, description: formData.description, iconUrl: formData.iconUrl}} 
        />
      )}
      {currentStep === 2 && (
        <SocialLinksStep 
          onNext={handleNextStep} 
          onBack={handlePrevStep} 
          initialData={{telegram: formData.telegram, twitter: formData.twitter, website: formData.website}}
        />
      )}
      {currentStep === 3 && (
        <LiquidityStep 
          onNext={handleNextStep} 
          onBack={handlePrevStep}
          initialData={{liquidityTonAmount: formData.liquidityTonAmount}}
        />
      )}
      {currentStep === 4 && (
        <ReviewAndLaunchStep 
          formData={formData} 
          onLaunch={handleFormSubmit} 
          onBack={handlePrevStep}
          isSubmitting={isSubmitting}
        />
      )}
    </Layout>
  );
} 