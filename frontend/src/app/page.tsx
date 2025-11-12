'use client';

import React, { useState } from 'react';
import { QuoteDisplay } from '@/components/quote/QuoteDisplay';
import { Button } from '@/components/ui';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { Quote } from '@/types/quote';

export default function HomePage() {
  const [name, setName] = useState('');
  const [event, setEvent] = useState('');
  const [mood, setMood] = useState('');
  const [city, setCity] = useState('北京');
  const [currentQuote, setCurrentQuote] = useState<Quote | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const currentDate = format(new Date(), 'yyyy年MM月dd日 EEEE', { locale: zhCN });

  const handleGenerate = async () => {
    // 验证名称
    if (!name.trim()) {
      setError('请输入您的名称');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          event: event.trim() || undefined,
          mood: mood.trim() || undefined,
          city: city.trim() || '北京',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '生成失败');
      }

      const data = await response.json();
      setCurrentQuote(data.quote);
    } catch (err: any) {
      console.error('生成语录失败:', err);
      setError(err.message || '生成失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-20">
      {/* 顶部导航 */}
      <header className="border-b border-accent-gold/20 bg-dark-bg/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold gradient-text text-center">每日励志语录</h1>
          <p className="text-sm text-gray-400 mt-1 text-center">{currentDate}</p>
        </div>
      </header>

      {/* 主内容区域 */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* 欢迎信息 */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {name ? `你好，${name} ✨` : '欢迎使用每日励志语录 ✨'}
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
        <div className="mt-12 max-w-2xl mx-auto">
          <div className="chinese-card p-8 rounded-2xl space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-accent-gold mb-2">生成您的专属语录</h3>
              <p className="text-sm text-gray-400">填写以下信息，点击按钮生成</p>
            </div>

            {/* 名称输入 - 必填 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                您的名称 <span className="text-accent-red">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入您的名称"
                maxLength={20}
                className="w-full px-4 py-3 bg-white border border-accent-gold/30 rounded-lg
                         text-black placeholder-gray-400
                         focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold
                         transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-1">必填项，将出现在语录中</p>
            </div>

            {/* 城市输入 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                所在城市
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="请输入城市名称"
                maxLength={20}
                className="w-full px-4 py-3 bg-white border border-accent-gold/30 rounded-lg
                         text-black placeholder-gray-400
                         focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold
                         transition-all duration-200"
              />
              <p className="text-xs text-gray-500 mt-1">用于获取天气信息</p>
            </div>

            {/* 今日大事 - 可选 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                今日大事 <span className="text-gray-500 text-xs">(可选)</span>
              </label>
              <input
                type="text"
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                placeholder="今天有什么重要的事情吗？"
                maxLength={100}
                className="w-full px-4 py-3 bg-white border border-accent-gold/30 rounded-lg
                         text-black placeholder-gray-400
                         focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold
                         transition-all duration-200"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">AI会根据此信息生成更贴合的语录</p>
                <p className="text-xs text-gray-500">{event.length}/100</p>
              </div>
            </div>

            {/* 目前心情 - 可选 */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                目前心情 <span className="text-gray-500 text-xs">(可选)</span>
              </label>
              <input
                type="text"
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                placeholder="用一句话描述您的心情..."
                maxLength={50}
                className="w-full px-4 py-3 bg-white border border-accent-gold/30 rounded-lg
                         text-black placeholder-gray-400
                         focus:outline-none focus:border-accent-gold focus:ring-1 focus:ring-accent-gold
                         transition-all duration-200"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">例如：紧张、期待、平静、疲惫等</p>
                <p className="text-xs text-gray-500">{mood.length}/50</p>
              </div>
            </div>

            {/* 生成按钮 */}
            <Button
              onClick={handleGenerate}
              disabled={isLoading || !name.trim()}
              className="w-full py-4 text-lg font-medium"
              size="lg"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin">⏳</span>
                  生成中...
                </span>
              ) : (
                '✨ 生成今日语录'
              )}
            </Button>

            {!name.trim() && (
              <p className="text-xs text-center text-gray-500 -mt-2">
                请先填写您的名称
              </p>
            )}
          </div>
        </div>
      </main>

      {/* 页脚装饰 */}
      <footer className="fixed bottom-0 left-0 right-0 p-4 text-center text-gray-600 text-xs bg-dark-bg/50 backdrop-blur-sm">
        <p>🌙 中国风暗黑美学 · AI智能生成 · DeepSeek驱动</p>
      </footer>
    </div>
  );
}
