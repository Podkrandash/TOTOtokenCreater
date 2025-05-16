import { useTonConnectUI } from '@tonconnect/ui-react';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { Address, beginCell, Cell, toNano, fromNano } from '@ton/core';
import { TonClient } from '@ton/ton';

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
      apiKey: 'f39631c724bc966b49ab17316d9286f410efa5e72023ac18954cbd86b5c46ccc'
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

  // Создать новый Jetton
  const createJetton = async (
    name: string,
    symbol: string, 
    description: string,
    image?: string,
    decimals: number = 9,
    amount: number = 1000000000
  ) => {
    if (!wallet || !tonConnectUI) {
      throw new Error('Кошелек не подключен');
    }

    // Формируем объект метаданных
    const metadata: { [key: string]: string } = {
      name,
      symbol,
      decimals: decimals.toString(), // По стандарту TEP-64, decimals в JSON - строка
    };

    if (description) {
      metadata.description = description;
    }
    if (image) { // Добавляем image только если он предоставлен
      metadata.image = image;
    }

    // Базовая информация Jetton для on-chain хранения
    const jettonContent = beginCell()
      .storeUint(0x01, 8) // On-chain маркер по TEP-64
      .storeDict(null) // По TEP-64 здесь должен быть словарь атрибутов, но многие минтеры ожидают JSON в следующей ячейке-ссылке
                      // Вместо storeDict(null) и затем storeRef, можно попробовать storeStringRefTail, если минтер ожидает JSON напрямую в рефе
      .storeRef(
        beginCell()
          // .storeUint(0x00, 8) // Это маркер для типа контента внутри ref, обычно 0x00 для JSON или text/plain
          // Вместо storeUint + storeBuffer, стандартнее было бы создать Cell со словарем атрибутов.
          // Но если ваш минтер ожидает просто JSON строку, то storeBuffer(Buffer.from(JSON.stringify(metadata))) - это то, что нужно.
          .storeStringTail(JSON.stringify(metadata)) // Пытаемся записать JSON как строку
          .endCell()
      )
      .endCell();

    // Параметры для смарт-контракта
    const createJettonPayload = beginCell()
      .storeUint(21, 32) // op код для создания Jetton
      .storeCoins(toNano(amount.toString())) // общее количество
      .storeRef(jettonContent) // данные токена
      .storeAddress(Address.parse(wallet.account.address)) // адрес владельца
      .endCell();

    // Адрес Jetton мастер-контракта
    const jettonMasterAddress = 'EQDQoc5M3Bh8eWFephi9bClhevelbZZvWhkqdo80XuY_0qXv';

    try {
      // Отправка транзакции
      const result = await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 360,
        messages: [
          {
            address: jettonMasterAddress,
            amount: toNano('0.05').toString(), // 0.05 TON для деплоя
            payload: createJettonPayload.toBoc().toString('base64'),
          },
        ],
      });

      return result;
    } catch (error) {
      console.error('Ошибка при создании токена:', error);
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