import { v4 as uuidv4 } from 'uuid';

// Интерфейс для данных о токене с биржи
export interface MarketTokenData {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image: string;
  contractAddress: string;
  marketCap: string;
  price: string;
  change: string;
  volume: string;
  priceHistory?: {
    [timeframe: string]: number[];
  };
  launchDate: string;
  tags?: string[];
}

// Базовый класс токенов для DEX
class TokenDatabase {
  private static instance: TokenDatabase;
  private tokens: MarketTokenData[];
  private newTokens: MarketTokenData[];
  private updateInterval: number | null = null;

  private constructor() {
    this.tokens = [
      {
        id: 'dex',
        name: 'DeDust DEX',
        symbol: 'DEX',
        description: 'Токен децентрализованной биржи DeDust',
        image: 'https://dedust.io/assets/DustIcon.svg',
        contractAddress: 'EQCcw6hha5out7hfTiGkQM8E5jxCKCGHoY35bRUm-C5Fqkqu',
        marketCap: '10M$',
        price: '2.41 TON',
        change: '+5.3%',
        volume: '1.2M TON',
        launchDate: '2023-05-15'
      },
      {
        id: 'dust',
        name: 'DeDust DUST',
        symbol: 'DUST',
        description: 'Нативный токен экосистемы DeDust',
        image: 'https://dedust.io/logo.svg',
        contractAddress: 'EQAvDfWFG0oYX19jwNDNBBL1rKNT9XfaGP9HyTb5nb2Eml6y',
        marketCap: '15M$',
        price: '3.85 TON',
        change: '+2.7%',
        volume: '2.5M TON',
        launchDate: '2023-04-20'
      },
      {
        id: 'bolt',
        name: 'Scaleton BOLT',
        symbol: 'BOLT',
        description: 'Токен платформы Scaleton',
        image: 'https://scaleton.io/logo.png',
        contractAddress: 'EQD2NmD_lH5f5u1Kj3KfGyTvhZSX0Eg6qp2a5IQUKXxOG7dn',
        marketCap: '8M$',
        price: '1.15 TON',
        change: '+12.4%',
        volume: '850K TON',
        launchDate: '2023-06-01'
      },
      {
        id: 'ton',
        name: 'Wrapped TON',
        symbol: 'wTON',
        description: 'Обернутые TON внутри сети TON',
        image: 'https://ton.org/download/ton_symbol.png',
        contractAddress: 'EQCM3B12QK1e4yZSf8GtBRT0aLMNyEsBc_DhVfRRtOEffLez',
        marketCap: '120M$',
        price: '1.00 TON',
        change: '0.0%',
        volume: '15M TON',
        launchDate: '2022-10-10'
      },
    ];

    // Новые токены
    this.newTokens = [
      {
        id: 'rocket',
        name: 'RocketFi',
        symbol: 'RCKT',
        description: 'Новый DeFi токен на TON',
        image: 'https://ton.org/images/tokens/rocket.png',
        contractAddress: 'EQBxUa7tkMwnYbMtUkQQZ7jBankfNhrpWLQvLxLBuhKB_8Qq',
        marketCap: '2.5M$',
        price: '0.75 TON',
        change: '+23.4%',
        volume: '550K TON',
        launchDate: '2023-11-15',
        tags: ['new', 'defi']
      },
      {
        id: 'meta',
        name: 'MetaTON',
        symbol: 'META',
        description: 'Метавселенная на TON',
        image: 'https://ton.org/images/tokens/meta.png',
        contractAddress: 'EQD8dJyIQfvCkRGt-drqxM_w-CmVpR7YvGTkOagMiZCqM9h2',
        marketCap: '1.8M$',
        price: '1.21 TON',
        change: '+8.7%',
        volume: '320K TON',
        launchDate: '2023-11-18',
        tags: ['new', 'metaverse']
      },
      {
        id: 'play',
        name: 'TONPlay',
        symbol: 'PLAY',
        description: 'Игровой токен экосистемы TON',
        image: 'https://ton.org/images/tokens/play.png',
        contractAddress: 'EQAkyZ6ylINDgpZqJVIPbovIKZ3tBmnsuWnv7sxHq7IMV0BV',
        marketCap: '5.2M$',
        price: '3.45 TON',
        change: '+15.2%',
        volume: '980K TON',
        launchDate: '2023-11-20',
        tags: ['new', 'gaming']
      },
      {
        id: 'pay',
        name: 'TONPay',
        symbol: 'TPAY',
        description: 'Платежный токен на TON',
        image: 'https://ton.org/images/tokens/pay.png',
        contractAddress: 'EQCXsNYsPk9oYLxv2aYZbm2rYV2ke6HoNpX_2dhkmwc5zxdY',
        marketCap: '3.7M$',
        price: '1.85 TON',
        change: '+6.3%',
        volume: '720K TON',
        launchDate: '2023-11-22',
        tags: ['new', 'payments']
      },
    ];
  }

