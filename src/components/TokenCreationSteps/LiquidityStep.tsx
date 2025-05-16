import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TokenCreationData } from '@/pages/create';

interface LiquidityStepProps {
  initialData?: Partial<Pick<TokenCreationData, 'liquidityTonAmount'>
  >;
  onNext: (data: Pick<TokenCreationData, 'liquidityTonAmount'>) => void;
  onBack: (data: Pick<TokenCreationData, 'liquidityTonAmount'>) => void;
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
  gap: ${({ theme }) => theme.space.md};
`;

const FieldLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.space.xs};
  display: block;
`;

const DescriptionText = styled.p`
    font-size: 14px;
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: ${({ theme }) => theme.space.lg};
    line-height: 1.5;
`;

const StyledInput = styled(Input)`
  input {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary} !important;
    border: 1px solid ${({ theme, error }) => (error ? theme.colors.error : theme.colors.border)} !important;
    color: ${({ theme }) => theme.colors.text} !important;
    padding: ${({ theme }) => theme.space.md} !important;
    font-size: 15px !important;

    &::placeholder {
      color: ${({ theme }) => theme.colors.textSecondary} !important;
      opacity: 0.7;
    }
    
    &:focus {
      border-color: ${({ theme, error }) => (error ? theme.colors.error : theme.colors.primary)} !important;
    }
  }
  & > label {
    display: none;
  }
  margin-bottom: 0;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  margin-top: ${({ theme }) => theme.space.lg};

  @media (max-width: 480px) {
    flex-direction: column-reverse;
    gap: ${({ theme }) => theme.space.sm};
  }
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.space.xs};
`;

export const LiquidityStep: React.FC<LiquidityStepProps> = ({ initialData, onNext, onBack }) => {
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<Pick<TokenCreationData, 'liquidityTonAmount'>
  >({
    defaultValues: initialData,
  });

  const onSubmit = (data: Pick<TokenCreationData, 'liquidityTonAmount'>) => {
    onNext(data);
  };

  const handleBack = () => {
    onBack(getValues()); // Передаем текущие значения формы назад
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <DescriptionText>
          Укажите, на какую сумму в TON вы готовы выкупить свои токены при запуске для создания начальной ликвидности.
          Это поможет установить начальную цену и обеспечить возможность торговли сразу после запуска.
        </DescriptionText>
        <div>
          <FieldLabel htmlFor="liquidity-ton-amount">Сумма в TON для выкупа</FieldLabel>
          <StyledInput
            id="liquidity-ton-amount"
            type="number"
            placeholder="Например: 100"
            {...register('liquidityTonAmount', {
              required: 'Укажите сумму в TON',
              valueAsNumber: true,
              min: { value: 0.1, message: 'Минимальная сумма 0.1 TON' }, // Примерное минимальное значение
            })}
            error={errors.liquidityTonAmount?.message}
            fullWidth
          />
          {errors.liquidityTonAmount && <ErrorMessage>{errors.liquidityTonAmount.message}</ErrorMessage>}
        </div>

        <ButtonGroup>
          <Button type="button" variant="outline" onClick={handleBack} fullWidth>
            Назад
          </Button>
          <Button type="submit" fullWidth size="large">
            Продолжить
          </Button>
        </ButtonGroup>
      </Form>
    </FormContainer>
  );
}; 