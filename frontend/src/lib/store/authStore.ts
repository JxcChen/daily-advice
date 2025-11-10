import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import Cookies from 'js-cookie';
import { User, LoginData, RegisterData } from '@/types/user';
import { authApi } from '@/lib/api/auth';
import { TOKEN_KEY, USER_KEY } from '@/lib/constants/config';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data: LoginData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await authApi.login(data);
          if (!response.data) {
            throw new Error('登录失败：未返回数据');
          }
          const { access_token, user } = response.data;

          // 保存 Token 到 Cookie (7天过期)
          Cookies.set(TOKEN_KEY, access_token, { expires: 7 });

          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || '登录失败',
            isLoading: false,
          });
          throw error;
        }
      },

      register: async (data: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          await authApi.register(data);
          set({
            isLoading: false,
            error: null,
          });
        } catch (error: any) {
          set({
            error: error.message || '注册失败',
            isLoading: false,
          });
          throw error;
        }
      },

      logout: () => {
        Cookies.remove(TOKEN_KEY);
        set({
          user: null,
          isAuthenticated: false,
          error: null,
        });
      },

      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: USER_KEY,
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
