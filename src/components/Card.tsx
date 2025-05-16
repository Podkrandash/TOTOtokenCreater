import styled from 'styled-components';
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  onClick?: () => void;
  hoverable?: boolean;
}

const StyledCard = styled.div<{
  $padding?: string;
  $margin?: string;
  $width?: string;
  $height?: string;
  $hoverable?: boolean;
}>`
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.radii.lg};
  padding: ${({ $padding, theme }) => $padding || theme.space.md};
  margin: ${({ $margin }) => $margin || '0'};
  width: ${({ $width }) => $width || 'auto'};
  height: ${({ $height }) => $height || 'auto'};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: box-shadow 0.2s ease-in-out, transform 0.2s ease-in-out;

  ${({ $hoverable, theme }) =>
    $hoverable &&
    `
    cursor: pointer;
    &:hover {
      box-shadow: ${theme.shadows.md};
      transform: translateY(-2px);
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
  ...rest
}) => {
  return (
    <StyledCard
      $padding={padding}
      $margin={margin}
      $width={width}
      $height={height}
      $hoverable={hoverable}
      onClick={onClick}
      {...rest}
    >
      {children}
    </StyledCard>
  );
}; 