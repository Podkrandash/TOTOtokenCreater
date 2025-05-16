import React from 'react';

interface IconProps {
  className?: string;
  size?: number | string;
  color?: string;
}

export const HomeIcon: React.FC<IconProps> = ({ className, size = 24, color = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z" />
  </svg>
);

export const CreateIcon: React.FC<IconProps> = ({ className, size = 24, color = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
  </svg>
);

// Простая иконка для "Токены" (стопка)
export const TokensIcon: React.FC<IconProps> = ({ className, size = 24, color = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M19 11H5V13H19V11ZM19 7H5V9H19V7ZM5 17H19V15H5V17Z"/>
  </svg>
);

export const WalletIcon: React.FC<IconProps> = ({ className, size = 24, color = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M21 7V17C21 18.1046 20.1046 19 19 19H5C3.89543 19 3 18.1046 3 17V7C3 5.89543 3.89543 5 5 5H19C20.1046 5 21 5.89543 21 7ZM19 7H5V17H19V7Z" />
    <path d="M16.5 12C16.5 12.8284 15.8284 13.5 15 13.5C14.1716 13.5 13.5 12.8284 13.5 12C13.5 11.1716 14.1716 10.5 15 10.5C15.8284 10.5 16.5 11.1716 16.5 12Z" />
  </svg>
);

export const SendIcon: React.FC<IconProps> = ({ className, size = 24, color = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M4 12L1.41 9.41L12 0.83L22.59 9.41L20 12L12 4L4 12ZM12 23.17V4H10V23.17L4.41 17.58L3 19L11 24H13L21 19L19.59 17.58L12 23.17Z" transform="rotate(90 12 12)" />
 </svg>
);

export const BuyIcon: React.FC<IconProps> = ({ className, size = 24, color = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M7 18C5.89543 18 5 18.8954 5 20C5 21.1046 5.89543 22 7 22C8.10457 22 9 21.1046 9 20C9 18.8954 8.10457 18 7 18ZM17 18C15.8954 18 15 18.8954 15 20C15 21.1046 15.8954 22 17 22C18.1046 22 19 21.1046 19 20C19 18.8954 18.1046 18 17 18ZM6.17 4.00002L7.17 6.00002H17.21C17.7 6.00002 18.11 6.31002 18.26 6.77002L20.14 12.25C20.2538 12.5876 20.1531 12.9541 19.8816 13.1841C19.6101 13.4141 19.2235 13.4691 18.9 13.3L18.87 13.3H7.42L7.21 13.73C6.83 14.47 7.39 15.34 8.19 15.34H18V17.34H8.19C6.64 17.34 5.45 16.09 5.86 14.58L6.97 10.34L3 4.00002H1V2.00002H4.27L6.17 4.00002Z" />
  </svg>
);

export const HistoryIcon: React.FC<IconProps> = ({ className, size = 24, color = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20ZM12.5 7V12.5L16.25 14.9167L15.5 16.0833L11 13.1667V7H12.5Z" />
  </svg>
); 