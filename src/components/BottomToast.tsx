import React, { useEffect, useState } from 'react';
import styled, { keyframes, css } from 'styled-components';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface BottomToastProps {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose?: () => void;
  visible?: boolean;
}

const slideIn = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOut = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const ToastContainer = styled.div<{ $type: ToastType; $visible: boolean }>`
  position: fixed;
  bottom: 90px; // Выше нижней панели навигации
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  max-width: 400px;
  padding: ${({ theme }) => theme.space.md};
  border-radius: ${({ theme }) => theme.radii.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  font-size: 14px;
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  animation: ${({ $visible }) => 
    $visible 
      ? css`${slideIn} 0.3s ease forwards` 
      : css`${slideOut} 0.3s ease forwards`
  };
  
  ${({ $type, theme }) => {
    switch ($type) {
      case 'success':
        return css`
          background-color: ${theme.colors.success};
          color: white;
        `;
      case 'error':
        return css`
          background-color: ${theme.colors.error};
          color: white;
        `;
      case 'warning':
        return css`
          background-color: ${theme.colors.warning};
          color: black;
        `;
      default: // info
        return css`
          background-color: ${theme.colors.primary};
          color: white;
        `;
    }
  }}

  @media (max-width: 480px) {
    width: calc(100% - 32px);
    padding: ${({ theme }) => theme.space.sm};
    font-size: 13px;
    bottom: 80px;
  }
  
  @media (min-width: 768px) {
    bottom: 100px;
  }
`;

const Message = styled.div`
  flex: 1;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: inherit;
  font-size: 18px;
  cursor: pointer;
  margin-left: ${({ theme }) => theme.space.sm};
  opacity: 0.8;
  
  &:hover {
    opacity: 1;
  }
`;

export const BottomToast: React.FC<BottomToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
  visible = true,
}) => {
  const [isVisible, setIsVisible] = useState(visible);
  
  useEffect(() => {
    setIsVisible(visible);
  }, [visible]);
  
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) {
          setTimeout(onClose, 300); // Вызвать onClose после завершения анимации
        }
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);
  
  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      setTimeout(onClose, 300); // Вызвать onClose после завершения анимации
    }
  };
  
  return (
    <ToastContainer $type={type} $visible={isVisible}>
      <Message>{message}</Message>
      <CloseButton onClick={handleClose}>&times;</CloseButton>
    </ToastContainer>
  );
}; 