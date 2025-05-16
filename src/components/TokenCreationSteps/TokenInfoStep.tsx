import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/Input';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { TokenCreationData } from '@/pages/create'; // Импортируем интерфейс

interface TokenInfoStepProps {
  initialData?: Partial<Pick<TokenCreationData, 'name' | 'ticker' | 'description' | 'iconUrl'>
  >;
  onNext: (data: Pick<TokenCreationData, 'name' | 'ticker' | 'description' | 'iconUrl'>) => void;
}

const FormContainer = styled(Card)`
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.space.lg};
  border: none; // Убираем границу для соответствия скриншоту
  background-color: transparent; // Убираем фон для соответствия скриншоту
  box-shadow: none; // Убираем тень
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.space.lg}; // Увеличим немного отступ
`;

const IconUploadContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.space.md};
  margin-bottom: ${({ theme }) => theme.space.sm}; // Небольшой отступ снизу
`;

const IconPlaceholder = styled.div`
  width: 72px; // Размер как на скриншоте
  height: 72px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.backgroundSecondary}; // Темный фон для круга
  color: ${({ theme }) => theme.colors.textSecondary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px; // Размер плюса
  font-weight: 300;
  cursor: pointer;
  border: 1px dashed ${({ theme }) => theme.colors.border};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
`;

const IconTextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const IconTitle = styled.h3`
  font-size: 16px;
  font-weight: 500;
  margin: 0 0 4px 0;
  color: ${({ theme }) => theme.colors.text};
`;

const IconSubtitle = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  max-width: 250px; // Ограничим ширину, чтобы текст переносился
`;

const FieldLabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.space.xs};
`;

const FieldLabel = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const CharCounter = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// Переопределяем Input для нового стиля
const StyledInput = styled(Input)`
  input {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary} !important;
    border: 1px solid ${({ theme, error }) => (error ? theme.colors.error : theme.colors.border)} !important; // Темная граница
    color: ${({ theme }) => theme.colors.text} !important;
    padding: ${({ theme }) => theme.space.md} !important; // Увеличим padding
    font-size: 15px !important;

    &::placeholder {
      color: ${({ theme }) => theme.colors.textSecondary} !important;
      opacity: 0.7;
    }
    
    &:focus {
      border-color: ${({ theme, error }) => (error ? theme.colors.error : theme.colors.primary)} !important;
    }
  }
  // Скрываем стандартный label из Input компонента, так как у нас свой выше
  & > label {
    display: none;
  }
  // Уменьшаем отступ у контейнера, так как FieldLabelContainer дает свой отступ
  margin-bottom: 0;
`;

const StyledTextarea = styled.textarea<{ $hasError?: boolean }>`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border: 1px solid ${({ theme, $hasError }) => ($hasError ? theme.colors.error : theme.colors.border)};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  padding: ${({ theme }) => theme.space.md};
  transition: border-color 0.2s ease;
  outline: none;
  width: 100%;
  min-height: 100px;
  resize: vertical;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.7;
  }
  
  &:focus {
    border-color: ${({ theme, $hasError }) => ($hasError ? theme.colors.error : theme.colors.primary)};
  }
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.space.xs};
`;

export const TokenInfoStep: React.FC<TokenInfoStepProps> = ({ initialData, onNext }) => {
  const [iconPreview, setIconPreview] = useState<string | null>(initialData?.iconUrl || null);
  // Для подсчета символов
  const [nameValue, setNameValue] = useState(initialData?.name || '');
  const [tickerValue, setTickerValue] = useState(initialData?.ticker || '');
  const [descriptionValue, setDescriptionValue] = useState(initialData?.description || '');
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<Pick<TokenCreationData, 'name' | 'ticker' | 'description' | 'iconUrl'>>({
    defaultValues: initialData
  });

  const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.size <= 10 * 1024 * 1024) { // Проверка размера до 10 МБ
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setIconPreview(result);
        setValue('iconUrl', result); // Сохраняем base64 URL в форме
      };
      reader.readAsDataURL(file);
    } else if (file) {
      alert('Файл слишком большой. Максимальный размер 10 МБ.');
    }
  };

  const triggerIconUpload = () => {
    document.getElementById('icon-upload-input')?.click();
  };

  // Обновляем локальное состояние для счетчиков символов при изменении полей формы
  const watchedName = watch('name');
  const watchedTicker = watch('ticker');
  const watchedDescription = watch('description');

  React.useEffect(() => setNameValue(watchedName || ''), [watchedName]);
  React.useEffect(() => setTickerValue(watchedTicker || ''), [watchedTicker]);
  React.useEffect(() => setDescriptionValue(watchedDescription || ''), [watchedDescription]);

  const onSubmit = (data: Pick<TokenCreationData, 'name' | 'ticker' | 'description' | 'iconUrl'>) => {
    onNext(data);
  };

  return (
    <FormContainer>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <IconUploadContainer>
            <input 
              type="file" 
              id="icon-upload-input"
              accept="image/*, .gif" 
              style={{ display: 'none' }} 
              onChange={handleIconChange} 
            />
            <IconPlaceholder onClick={triggerIconUpload}>
              {iconPreview ? <img src={iconPreview} alt="Token Icon" /> : '+'}
            </IconPlaceholder>
            <IconTextContainer>
              <IconTitle>Иконка</IconTitle>
              <IconSubtitle>Загрузи любую картинку или gif до 10 МБ</IconSubtitle>
            </IconTextContainer>
          </IconUploadContainer>
        </div>

        <div>
          <FieldLabelContainer>
            <FieldLabel htmlFor="token-name">Название</FieldLabel>
            <CharCounter>{nameValue.length}/20</CharCounter>
          </FieldLabelContainer>
          <StyledInput
            id="token-name"
            placeholder="Полное название токена"
            {...register('name', { 
              required: 'Введите название токена',
              maxLength: { value: 20, message: 'Максимум 20 символов'}
            })}
            error={errors.name?.message}
            fullWidth
          />
          {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
        </div>

        <div>
          <FieldLabelContainer>
            <FieldLabel htmlFor="token-ticker">Ticker</FieldLabel>
            <CharCounter>{tickerValue.length}/10</CharCounter>
          </FieldLabelContainer>
          <StyledInput
            id="token-ticker"
            placeholder="Короткий символ для бирж"
            {...register('ticker', { 
              required: 'Введите тикер токена', 
              maxLength: { value: 10, message: 'Максимум 10 символов'}
            })}
            error={errors.ticker?.message}
            fullWidth
          />
          {errors.ticker && <ErrorMessage>{errors.ticker.message}</ErrorMessage>}
        </div>

        <div>
          <FieldLabelContainer>
            <FieldLabel htmlFor="token-description">Описание</FieldLabel>
            <CharCounter>{descriptionValue.length}/240</CharCounter>
          </FieldLabelContainer>
          <StyledTextarea
            id="token-description"
            placeholder="Описание монеты: особенности, цель, сообщество"
            {...register('description', { 
              maxLength: { value: 240, message: 'Максимум 240 символов'}
            })}
            $hasError={!!errors.description}
          />
          {errors.description && <ErrorMessage>{errors.description.message}</ErrorMessage>}
        </div>

        <Button 
          type="submit" 
          fullWidth 
          size="large"
          style={{ marginTop: '16px' }} // Отступ сверху для кнопки
        >
          Продолжить
        </Button>
      </Form>
    </FormContainer>
  );
}; 