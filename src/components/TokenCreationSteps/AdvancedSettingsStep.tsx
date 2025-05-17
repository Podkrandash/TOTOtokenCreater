import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TokenCreationData } from '@/pages/create';

interface AdvancedSettingsStepProps {
  initialData?: Partial<Pick<TokenCreationData, 'hasFees' | 'feePercentage' | 'feeRecipient' | 'hasBurn' | 'burnPercentage' | 'hasStaking' | 'stakingReward'>>;
  onNext: (data: Partial<TokenCreationData>) => void;
  onBack: (data?: Partial<TokenCreationData>) => void;
}

const FormContainer = styled(Card)`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.lg};
  border: none;
  background-color: transparent;
  box-shadow: none;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg};
`;

const SettingSection = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ theme }) => theme.space.md};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.sm};
  gap: ${({ theme }) => theme.space.sm};
`;

const ToggleSwitch = styled.div<{ $active: boolean }>`
  width: 48px;
  height: 24px;
  background-color: ${({ theme, $active }) => $active ? theme.colors.primary : theme.colors.border};
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: white;
    top: 2px;
    left: ${({ $active }) => $active ? '26px' : '2px'};
    transition: all 0.3s ease;
  }
`;

const SettingTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const SettingDescription = styled.p`
  margin: 4px 0 0;
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: ${({ theme }) => theme.space.md};
`;

const InputGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.sm};
  align-items: center;
`;

const InputLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const StyledInput = styled(Input)`
  input {
    background-color: ${({ theme }) => theme.colors.background};
    border: 1px solid ${({ theme, error }) => (error ? theme.colors.error : theme.colors.border)};
    font-size: 15px;

    &:focus {
      border-color: ${({ theme, error }) => (error ? theme.colors.error : theme.colors.primary)};
    }
  }
  
  & > label {
    display: none;
  }
  
  margin-bottom: 0;
`;

