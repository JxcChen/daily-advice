'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Quote } from '@/types/quote';
import { EMOTIONS } from '@/lib/constants/emotions';

interface QuoteDisplayProps {
  quote: Quote | null;
  isLoading: boolean;
}

export const QuoteDisplay: React.FC<QuoteDisplayProps> = ({ quote, isLoading }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // 打字机效果
  useEffect(() => {
    if (!quote) {
      setDisplayedText('');
      return;
    }

    setIsTyping(true);
    setDisplayedText('');
    let currentIndex = 0;
    const content = quote.content;
    let intervalId: NodeJS.Timeout | null = null;

    intervalId = setInterval(() => {
      if (currentIndex >= content.length) {
        setIsTyping(false);
        if (intervalId) clearInterval(intervalId);
        return;
      }

      const char = content[currentIndex];
      if (char !== undefined) {
        setDisplayedText((prev) => prev + char);
      }
      currentIndex++;
    }, 80);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [quote]);

  if (isLoading) {
    return (
      <div className="w-full max-w-3xl mx-auto p-8">
        <div className="chinese-card p-12 rounded-2xl">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 border-4 border-accent-gold/30 border-t-accent-gold rounded-full animate-spin" />
            <p className="text-accent-gold animate-pulse">正在生成您的专属语录...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="w-full max-w-3xl mx-auto p-8">
        <div className="chinese-card p-12 rounded-2xl text-center">
          <p className="text-gray-400">点击下方按钮，生成您的每日语录</p>
        </div>
      </div>
    );
  }

  const emotionConfig = EMOTIONS[quote.emotion];

  return (
    <motion.div
      initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
      animate={{ opacity: 1, clipPath: 'inset(0 0 0 0)' }}
      transition={{ duration: 1.5, ease: 'easeOut' }}
      className="w-full max-w-3xl mx-auto p-8"
    >
      <div className="chinese-card p-12 rounded-2xl relative overflow-hidden">
        {/* 背景水墨效果 */}
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-accent-gold via-transparent to-accent-cyan" />

        {/* 情绪表情 */}
        <motion.div
          initial={{ opacity: 0, rotateY: 180, scale: 0 }}
          animate={{ opacity: 1, rotateY: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="absolute top-6 left-6 text-5xl"
          style={{ filter: `drop-shadow(0 0 20px ${emotionConfig.color})` }}
        >
          {quote.emotion_icon}
        </motion.div>

        {/* 语录内容 */}
        <div className="relative z-10 min-h-[200px] flex items-center justify-center">
          <p className="text-2xl md:text-3xl leading-relaxed text-center font-song">
            <span className="text-white" style={{ textShadow: `0 0 20px ${emotionConfig.color}40` }}>
              {displayedText}
            </span>
            {isTyping && <span className="animate-pulse ml-1">|</span>}
          </p>
        </div>

        {/* 天气和日期信息 */}
        <div className="mt-8 pt-6 border-t border-accent-gold/20 flex justify-between items-center text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <span>{quote.weather.city}</span>
            <span>·</span>
            <span>{quote.weather.condition}</span>
            <span>·</span>
            <span>{quote.weather.temperature}°C</span>
          </div>
          <div>
            {quote.is_birthday && (
              <span className="text-accent-gold">🎂 生日快乐</span>
            )}
          </div>
        </div>

        {/* 装饰边框 */}
        <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-accent-gold/50" />
        <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-accent-gold/50" />
        <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-accent-gold/50" />
        <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent-gold/50" />
      </div>
    </motion.div>
  );
};
