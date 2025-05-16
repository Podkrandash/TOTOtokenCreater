import React from 'react';
import styled from 'styled-components';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TokenCreationData } from '@/pages/create';

interface ReviewAndLaunchStepProps {
  formData: TokenCreationData;
  onLaunch: (data: TokenCreationData) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

const ReviewContainer = styled(Card)`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.lg};
  border: none;
  background-color: transparent;
  box-shadow: none;
`;

const Section = styled.div`
  margin-bottom: ${({ theme }) => theme.space.lg};
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space.md};
  padding-bottom: ${({ theme }) => theme.space.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: ${({ theme }) => theme.space.sm} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex: 1;
`;

const DetailValue = styled.span`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  flex: 2;
  text-align: right;
  word-break: break-word;

  img {
    max-width: 40px;
    max-height: 40px;
    border-radius: 50%;
    vertical-align: middle;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  margin-top: ${({ theme }) => theme.space.xl};

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: ${({ theme }) => theme.space.sm};
  }
`;

const formatAmount = (amount?: number) => {
  if (typeof amount === 'number') {
    return amount.toLocaleString('ru-RU'); // Для форматирования чисел с пробелами
  }
  return 'Не указано';
};

export const ReviewAndLaunchStep: React.FC<ReviewAndLaunchStepProps> = ({ formData, onLaunch, onBack, isSubmitting }) => {
  const handleLaunch = () => {
    onLaunch(formData);
  };

  return (
    <ReviewContainer>
      <Section>
        <SectionTitle>Информация о токене</SectionTitle>
        <DetailRow>
          <DetailLabel>Иконка</DetailLabel>
          <DetailValue>
            {formData.iconUrl ? <img src={formData.iconUrl} alt="Token Icon" /> : 'Не загружена'}
          </DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Название</DetailLabel>
          <DetailValue>{formData.name || 'Не указано'}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Тикер</DetailLabel>
          <DetailValue>{formData.ticker || 'Не указано'}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Описание</DetailLabel>
          <DetailValue>{formData.description || 'Нет'}</DetailValue>
        </DetailRow>
      </Section>

      <Section>
        <SectionTitle>Социальные сети</SectionTitle>
        <DetailRow>
          <DetailLabel>Telegram</DetailLabel>
          <DetailValue>{formData.telegram || 'Не указано'}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Twitter (X)</DetailLabel>
          <DetailValue>{formData.twitter || 'Не указано'}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Website</DetailLabel>
          <DetailValue>{formData.website || 'Не указано'}</DetailValue>
        </DetailRow>
      </Section>

      <Section>
        <SectionTitle>Параметры запуска</SectionTitle>
        <DetailRow>
          <DetailLabel>Сумма начального выкупа (TON)</DetailLabel>
          <DetailValue>{formatAmount(formData.liquidityTonAmount)}</DetailValue>
        </DetailRow>
        {/* Эти поля пока не видны в форме, но могут быть важны для createJetton */}
        <DetailRow>
          <DetailLabel>Количество знаков после запятой</DetailLabel>
          <DetailValue>{formData.decimals ?? 9}</DetailValue>
        </DetailRow>
        <DetailRow>
          <DetailLabel>Общее количество токенов</DetailLabel>
          <DetailValue>{formatAmount(formData.amount)}</DetailValue>
        </DetailRow>
      </Section>

      <ButtonGroup>
        <Button type="button" variant="outline" onClick={onBack} fullWidth disabled={isSubmitting}>
          Назад
        </Button>
        <Button 
          type="button" 
          onClick={handleLaunch} 
          fullWidth 
          size="large" 
          loading={isSubmitting} 
          disabled={isSubmitting}
        >
          Запустить токен
        </Button>
      </ButtonGroup>
    </ReviewContainer>
  );
}; 