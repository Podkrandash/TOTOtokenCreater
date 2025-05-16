import styled from 'styled-components';
import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const InputContainer = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.space.md};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};

  @media (max-width: 480px) {
    margin-bottom: ${({ theme }) => theme.space.sm};
  }
`;

const InputLabel = styled.label`
  font-size: 14px;
  margin-bottom: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.textSecondary};

  @media (max-width: 480px) {
    font-size: 13px;
    margin-bottom: calc(${({ theme }) => theme.space.xs} / 2);
  }
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  background-color: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme, $hasError }) => 
    $hasError ? theme.colors.error : theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  color: ${({ theme }) => theme.colors.text};
  font-size: 15px;
  padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
  transition: border-color 0.2s ease;
  outline: none;
  
  &:focus {
    border-color: ${({ theme, $hasError }) => 
      $hasError ? theme.colors.error : theme.colors.primary};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
    opacity: 0.6;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  @media (max-width: 480px) {
    font-size: 14px;
    padding: ${({ theme }) => `calc(${theme.space.sm} * 0.8) ${theme.space.sm}`};
  }
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.space.xs};

  @media (max-width: 480px) {
    font-size: 11px;
    margin-top: calc(${({ theme }) => theme.space.xs} / 2);
  }
`;

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, fullWidth = false, ...props }, ref) => {
    return (
      <InputContainer $fullWidth={fullWidth}>
        {label && <InputLabel>{label}</InputLabel>}
        <StyledInput ref={ref} $hasError={!!error} {...props} />
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </InputContainer>
    );
  }
); 