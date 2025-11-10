'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/lib/store/authStore';
import { Button, Input } from '@/components/ui';
import { LoginData } from '@/types/user';
import { VALIDATION, ERROR_MESSAGES } from '@/lib/constants/config';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>();

  const onSubmit = async (data: LoginData) => {
    try {
      setErrorMessage('');
      await login(data);
      router.push('/quote');
    } catch (error: any) {
      setErrorMessage(error.message || '登录失败，请检查账号密码');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-bg-primary">
      <div className="w-full max-w-sm">
        {/* Logo & 标题 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-bg-secondary border border-border-default rounded-full mb-4">
            <svg className="w-8 h-8 text-text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary mb-2">登录账号</h1>
          <p className="text-sm text-text-secondary">继续使用每日励志语录</p>
        </div>

        {/* 登录表单 */}
        <div className="github-card p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger/30 rounded-md">
              <p className="text-danger text-sm">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="手机号"
              type="tel"
              placeholder="请输入手机号"
              {...register('phone', {
                required: '请输入手机号',
                pattern: {
                  value: VALIDATION.PHONE_REGEX,
                  message: ERROR_MESSAGES.PHONE_INVALID,
                },
              })}
              error={errors.phone?.message}
            />

            <Input
              label="密码"
              type="password"
              placeholder="请输入密码"
              {...register('password', {
                required: '请输入密码',
              })}
              error={errors.password?.message}
            />

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              登录
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border-default text-center">
            <p className="text-sm text-text-secondary">
              还没有账号？{' '}
              <Link href="/register" className="text-accent-emphasis hover:underline">
                注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
