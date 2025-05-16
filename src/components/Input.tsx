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
`;

const InputLabel = styled.label`
  font-size: 14px;
  margin-bottom: ${({ theme }) => theme.space.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
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
`;

const ErrorMessage = styled.div`
  font-size: 12px;
  color: ${({ theme }) => theme.colors.error};
  margin-top: ${({ theme }) => theme.space.xs};
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