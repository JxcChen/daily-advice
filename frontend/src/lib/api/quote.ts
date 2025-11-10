import { apiClient } from './client';
import { Quote, QuoteGenerateRequest, QuoteHistoryResponse } from '@/types/quote';
import { ApiResponse } from '@/types/api';

export const quoteApi = {
  // 生成每日语录
  generate: async (data: QuoteGenerateRequest): Promise<ApiResponse<Quote>> => {
    return apiClient.post('/quote/generate', data);
  },

  // 获取历史语录
  getHistory: async (page: number = 1, perPage: number = 10): Promise<ApiResponse<QuoteHistoryResponse>> => {
    return apiClient.get(`/quote/history?page=${page}&per_page=${perPage}`);
  },
};
