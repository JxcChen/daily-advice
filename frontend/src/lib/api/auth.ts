import { apiClient } from './client';
import { RegisterData, LoginData, LoginResponse, User } from '@/types/user';
import { ApiResponse } from '@/types/api';

export const authApi = {
  // 用户注册
  register: async (data: RegisterData): Promise<ApiResponse<{ user_id: number; phone: string; name: string }>> => {
    return apiClient.post('/auth/register', data);
  },

  // 用户登录
  login: async (data: LoginData): Promise<ApiResponse<LoginResponse>> => {
    return apiClient.post('/auth/login', data);
  },

  // 获取用户信息
  getProfile: async (): Promise<ApiResponse<User>> => {
    return apiClient.get('/user/profile');
  },
};