const PercentSymbol = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 15px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  margin-top: ${({ theme }) => theme.space.lg};
  
  @media (max-width: 480px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.space.sm};
  }
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.space.xs};
`;

export const AdvancedSettingsStep: React.FC<AdvancedSettingsStepProps> = ({ initialData, onNext, onBack }) => {
  // Состояния для переключателей
  const [hasFees, setHasFees] = useState(initialData?.hasFees || false);
  const [hasBurn, setHasBurn] = useState(initialData?.hasBurn || false);
  const [hasStaking, setHasStaking] = useState(initialData?.hasStaking || false);

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      feePercentage: initialData?.feePercentage || 0.5,
      feeRecipient: initialData?.feeRecipient || '',
      burnPercentage: initialData?.burnPercentage || 1,
      stakingReward: initialData?.stakingReward || 5
    }
  });

  // Обработчики переключателей
  const toggleFees = () => setHasFees(prev => !prev);
  const toggleBurn = () => setHasBurn(prev => !prev);
  const toggleStaking = () => setHasStaking(prev => !prev);

  // Отправка формы
  const onSubmit = (data: any) => {
    onNext({
      hasFees,
      feePercentage: hasFees ? data.feePercentage : 0,
      feeRecipient: hasFees ? data.feeRecipient : '',
      hasBurn,
      burnPercentage: hasBurn ? data.burnPercentage : 0,
      hasStaking,
      stakingReward: hasStaking ? data.stakingReward : 0
    });
  };

  // Возврат назад с сохранением текущих данных
  const handleBack = () => {
    const data = watch();
    onBack({
      hasFees,
      feePercentage: hasFees ? data.feePercentage : 0,
      feeRecipient: hasFees ? data.feeRecipient : '',
      hasBurn,
      burnPercentage: hasBurn ? data.burnPercentage : 0,
      hasStaking,
      stakingReward: hasStaking ? data.stakingReward : 0
    });
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        {/* Секция Комиссии */}
        <SettingSection>
          <SectionHeader>
            <ToggleSwitch $active={hasFees} onClick={toggleFees} />
            <div>
              <SettingTitle>Комиссия за транзакции</SettingTitle>
              <SettingDescription>Взимать процент с каждой транзакции токена</SettingDescription>
            </div>
          </SectionHeader>
          
          {hasFees && (
            <>
              <InputRow>
                <InputLabel>Процент комиссии</InputLabel>
                <InputGroup>
                  <StyledInput
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    {...register('feePercentage', { 
                      required: 'Введите процент', 
                      min: { value: 0, message: 'Минимум 0%' },
                      max: { value: 10, message: 'Максимум 10%' }
                    })}
                    error={errors.feePercentage?.message}
                    fullWidth
                  />
                  <PercentSymbol>%</PercentSymbol>
                </InputGroup>
                {errors.feePercentage && <ErrorMessage>{errors.feePercentage.message}</ErrorMessage>}
              </InputRow>
              
              <InputRow>
                <InputLabel>Адрес получателя комиссий</InputLabel>
                <StyledInput
                  placeholder="EQ..."
                  {...register('feeRecipient', { 
                    required: 'Введите TON адрес получателя комиссий',
                    pattern: {
                      value: /^EQ[a-zA-Z0-9_-]{48}$/,
                      message: 'Неверный формат TON адреса'
                    }
                  })}
                  error={errors.feeRecipient?.message}
                  fullWidth
                />
                {errors.feeRecipient && <ErrorMessage>{errors.feeRecipient.message}</ErrorMessage>}
              </InputRow>
            </>
          )}
        </SettingSection>
        
        {/* Секция Сжигания */}
        <SettingSection>
          <SectionHeader>
            <ToggleSwitch $active={hasBurn} onClick={toggleBurn} />
            <div>
              <SettingTitle>Сжигание токенов</SettingTitle>
              <SettingDescription>Автоматически сжигать часть токенов при каждой транзакции</SettingDescription>
            </div>
          </SectionHeader>
          
          {hasBurn && (
            <InputRow>
              <InputLabel>Процент сжигания</InputLabel>
              <InputGroup>
                <StyledInput
                  type="number"
                  step="0.01"
                  min="0"
                  max="5"
                  {...register('burnPercentage', { 
                    required: 'Введите процент', 
                    min: { value: 0, message: 'Минимум 0%' },
                    max: { value: 5, message: 'Максимум 5%' }
                  })}
                  error={errors.burnPercentage?.message}
                  fullWidth
                />
                <PercentSymbol>%</PercentSymbol>
              </InputGroup>
              {errors.burnPercentage && <ErrorMessage>{errors.burnPercentage.message}</ErrorMessage>}
            </InputRow>
          )}
        </SettingSection>
        
        {/* Секция Стейкинга */}
        <SettingSection>
          <SectionHeader>
            <ToggleSwitch $active={hasStaking} onClick={toggleStaking} />
            <div>
              <SettingTitle>Стейкинг</SettingTitle>
              <SettingDescription>Позволить пользователям стейкать токены и получать вознаграждение</SettingDescription>
            </div>
          </SectionHeader>
          
          {hasStaking && (
            <InputRow>
              <InputLabel>Годовая доходность (APY)</InputLabel>
              <InputGroup>
                <StyledInput
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  {...register('stakingReward', { 
                    required: 'Введите процент', 
                    min: { value: 0, message: 'Минимум 0%' },
                    max: { value: 100, message: 'Максимум 100%' }
                  })}
                  error={errors.stakingReward?.message}
                  fullWidth
                />
                <PercentSymbol>%</PercentSymbol>
              </InputGroup>
              {errors.stakingReward && <ErrorMessage>{errors.stakingReward.message}</ErrorMessage>}
            </InputRow>
          )}
        </SettingSection>
        
        <ButtonGroup>
          <Button type="button" variant="outline" onClick={handleBack} fullWidth>
            Назад
          </Button>
          <Button type="submit" fullWidth>
            Далее
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
}; 