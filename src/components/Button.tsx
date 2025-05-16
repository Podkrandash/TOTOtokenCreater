import styled, { css } from 'styled-components';
import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';
type ButtonSize = 'small' | 'medium' | 'large';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled.button<{
  $variant?: ButtonVariant;
  $size?: ButtonSize;
  $fullWidth?: boolean;
  $loading?: boolean;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.radii.md};
  font-weight: 500;
  transition: all 0.2s ease;
  
  ${({ $fullWidth }) => $fullWidth && css`
    width: 100%;
  `}
  
  ${({ disabled }) => disabled && css`
    opacity: 0.6;
    cursor: not-allowed;
  `}
  
  ${({ $loading }) => $loading && css`
    position: relative;
    color: transparent !important;
    
    &::after {
      content: '';
      position: absolute;
      width: 16px;
      height: 16px;
      border: 2px solid currentColor;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 0.7s linear infinite;
    }
    
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }
  `}
  
  ${({ $size }) => {
    switch ($size) {
      case 'small':
        return css`
          padding: ${({ theme }) => `${theme.space.xs} ${theme.space.sm}`};
          font-size: 14px;
        `;
      case 'large':
        return css`
          padding: ${({ theme }) => `${theme.space.md} ${theme.space.lg}`};
          font-size: 16px;
        `;
      default: // medium
        return css`
          padding: ${({ theme }) => `${theme.space.sm} ${theme.space.md}`};
          font-size: 15px;
        `;
    }
  }}
  
  ${({ $variant, theme }) => {
    switch ($variant) {
      case 'secondary':
        return css`
          background-color: ${theme.colors.secondary};
          color: ${theme.colors.text};
          &:hover:not(:disabled) {
            background-color: #0B75D9;
          }
          &:active:not(:disabled) {
            background-color: #0A6BC7;
          }
        `;
      case 'outline':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          border: 1px solid ${theme.colors.primary};
          &:hover:not(:disabled) {
            background-color: rgba(0, 136, 204, 0.05);
          }
          &:active:not(:disabled) {
            background-color: rgba(0, 136, 204, 0.1);
          }
        `;
      case 'text':
        return css`
          background-color: transparent;
          color: ${theme.colors.primary};
          &:hover:not(:disabled) {
            background-color: rgba(0, 136, 204, 0.05);
          }
          &:active:not(:disabled) {
            background-color: rgba(0, 136, 204, 0.1);
          }
        `;
      default: // primary
        return css`
          background-color: ${theme.colors.primary};
          color: ${theme.colors.text};
          &:hover:not(:disabled) {
            background-color: #007AB8;
          }
          &:active:not(:disabled) {
            background-color: #006CA4;
          }
        `;
    }
  }}
`;

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  children,
  type = 'button',
  ...rest
}) => {
  return (
    <StyledButton
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      $loading={loading}
      disabled={disabled || loading}
      onClick={onClick}
      type={type}
      {...rest}
    >
      {children}
    </StyledButton>
  );
}; 