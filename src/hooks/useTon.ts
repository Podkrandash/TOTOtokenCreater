import { useTonConnectUI } from '@tonconnect/ui-react';
import { useMemo } from 'react';
import { Address, beginCell, Cell, toNano } from '@ton/core';
import { TonClient } from '@ton/ton';

export function useTon() {
  const [tonConnectUI] = useTonConnectUI();
  
  const wallet = useMemo(() => {
    return tonConnectUI?.wallet || null;
  }, [tonConnectUI?.wallet]);
  
  const client = useMemo(() => {
    return new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });
  }, []);

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

    // Базовая информация Jetton
    const jettonContent = beginCell()
      .storeRef(
        beginCell()
          .storeUint(0x00, 8) // Off-chain маркер
          .storeBuffer(
            Buffer.from(
              JSON.stringify({
                name,
                symbol,
                description,
                image: image || '',
                decimals: decimals.toString(),
              })
            )
          )
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

  return {
    wallet,
    client,
    connected: !!wallet,
    createJetton,
    getUserJettons,
  };
} 