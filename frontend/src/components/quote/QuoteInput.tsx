'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Input } from '@/components/ui';
import { QuoteGenerateRequest } from '@/types/quote';
import { VALIDATION } from '@/lib/constants/config';

interface QuoteInputProps {
  onGenerate: (data: QuoteGenerateRequest) => void;
  isLoading: boolean;
}

export const QuoteInput: React.FC<QuoteInputProps> = ({ onGenerate, isLoading }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<QuoteGenerateRequest>();

  const onSubmit = (data: QuoteGenerateRequest) => {
    onGenerate(data);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-8">
      <div className="chinese-card p-8 rounded-2xl">
        <h3 className="text-xl font-semibold text-accent-gold mb-6 text-center">
          分享您的当下
        </h3>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Input
              label="今日大事"
              placeholder="今天有什么重要的事情吗？（选填）"
              maxLength={VALIDATION.EVENT_MAX_LENGTH}
              {...register('event', {
                maxLength: {
                  value: VALIDATION.EVENT_MAX_LENGTH,
                  message: `最多${VALIDATION.EVENT_MAX_LENGTH}个字符`,
                },
              })}
              error={errors.event?.message}
              helperText={`最多${VALIDATION.EVENT_MAX_LENGTH}字`}
            />

            <Input
              label="目前心情"
              placeholder="此刻的心情如何？（选填）"
              maxLength={VALIDATION.MOOD_MAX_LENGTH}
              {...register('mood', {
                maxLength: {
                  value: VALIDATION.MOOD_MAX_LENGTH,
                  message: `最多${VALIDATION.MOOD_MAX_LENGTH}个字符`,
                },
              })}
              error={errors.mood?.message}
              helperText={`最多${VALIDATION.MOOD_MAX_LENGTH}字`}
            />
          </div>

          <Input
            label="所在城市"
            placeholder="北京（选填，用于获取天气信息）"
            {...register('city')}
            helperText="不填写将使用默认城市"
          />

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={isLoading}
          >
            {isLoading ? '生成中...' : '✨ 生成今日语录'}
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>💡 提示：填写心情和大事可以生成更贴合您情境的语录</p>
        </div>
      </div>
    </div>
  );
};
