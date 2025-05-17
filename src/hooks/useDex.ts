import { useState, useEffect, useCallback } from 'react';
import { useTon } from '@/hooks/useTon';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { createDexService, DexService, DexTokenData } from '@/services/dexService';

export function useDex() {
  const { client, wallet, connected } = useTon();
  const [tonConnectUI] = useTonConnectUI();
  const [dexService, setDexService] = useState<DexService | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState<DexTokenData[]>([]);

  // Инициализация сервиса DEX
  useEffect(() => {
    if (client) {
      const service = createDexService(client);
      setDexService(service);
      setIsInitialized(true);
    }
  }, [client]);

  // Загрузка всех токенов с DEX
  const loadTokens = useCallback(async () => {
    if (!dexService) return [];
    
    setIsLoading(true);
    try {
      const tokensList = await dexService.getTokens();
      setTokens(tokensList);
      return tokensList;
    } catch (error) {
      console.error('Ошибка при загрузке токенов из DEX:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [dexService]);

  // Получение конкретного токена по адресу
  const getToken = useCallback(async (address: string) => {
    if (!dexService) return null;
    
    try {
      return await dexService.getToken(address);
    } catch (error) {
      console.error(`Ошибка при получении данных токена ${address}:`, error);
      return null;
    }
  }, [dexService]);

  // Создание и отправка транзакции для свопа токенов
  const swapTokens = useCallback(async ({
    amountIn,
    tokenIn,
    tokenOut,
    minAmountOut,
    slippageTolerance = 0.5,
  }: {
    amountIn: string;
    tokenIn: string;
    tokenOut: string;
    minAmountOut: string;
    slippageTolerance?: number;
  }) => {
    if (!dexService || !wallet || !connected || !tonConnectUI) {
      throw new Error('DEX не инициализирован или кошелек не подключен');
    }
    
    try {
      // Рассчитываем минимальную сумму получения с учетом проскальзывания
      const minAmount = parseFloat(minAmountOut) * (1 - (slippageTolerance / 100));
      
      const tx = await dexService.createSwapTransaction(
        amountIn,
        tokenIn,
        tokenOut,
        minAmount.toString(),
        wallet.account.address
      );
      
      return await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 600,
        messages: [
          {
            address: tx.to,
            amount: tx.amount,
            payload: tx.payload,
          }
        ]
      });
    } catch (error) {
      console.error('Ошибка при выполнении свопа токенов:', error);
      throw error;
    }
  }, [dexService, wallet, connected, tonConnectUI]);

  // Загрузить токены при инициализации
  useEffect(() => {
    if (isInitialized && !tokens.length) {
      loadTokens();
    }
  }, [isInitialized, loadTokens, tokens.length]);

  return {
    dexService,
    isInitialized,
    isLoading,
    tokens,
    loadTokens,
    getToken,
    swapTokens,
  };
} 