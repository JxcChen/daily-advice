import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import Cookies from 'js-cookie';
import { API_BASE_URL, API_TIMEOUT, TOKEN_KEY } from '@/lib/constants/config';
import { ApiResponse, ApiError } from '@/types/api';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 请求拦截器 - 添加JWT Token
    this.client.interceptors.request.use(
      (config) => {
        const token = Cookies.get(TOKEN_KEY);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 响应拦截器 - 统一处理错误
    this.client.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error: AxiosError<ApiResponse>) => {
        const apiError: ApiError = {
          code: error.response?.data?.code || 500,
          message: error.response?.data?.message || '网络错误',
          errors: error.response?.data?.errors,
        };

        // Token过期，跳转登录
        if (apiError.code === 401) {
          Cookies.remove(TOKEN_KEY);
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        }

        return Promise.reject(apiError);
      }
    );
  }

  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.client.get(url, config);
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.client.post(url, data, config);
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.client.put(url, data, config);
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    return this.client.delete(url, config);
  }
}

export const apiClient = new ApiClient();