  // Получить единственный экземпляр класса
  public static getInstance(): TokenDatabase {
    if (!TokenDatabase.instance) {
      TokenDatabase.instance = new TokenDatabase();
    }
    return TokenDatabase.instance;
  }

  // Получить все токены
  public getAllTokens(): MarketTokenData[] {
    return [...this.tokens, ...this.newTokens];
  }

  // Получить популярные токены
  public getPopularTokens(): MarketTokenData[] {
    return this.tokens;
  }

  // Получить новые токены
  public getNewTokens(): MarketTokenData[] {
    return this.newTokens;
  }

  // Получить данные одного токена по id
  public getToken(id: string): MarketTokenData | undefined {
    const allTokens = [...this.tokens, ...this.newTokens];
    return allTokens.find(token => token.id === id);
  }

  // Функция для генерации случайных изменений цены
  private updatePrices(): void {
    const updateToken = (token: MarketTokenData) => {
      // Генерируем случайное изменение от -5% до +5%
      const changePercent = (Math.random() * 10 - 5).toFixed(1);
      const isPositive = parseFloat(changePercent) >= 0;
      
      // Текущая цена без "TON"
      const currentPrice = parseFloat(token.price.replace(' TON', ''));
      
      // Новая цена с учетом изменения
      const newPrice = currentPrice * (1 + parseFloat(changePercent) / 100);
      
      return {
        ...token,
        price: newPrice.toFixed(2) + ' TON',
        change: (isPositive ? '+' : '') + changePercent + '%'
      };
    };

    // Обновляем цены токенов
    this.tokens = this.tokens.map(updateToken);
    this.newTokens = this.newTokens.map(updateToken);
  }

  // Начать автоматическое обновление цен
  public startPriceUpdates(callback?: () => void): void {
    if (this.updateInterval) return;

    this.updateInterval = window.setInterval(() => {
      this.updatePrices();
      if (callback) callback();
    }, 30000); // Обновляем каждые 30 секунд
  }

  // Остановить автоматическое обновление
  public stopPriceUpdates(): void {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }

  // Добавить новый токен
  public addToken(tokenData: Omit<MarketTokenData, 'id'>): MarketTokenData {
    const newToken: MarketTokenData = {
      id: uuidv4(),
      ...tokenData,
    };
    
    this.newTokens.unshift(newToken); // Добавляем в начало списка новых токенов
    return newToken;
  }
}

// Экспортируем singleton
export const tokenService = TokenDatabase.getInstance();

// API для работы с токенами
export const fetchAllTokens = (): Promise<MarketTokenData[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(tokenService.getAllTokens());
    }, 500); // Имитация задержки сети
  });
};

export const fetchPopularTokens = (): Promise<MarketTokenData[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(tokenService.getPopularTokens());
    }, 500);
  });
};

export const fetchNewTokens = (): Promise<MarketTokenData[]> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(tokenService.getNewTokens());
    }, 500);
  });
};

export const fetchTokenById = (id: string): Promise<MarketTokenData | undefined> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(tokenService.getToken(id));
    }, 300);
  });
};

// Начать автоматическое обновление цен токенов
export const startTokenPriceUpdates = (callback?: () => void): void => {
  tokenService.startPriceUpdates(callback);
};

// Остановить автоматическое обновление
export const stopTokenPriceUpdates = (): void => {
  tokenService.stopPriceUpdates();
};

// Импорт токенов из DEX в наш сервис
export const importTokensFromDex = async (dexTokens: any[]): Promise<MarketTokenData[]> => {
  const importedTokens: MarketTokenData[] = [];
  
  for (const token of dexTokens) {
    try {
      // Проверяем, есть ли уже такой токен в нашей базе
      const allTokens = tokenService.getAllTokens();
      const exists = allTokens.some(t => t.contractAddress === token.address);
      
      if (!exists) {
        // Преобразуем токен из DEX в наш формат
        const marketToken: Omit<MarketTokenData, 'id'> = {
          name: token.name || 'Unknown',
          symbol: token.symbol || 'UNKNOWN',
          description: `Импортирован с DEX скринера`,
          image: token.iconUrl || 'https://ton.org/download/ton_symbol.png', // Дефолтная иконка если нет
          contractAddress: token.address,
          marketCap: token.marketCap ? `$${token.marketCap}` : 'N/A',
          price: token.price || '0.00 TON',
          change: token.change24h ? `${token.change24h > 0 ? '+' : ''}${token.change24h}%` : '0.0%',
          volume: token.volume24h ? `${token.volume24h} TON` : '0 TON',
          launchDate: new Date().toISOString().split('T')[0], // Сегодняшняя дата
          tags: ['imported', 'dex']
        };
        
        // Добавляем в сервис
        const added = tokenService.addToken(marketToken);
        importedTokens.push(added);
      }
    } catch (error) {
      console.error('Ошибка при импорте токена из DEX:', error);
    }
  }
  
  return importedTokens;
}; 