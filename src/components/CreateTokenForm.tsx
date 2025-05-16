import styled from 'styled-components';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from './Input';
import { Button } from './Button';
import { Card } from './Card';
import { useTon } from '@/hooks/useTon';
import { useTokenStore, JettonToken } from '@/store/tokenStore';
import { v4 as uuidv4 } from 'uuid';
import { Address } from '@ton/core';

interface CreateTokenFormData {
  name: string;
  symbol: string;
  description: string;
  image: string;
  decimals: number;
  amount: number;
}

const FormContainer = styled(Card)`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.lg};
  
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.space.md};
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.md};
  
  @media (max-width: 480px) {
    gap: ${({ theme }) => theme.space.sm};
  }
`;

const FormTitle = styled.h2`
  margin-bottom: ${({ theme }) => theme.space.md};
  text-align: center;
  font-size: 24px;
  
  @media (max-width: 480px) {
    font-size: 20px;
    margin-bottom: ${({ theme }) => theme.space.sm};
  }
`;

const FormRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space.md};
  
  @media (max-width: 600px) {
    flex-direction: column;
    gap: ${({ theme }) => theme.space.sm};
  }
`;

const SuccessMessage = styled.div`
  background-color: rgba(0, 200, 83, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.success};
  color: ${({ theme }) => theme.colors.success};
  padding: ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.space.md};
  
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.space.sm};
    font-size: 14px;
  }
`;

const ErrorMessage = styled.div`
  background-color: rgba(255, 85, 85, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.error};
  color: ${({ theme }) => theme.colors.error};
  padding: ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  margin-bottom: ${({ theme }) => theme.space.md};
  
  @media (max-width: 480px) {
    padding: ${({ theme }) => theme.space.sm};
    font-size: 14px;
  }
`;

export const CreateTokenForm: React.FC = () => {
  const { createJetton, wallet } = useTon();
  const { addToken } = useTokenStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<CreateTokenFormData>({
    defaultValues: {
      name: '',
      symbol: '',
      description: '',
      image: '',
      decimals: 9,
      amount: 1000000000,
    }
  });
  
  const onSubmit = async (data: CreateTokenFormData) => {
    if (!wallet) {
      setError('Пожалуйста, подключите кошелёк');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const result = await createJetton(
        data.name,
        data.symbol,
        data.description,
        data.image,
        data.decimals,
        data.amount
      );
      
      // В реальном приложении здесь нужно будет получить адрес контракта токена
      // из событий смарт-контракта или другим способом
      const dummyTokenAddress = 'EQBlahBlahTokenAddress123456789';
      
      // Сохраняем информацию о созданном токене
      const token: JettonToken = {
        id: uuidv4(),
        name: data.name,
        symbol: data.symbol,
        description: data.description,
        image: data.image || undefined,
        decimals: data.decimals,
        totalSupply: data.amount.toString(),
        ownerAddress: wallet.account.address,
        contractAddress: dummyTokenAddress,
        createdAt: Date.now(),
      };
      
      addToken(token);
      setSuccess(`Токен ${data.name} (${data.symbol}) успешно создан!`);
      reset();
    } catch (err) {
      console.error('Ошибка при создании токена:', err);
      setError('Произошла ошибка при создании токена. Пожалуйста, попробуйте еще раз.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <FormContainer>
      <FormTitle>Создать новый Jetton токен</FormTitle>
      
      {success && <SuccessMessage>{success}</SuccessMessage>}
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Название токена *"
          placeholder="Например: TOTOCoin"
          {...register('name', { required: 'Введите название токена' })}
          error={errors.name?.message}
          fullWidth
        />
        
        <Input
          label="Символ токена *"
          placeholder="Например: TOTO"
          {...register('symbol', { required: 'Введите символ токена' })}
          error={errors.symbol?.message}
          fullWidth
        />
        
        <Input
          label="Описание"
          placeholder="Описание и цель вашего токена"
          {...register('description')}
          fullWidth
        />
        
        <Input
          label="URL изображения"
          placeholder="https://example.com/token-logo.png"
          {...register('image')}
          fullWidth
        />
        
        <FormRow>
          <Input
            label="Десятичные знаки *"
            type="number"
            {...register('decimals', { 
              required: 'Укажите количество десятичных знаков',
              min: { value: 0, message: 'Минимум 0' },
              max: { value: 18, message: 'Максимум 18' }
            })}
            error={errors.decimals?.message}
            fullWidth
          />
          
          <Input
            label="Количество токенов *"
            type="number"
            {...register('amount', { 
              required: 'Укажите количество токенов',
              min: { value: 1, message: 'Минимум 1' }
            })}
            error={errors.amount?.message}
            fullWidth
          />
        </FormRow>
        
        <Button 
          type="submit" 
          disabled={isSubmitting || !wallet} 
          loading={isSubmitting}
          fullWidth
        >
          {!wallet ? 'Подключите кошелёк' : 'Создать токен'}
        </Button>
      </Form>
    </FormContainer>
  );
}; 