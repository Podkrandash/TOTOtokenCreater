import { create } from 'zustand';

export interface JettonToken {
  id: string;
  name: string;
  symbol: string;
  description: string;
  image?: string;
  decimals: number;
  totalSupply: string;
  ownerAddress: string;
  contractAddress: string;
  createdAt: number;
  telegram?: string;
}

interface TokenState {
  tokens: JettonToken[];
  isLoading: boolean;
  error: string | null;
  addToken: (token: JettonToken) => void;
  updateToken: (id: string, data: Partial<JettonToken>) => void;
  removeToken: (id: string) => void;
  setTokens: (tokens: JettonToken[]) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useTokenStore = create<TokenState>((set) => ({
  tokens: [],
  isLoading: false,
  error: null,
  
  addToken: (token) => set((state) => ({ 
    tokens: [...state.tokens, token] 
  })),
  
  updateToken: (id, data) => set((state) => ({
    tokens: state.tokens.map((token) => 
      token.id === id ? { ...token, ...data } : token
    )
  })),
  
  removeToken: (id) => set((state) => ({
    tokens: state.tokens.filter((token) => token.id !== id)
  })),
  
  setTokens: (tokens) => set({ tokens }),
  
  setLoading: (isLoading) => set({ isLoading }),
  
  setError: (error) => set({ error }),
})); 