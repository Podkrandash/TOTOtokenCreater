import React from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TokenCreationData } from '@/pages/create';

interface SocialLinksStepProps {
  initialData?: Partial<Pick<TokenCreationData, 'telegram' | 'twitter' | 'website'>
  >;
  onNext: (data: Pick<TokenCreationData, 'telegram' | 'twitter' | 'website'>) => void;
  onBack: (data: Pick<TokenCreationData, 'telegram' | 'twitter' | 'website'>) => void;
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
    flex-direction: column-reverse; // "Назад" будет снизу на мобильных
    gap: ${({ theme }) => theme.space.sm};
  }
`;

export const SocialLinksStep: React.FC<SocialLinksStepProps> = ({ initialData, onNext, onBack }) => {
  const { register, handleSubmit, getValues } = useForm<Pick<TokenCreationData, 'telegram' | 'twitter' | 'website'>
  >({
    defaultValues: initialData,
  });

  const onSubmit = (data: Pick<TokenCreationData, 'telegram' | 'twitter' | 'website'>) => {
    onNext(data);
  };

  const handleBack = () => {
    onBack(getValues()); // Передаем текущие значения формы назад
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <FieldLabel htmlFor="telegram-link">Telegram</FieldLabel>
          <StyledInput
            id="telegram-link"
            placeholder="https://t.me/yourchannel"
            {...register('telegram')}
            fullWidth
          />
        </div>

        <div>
          <FieldLabel htmlFor="twitter-link">Twitter (X)</FieldLabel>
          <StyledInput
            id="twitter-link"
            placeholder="https://twitter.com/yourprofile"
            {...register('twitter')}
            fullWidth
          />
        </div>

        <div>
          <FieldLabel htmlFor="website-link">Website</FieldLabel>
          <StyledInput
            id="website-link"
            placeholder="https://yourtoken.com"
            {...register('website')}
            fullWidth
          />
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