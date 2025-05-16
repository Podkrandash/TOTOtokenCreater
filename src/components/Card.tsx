import styled, { css } from 'styled-components';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  onClick?: () => void;
  hoverable?: boolean;
  variant?: 'default' | 'glass';
  className?: string;
}

const StyledCard = styled.div<{
  $padding?: string;
  $margin?: string;
  $width?: string;
  $height?: string;
  $hoverable?: boolean;
  $variant?: 'default' | 'glass';
}>`
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ $padding, theme }) => $padding || theme.space.md};
  margin: ${({ $margin }) => $margin || '0'};
  width: ${({ $width }) => $width || 'auto'};
  height: ${({ $height }) => $height || 'auto'};
  transition: box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out, background-color 0.3s ease;

  ${({ $variant, theme }) => {
    if ($variant === 'glass') {
      return css`
        background-color: ${theme.colors.backgroundGlass}; 
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        border: 1px solid ${theme.colors.borderLight};
        box-shadow: ${theme.shadows.md};
      `;
    } else {
      return css`
        background-color: ${theme.colors.backgroundSecondary};
        box-shadow: ${theme.shadows.sm};
        border: 1px solid ${theme.colors.border};
      `;
    }
  }}

  ${({ $hoverable, theme, $variant }) =>
    $hoverable &&
    css`
      cursor: pointer;
      &:hover {
        transform: translateY(-3px);
        box-shadow: ${theme.shadows.lg};
        ${$variant !== 'glass' && css`
          border-color: ${theme.colors.primary};
        `}
      }
      &:active {
        transform: translateY(-1px);
        box-shadow: ${theme.shadows.sm};
      }
    `}
`;

export const Card: React.FC<CardProps> = ({
  children,
  padding,
  margin,
  width,
  height,
  onClick,
  hoverable = false,
  variant = 'default',
  className,
  ...rest
}) => {
  return (
    <StyledCard
      $padding={padding}
      $margin={margin}
      $width={width}
      $height={height}
      $hoverable={hoverable}
      $variant={variant}
      onClick={onClick}
      className={className}
      {...rest}
    >
      {children}
    </StyledCard>
  );
}; 