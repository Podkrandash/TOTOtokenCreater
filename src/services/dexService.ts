import { Address, beginCell, Cell, toNano } from '@ton/core';
import { TonClient } from '@ton/ton';

// Интерфейс для данных о токене из DEX
export interface DexTokenData {
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  price: string;
  priceUsd: number;
  volume24h: number;
  liquidity: number;
  change24h: number;
}

// Интерфейс для пары токенов на DEX
export interface DexPair {
  pairAddress: string;
  token0: DexTokenData;
  token1: DexTokenData;
  reserves0: string;
  reserves1: string;
}

// Основной класс для работы с DEX
export class DexService {
  private static instance: DexService;
  private readonly apiUrl = 'https://api.dedust.io/v2';
  private readonly routerAddress = 'EQDq4g0S5TCO98vGzn-wRPfeM93-SKjou_Q_sXepIKYfW_Id'; // Адрес роутера DeDust
  private readonly tonClient: TonClient;
  
  private constructor(tonClient: TonClient) {
    this.tonClient = tonClient;
  }
  
  public static getInstance(tonClient: TonClient): DexService {
    if (!DexService.instance) {
      DexService.instance = new DexService(tonClient);
    }
    return DexService.instance;
  }
  
  // Получить список токенов с DEX
  public async getTokens(): Promise<DexTokenData[]> {
    try {
      const response = await fetch(`${this.apiUrl}/tokens`);
      if (!response.ok) {
        throw new Error(`DEX API ошибка: ${response.status}`);
      }
      const data = await response.json();
      return data.tokens || [];
    } catch (error) {
      console.error('Ошибка при получении токенов из DEX:', error);
      return [];
    }
  }
  
  // Получить данные о токене
  public async getToken(address: string): Promise<DexTokenData | null> {
    try {
      const response = await fetch(`${this.apiUrl}/token/${address}`);
      if (!response.ok) {
        throw new Error(`DEX API ошибка: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Ошибка при получении информации о токене ${address}:`, error);
      return null;
    }
  }
  
  // Получить пары токенов
  public async getPairs(): Promise<DexPair[]> {
    try {
      const response = await fetch(`${this.apiUrl}/pairs`);
      if (!response.ok) {
        throw new Error(`DEX API ошибка: ${response.status}`);
      }
      const data = await response.json();
      return data.pairs || [];
    } catch (error) {
      console.error('Ошибка при получении пар токенов из DEX:', error);
      return [];
    }
  }
  
  // Рассчитать сумму, которую получит пользователь
  public calculateAmountOut(amountIn: number, tokenIn: DexTokenData, tokenOut: DexTokenData): number {
    // Упрощенная формула для расчета без учета комиссий и скольжения
    const priceRatio = parseFloat(tokenIn.price) / parseFloat(tokenOut.price);
    return amountIn * priceRatio * 0.995; // 0.5% комиссия
  }
  
  // Создать транзакцию покупки токена
  public async createSwapTransaction(
    amountIn: string,
    tokenIn: string, // адрес токена, который отдаем
    tokenOut: string, // адрес токена, который получаем
    minAmountOut: string, // минимальная сумма на выходе
    userAddress: string, // адрес кошелька пользователя
  ): Promise<{
    to: string;
    amount: string;
    payload: string;
  }> {
    // Создаем данные для транзакции свопа
    const payload = beginCell()
      .storeUint(0x7362d09c, 32) // op-код для свопа
      .storeCoins(toNano(amountIn))
      .storeAddress(Address.parse(tokenIn))
      .storeAddress(Address.parse(tokenOut))
      .storeCoins(toNano(minAmountOut))
      .storeAddress(Address.parse(userAddress))
      .storeUint(Math.floor(Date.now() / 1000) + 600, 32) // Срок действия 10 минут
      .endCell();
    
    return {
      to: this.routerAddress,
      amount: toNano(amountIn).toString(),
      payload: payload.toBoc().toString('base64')
    };
  }
  
  // Рассчитать газ для транзакции
  public async estimateGas(tokenAddress: string): Promise<number> {
    // Упрощенная функция оценки газа
    return 0.05; // Стандартная комиссия в TON
  }
}

// Экспортируем синглтон с инициализацией
export function createDexService(tonClient: TonClient): DexService {
  return DexService.getInstance(tonClient);
} 