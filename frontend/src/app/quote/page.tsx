'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useQuoteStore } from '@/lib/store/quoteStore';
import { QuoteDisplay } from '@/components/quote/QuoteDisplay';
import { QuoteInput } from '@/components/quote/QuoteInput';
import { Button } from '@/components/ui';
import { QuoteGenerateRequest } from '@/types/quote';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

export default function QuotePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const { currentQuote, generateQuote, isLoading, error } = useQuoteStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleGenerate = async (data: QuoteGenerateRequest) => {
    try {
      await generateQuote(data);
    } catch (err) {
      console.error('生成语录失败:', err);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  if (!isAuthenticated || !user) {
    return null;
  }

  const currentDate = format(new Date(), 'yyyy年MM月dd日 EEEE', { locale: zhCN });

  return (
    <div className="min-h-screen pb-20">
      {/* 顶部导航 */}
      <header className="border-b border-accent-gold/20 bg-dark-bg/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">每日励志语录</h1>
            <p className="text-sm text-gray-400 mt-1">{currentDate}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-accent-gold font-medium">{user.name}</p>
              <p className="text-xs text-gray-400">{user.phone}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              退出
            </Button>
          </div>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* 用户欢迎信息 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            你好，{user.name} ✨
          </h2>
          <p className="text-gray-400">
            愿今日的语录能为你带来力量与启迪
          </p>
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="max-w-3xl mx-auto mb-6 p-4 bg-accent-red/10 border border-accent-red/30 rounded-lg">
            <p className="text-accent-red text-center">{error}</p>
          </div>
        )}

        {/* 语录展示区域 */}
        <QuoteDisplay quote={currentQuote} isLoading={isLoading} />

        {/* 输入区域 */}
        <div className="mt-12">
          <QuoteInput onGenerate={handleGenerate} isLoading={isLoading} />
        </div>

        {/* 历史记录入口 */}
        <div className="mt-12 text-center">
          <Button
            variant="outline"
            onClick={() => router.push('/history')}
            className="mx-auto"
          >
            📜 查看历史语录
          </Button>
        </div>
      </main>

      {/* 页脚装饰 */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-gray-600 text-xs">
        <p>🌙 中国风暗黑美学 · AI智能生成 · DeepSeek驱动</p>
      </footer>
    </div>
  );
}
