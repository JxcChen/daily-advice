import { create } from 'zustand';
import { Quote, QuoteGenerateRequest, QuoteHistory } from '@/types/quote';
import { quoteApi } from '@/lib/api/quote';

interface QuoteState {
  currentQuote: Quote | null;
  history: QuoteHistory[];
  isLoading: boolean;
  error: string | null;

  // Actions
  generateQuote: (data: QuoteGenerateRequest) => Promise<void>;
  fetchHistory: (page?: number) => Promise<void>;
  clearError: () => void;
  clearCurrentQuote: () => void;
}

export const useQuoteStore = create<QuoteState>((set) => ({
  currentQuote: null,
  history: [],
  isLoading: false,
  error: null,

  generateQuote: async (data: QuoteGenerateRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await quoteApi.generate(data);
      set({
        currentQuote: response.data,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message || '生成语录失败',
        isLoading: false,
      });
      throw error;
    }
  },

  fetchHistory: async (page: number = 1) => {
    set({ isLoading: true, error: null });
    try {
      const response = await quoteApi.getHistory(page, 10);
      set({
        history: response.data.quotes,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      set({
        error: error.message || '获取历史记录失败',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  clearCurrentQuote: () => {
    set({ currentQuote: null });
  },
}));
