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
    <path d="M2 21L23 12L2 3V10L17 12L2 14V21Z" />
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

export const ArrowBackIcon: React.FC<IconProps> = ({ className, size = 24, color = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"/>
  </svg>
);

export const CopyIcon: React.FC<IconProps> = ({ className, size = 18, color = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M16 1H4C2.9 1 2 1.9 2 3V17H4V3H16V1ZM19 5H8C6.9 5 6 5.9 6 7V21C6 22.1 6.9 23 8 23H19C20.1 23 21 22.1 21 21V7C21 5.9 20.1 5 19 5ZM19 21H8V7H19V21Z"/>
  </svg>
);

export const ExternalLinkIcon: React.FC<IconProps> = ({ className, size = 18, color = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M19 19H5V5H12V3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V12H19V19ZM14 3V5H17.59L7.76 14.83L9.17 16.24L19 6.41V10H21V3H14Z"/>
  </svg>
);

export const ChartIcon: React.FC<IconProps> = ({ className, size = 24, color = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M3.5 18.49L9.5 12.49L13.5 16.49L22 6.92L20.59 5.51L13.5 13.49L9.5 9.49L2 16.99L3.5 18.49Z"/>
  </svg>
);

export const InfoIcon: React.FC<IconProps> = ({ className, size = 24, color = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M11 7H13V9H11V7ZM11 11H13V17H11V11ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
  </svg>
);

export const ChatIcon: React.FC<IconProps> = ({ className, size = 24, color = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z"/>
  </svg>
);

export const StarIcon: React.FC<IconProps> = ({ className, size = 18, color = '#FFC107' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 17.27L18.18 21L16.54 13.97L22 9.24L14.81 8.63L12 2L9.19 8.63L2 9.24L7.46 13.97L5.82 21L12 17.27Z"/>
  </svg>
);

export const FireIcon: React.FC<IconProps> = ({ className, size = 18, color = '#FF9800' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M13.04 2.23C12.43 1.45 11.77 1 11 1C9.9 1 9 1.9 9 3C9 4.18 9.59 5.23 10.56 5.92C9.72 6.08 9.17 6.34 8.67 6.67C6.31 8.16 5.5 10.75 5.5 12.5C5.5 15.5 7.94 18.21 11 18.5V23H13V18.5C16.06 18.21 18.5 15.5 18.5 12.5C18.5 10.75 17.69 8.16 15.33 6.67C14.83 6.34 14.28 6.08 13.44 5.92C14.41 5.23 15 4.18 15 3C15 1.9 14.1 1 13 1C12.77 1 12.23 1.45 11.96 2.23H13.04Z"/>
  </svg>
);

export const BrokenHeartIcon: React.FC<IconProps> = ({ className, size = 18, color = '#F44336' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35ZM10.15 4.54L12 6.76L13.85 4.54C13.26 4.2 12.62 4 12 4C11.38 4 10.74 4.2 10.15 4.54Z"/>
  </svg>
);

export const QuestionIcon: React.FC<IconProps> = ({ className, size = 16, color = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M11.07 12.21C9.62 12.64 8.5 13.97 8.5 15.5C8.5 17.43 10.07 19 12 19S15.5 17.43 15.5 15.5C15.5 14.21 14.76 13.08 13.64 12.53C14.59 11.84 15.25 10.74 15.25 9.5C15.25 7.57 13.68 6 11.75 6C9.82 6 8.25 7.57 8.25 9.5C8.25 10.95 9.06 12.2 10.22 12.76L11.07 12.21ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z"/>
  </svg>
);

export const MoreVertIcon: React.FC<IconProps> = ({ className, size = 24, color = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8C13.1 8 14 7.1 14 6C14 4.9 13.1 4 12 4C10.9 4 10 4.9 10 6C10 7.1 10.9 8 12 8ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10ZM12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16Z"/>
  </svg>
);

export const SearchIconSVG: React.FC<IconProps> = ({ className, size = 24, color = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path d="M15.5 14H14.71L14.43 13.73C15.41 12.59 16 11.11 16 9.5C16 5.91 13.09 3 9.5 3C5.91 3 3 5.91 3 9.5C3 13.09 5.91 16 9.5 16C11.11 16 12.59 15.41 13.73 14.43L14 14.71V15.5L19 20.49L20.49 19L15.5 14ZM9.5 14C7.01 14 5 11.99 5 9.5C5 7.01 7.01 5 9.5 5C11.99 5 14 7.01 14 9.5C14 11.99 11.99 14 9.5 14Z"/>
  </svg>
); 