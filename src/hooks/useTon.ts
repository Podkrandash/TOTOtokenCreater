import { useTonConnectUI } from '@tonconnect/ui-react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Address, beginCell, Cell, toNano, fromNano } from '@ton/core';
import { TonClient } from '@ton/ton';

// Вспомогательная функция для задержки
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export function useTon() {
  const [tonConnectUI] = useTonConnectUI();
  const [tonBalance, setTonBalance] = useState<string | null>(null);
  const [isFetchingBalance, setIsFetchingBalance] = useState(false);
  const [isConnectionRestoring, setIsConnectionRestoring] = useState(true);
  const [hasBalanceBeenFetchedThisSession, setHasBalanceBeenFetchedThisSession] = useState(false);
  
  const wallet = useMemo(() => {
    return tonConnectUI?.wallet || null;
  }, [tonConnectUI?.wallet]);
  
  const client = useMemo(() => {
    return new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
      apiKey: 'f39631c724bc966b49ab17316d9286f410efa5e72023ac18954cbd86b5c46ccc' // ВАЖНО: Подумайте о безопасности ключа API
    });
  }, []);

  const getTonBalance = useCallback(async () => {
    if (!wallet || !client || isFetchingBalance || hasBalanceBeenFetchedThisSession) {
      if (!wallet) setTonBalance(null);
      return;
    }
    setIsFetchingBalance(true);
    setHasBalanceBeenFetchedThisSession(true);
    try {
      const address = Address.parse(wallet.account.address);
      const balance = await client.getBalance(address);
      setTonBalance(fromNano(balance));
    } catch (error) {
      console.error('Ошибка при получении баланса TON:', error);
      setTonBalance(null);
    } finally {
      setIsFetchingBalance(false);
    }
  }, [wallet, client, isFetchingBalance, hasBalanceBeenFetchedThisSession]);

  useEffect(() => {
    if (tonConnectUI?.connectionRestored) {
      setIsConnectionRestoring(true);
      tonConnectUI.connectionRestored.then(() => {
        setIsConnectionRestoring(false);
      }).catch(() => {
        setIsConnectionRestoring(false);
      });
    } else {
      setIsConnectionRestoring(false);
    }
  }, [tonConnectUI]);

  useEffect(() => {
    if (!isConnectionRestoring && wallet?.account?.address && !hasBalanceBeenFetchedThisSession) {
      getTonBalance();
    } else if (!wallet?.account?.address) {
      setTonBalance(null);
      setHasBalanceBeenFetchedThisSession(false);
    }

    const unsubscribe = tonConnectUI.onStatusChange((currentWallet) => {
      if (!currentWallet?.account?.address && wallet?.account?.address) {
        setTonBalance(null);
        setHasBalanceBeenFetchedThisSession(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isConnectionRestoring, wallet?.account?.address, getTonBalance, tonConnectUI, hasBalanceBeenFetchedThisSession]);

  // Создать новый Jetton и вернуть адрес его контракта
  const createJetton = async (
    name: string,
    symbol: string, 
    description: string,
    image?: string,
    decimals: number = 9,
    amount: number = 1000000000,
    onStatusUpdate?: (message: string) => void // Callback для обновления статуса
  ): Promise<string> => { // Теперь возвращает Promise<string> (адрес контракта)
    if (!wallet || !tonConnectUI) {
      throw new Error('Кошелек не подключен');
    }

    onStatusUpdate?.('Формирование метаданных...');
    const metadata: { [key: string]: string } = {
      name,
      symbol,
      decimals: decimals.toString(),
    };

    if (description) {
      metadata.description = description;
    }
    if (image) {
      if (image.startsWith('data:image/')) {
        console.warn("Обнаружена base64 строка для изображения. Она не будет включена в on-chain метаданные. Пожалуйста, используйте прямые URL-ссылки для изображений.");
        onStatusUpdate?.('Предупреждение: Изображение base64 не будет сохранено on-chain.');
      } else {
        metadata.image = image;
      }
    }

    onStatusUpdate?.('Создание ячеек для контракта...');
    const jettonContent = beginCell()
      .storeUint(0x01, 8) 
      .storeDict(null) 
      .storeRef(
        beginCell()
          .storeStringTail(JSON.stringify(metadata))
          .endCell()
      )
      .endCell();

    const createJettonPayload = beginCell()
      .storeUint(21, 32) 
      .storeCoins(toNano(amount.toString())) 
      .storeRef(jettonContent) 
      .storeAddress(Address.parse(wallet.account.address)) 
      .endCell();

    const jettonMasterAddressString = 'UQDB261B0BQdjr7hZlnmPKPH3iH5XZkfKQklf6GvbEErjuUT';
    const jettonMasterAddress = Address.parse(jettonMasterAddressString);

    onStatusUpdate?.('Отправка транзакции на создание токена...');
    try {
      // Отправляем транзакцию как и раньше, tonConnectUI сам формирует внешнее сообщение
      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 360, // 6 минут
        messages: [
          {
            address: jettonMasterAddressString,
            amount: toNano('4').toString(), // Изменено с 0.05 на 4 TON как оплата за создание токена
            payload: createJettonPayload.toBoc().toString('base64'), 
          },
        ],
      });

      onStatusUpdate?.(`Транзакция отправлена. Ожидание обработки в блокчейне...`);
      
      let attempts = 0;
      const maxAttempts = 30; 
      let factoryTxFound = null;

      while (attempts < maxAttempts) {
        attempts++;
        onStatusUpdate?.(`Попытка ${attempts}/${maxAttempts}: Получение транзакций с фабрики Jetton-ов...`);
        await sleep(5000); 

        try {
            const transactions = await client.getTransactions(jettonMasterAddress, { limit: 10 });
            for (const tx of transactions) {
                onStatusUpdate?.(`Анализ транзакции LT: ${tx.lt}...`);
                // Ищем транзакцию, у которой тело входящего сообщения совпадает с нашим payload
                // Это более надежно для сообщений, инициированных через кошелек, 
                // где внешняя обертка (адрес отправителя, validUntil) может меняться.
                if (tx.inMessage && tx.inMessage.info.type !== 'external-out' && tx.inMessage.body.hash().toString('hex') === createJettonPayload.hash().toString('hex')) {
                    factoryTxFound = tx;
                    break;
                }
            }

            if (factoryTxFound) {
                onStatusUpdate?.('Транзакция на фабрике найдена! Поиск адреса нового токена...');
                for (const outMsg of factoryTxFound.outMessages.values()) {
                    if (outMsg.info.type === 'internal' && outMsg.info.dest) {
                        const newJettonAddress = outMsg.info.dest.toString();
                        onStatusUpdate?.(`Найден возможный адрес токена: ${newJettonAddress}`);
                        try {
                           await client.runMethod(outMsg.info.dest, 'get_jetton_data');
                           onStatusUpdate?.(`Адрес токена подтвержден: ${newJettonAddress}`);
                           return newJettonAddress;
                        } catch (e) {
                           console.warn(`Адрес ${newJettonAddress} не ответил на get_jetton_data, возможно это не Jetton-мастер.`);
                           onStatusUpdate?.(`Адрес ${newJettonAddress} не похож на Jetton-мастер. Попытка с другим исходящим сообщением...`);
                        }
                    }
                }
                // Если мы прошли все исходящие сообщения и не нашли/не подтвердили адрес
                onStatusUpdate?.('Не удалось подтвердить Jetton-мастер среди исходящих сообщений. Проверьте логику фабрики.');
                // Не прерываем цикл, возможно, нужная транзакция еще не обработалась или появится позже
                // throw new Error('Не удалось извлечь адрес нового токена из транзакции фабрики. Проверьте логику фабрики.');
            }
        } catch (e) {
            console.error('Ошибка при получении или анализе транзакций:', e);
            onStatusUpdate?.(`Ошибка при поиске транзакции: ${e instanceof Error ? e.message : String(e)}`);
        }
      }
      throw new Error(`Не удалось найти транзакцию на фабрике Jetton-ов после ${maxAttempts} попыток. Токен мог не создаться или фабрика работает не так, как ожидалось.`);

    } catch (error) {
      console.error('Ошибка при создании токена или отслеживании:', error);
      onStatusUpdate?.(`Критическая ошибка: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  };

  // Получить список токенов пользователя
  const getUserJettons = async () => {
    if (!wallet) {
      throw new Error('Кошелек не подключен');
    }

    try {
      const userAddress = Address.parse(wallet.account.address);
      // В реальном приложении здесь был бы запрос к API для получения списка токенов
      // Но для примера мы просто вернем пустой массив
      return [];
    } catch (error) {
      console.error('Ошибка при получении токенов:', error);
      throw error;
    }
  };

  const connect = useCallback(async () => {
    if (tonConnectUI) {
      await tonConnectUI.connectWallet();
    }
  }, [tonConnectUI]);

  return {
    wallet,
    client,
    connected: !isConnectionRestoring && !!wallet,
    isConnectionRestoring,
    hasBalanceBeenFetchedThisSession,
    createJetton,
    getUserJettons,
    tonBalance,
    getTonBalance,
    connect,
  };
} 