'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/authStore';
import { useQuoteStore } from '@/lib/store/quoteStore';
import { Button, Loading } from '@/components/ui';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { EMOTIONS } from '@/lib/constants/emotions';

export default function HistoryPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { history, fetchHistory, isLoading } = useQuoteStore();
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    fetchHistory(currentPage);
  }, [isAuthenticated, currentPage]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen pb-20">
      {/* 顶部导航 */}
      <header className="border-b border-accent-gold/20 bg-dark-bg/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold gradient-text">历史语录</h1>
            <p className="text-sm text-gray-400 mt-1">回顾您的励志时光</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => router.push('/quote')}>
            返回首页
          </Button>
        </div>
      </header>

      {/* 主内容 */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loading size="lg" text="加载中..." />
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-6">暂无历史记录</p>
            <Button onClick={() => router.push('/quote')}>
              去生成语录
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((item) => {
              const createdDate = new Date(item.created_at);
              const emotion = item.mood_input
                ? Object.entries(EMOTIONS).find(([_, config]) =>
                    config.keywords.some(k => item.mood_input?.includes(k))
                  )?.[0] || 'default'
                : 'default';
              const emotionConfig = EMOTIONS[emotion as keyof typeof EMOTIONS];

              return (
                <div
                  key={item.id}
                  className="chinese-card p-6 rounded-xl hover:border-accent-gold/40 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl" style={{ filter: `drop-shadow(0 0 10px ${emotionConfig.color})` }}>
                      {emotionConfig.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg text-white mb-4 leading-relaxed">
                        {item.content}
                      </p>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <span>{format(createdDate, 'yyyy年MM月dd日 HH:mm', { locale: zhCN })}</span>
                        <span>·</span>
                        <span>{item.city}</span>
                        <span>·</span>
                        <span>{item.weather} {item.temperature}°C</span>
                        {item.mood_input && (
                          <>
                            <span>·</span>
                            <span className="text-accent-cyan">心情: {item.mood_input}</span>
                          </>
                        )}
                        {item.event_input && (
                          <>
                            <span>·</span>
                            <span className="text-accent-gold">大事: {item.event_input}</span>
                          </>
                        )}
                        {item.is_birthday && (
                          <span className="text-accent-gold">🎂 生日</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
