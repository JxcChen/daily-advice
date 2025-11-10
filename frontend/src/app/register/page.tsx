'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { useAuthStore } from '@/lib/store/authStore';
import { Button, Input } from '@/components/ui';
import { RegisterData } from '@/types/user';
import { VALIDATION, ERROR_MESSAGES, GENDER_OPTIONS } from '@/lib/constants/config';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, isLoading } = useAuthStore();
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterData>();

  const onSubmit = async (data: RegisterData) => {
    try {
      setErrorMessage('');
      setSuccessMessage('');
      await registerUser(data);
      setSuccessMessage('注册成功！3秒后跳转到登录页...');
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      setErrorMessage(error.message || '注册失败，请检查输入信息');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* 标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">每日励志语录</h1>
          <p className="text-gray-400 text-sm">创建账号，开启您的励志之旅</p>
        </div>

        {/* 注册表单 */}
        <div className="chinese-card p-8 rounded-2xl">
          <h2 className="text-2xl font-semibold text-accent-gold mb-6">用户注册</h2>

          {errorMessage && (
            <div className="mb-4 p-3 bg-accent-red/10 border border-accent-red/30 rounded-lg">
              <p className="text-accent-red text-sm">{errorMessage}</p>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-400 text-sm">{successMessage}</p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="手机号"
              type="tel"
              placeholder="请输入11位手机号"
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
              placeholder="8-20位，包含字母和数字"
              {...register('password', {
                required: '请输入密码',
                minLength: {
                  value: VALIDATION.PASSWORD_MIN_LENGTH,
                  message: ERROR_MESSAGES.PASSWORD_INVALID,
                },
                maxLength: {
                  value: VALIDATION.PASSWORD_MAX_LENGTH,
                  message: ERROR_MESSAGES.PASSWORD_INVALID,
                },
                pattern: {
                  value: VALIDATION.PASSWORD_REGEX,
                  message: ERROR_MESSAGES.PASSWORD_INVALID,
                },
              })}
              error={errors.password?.message}
            />

            <Input
              label="姓名"
              type="text"
              placeholder="请输入您的姓名"
              {...register('name', {
                required: '请输入姓名',
                minLength: {
                  value: VALIDATION.NAME_MIN_LENGTH,
                  message: ERROR_MESSAGES.NAME_INVALID,
                },
                maxLength: {
                  value: VALIDATION.NAME_MAX_LENGTH,
                  message: ERROR_MESSAGES.NAME_INVALID,
                },
              })}
              error={errors.name?.message}
            />

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                性别 <span className="text-accent-red ml-1">*</span>
              </label>
              <div className="flex gap-4">
                {GENDER_OPTIONS.map((option) => (
                  <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      value={option.value}
                      {...register('gender', { required: '请选择性别' })}
                      className="w-4 h-4 text-accent-gold focus:ring-accent-gold"
                    />
                    <span className="text-gray-300">{option.label}</span>
                  </label>
                ))}
              </div>
              {errors.gender && (
                <p className="mt-1 text-sm text-accent-red">{errors.gender.message}</p>
              )}
            </div>

            <Input
              label="生日"
              type="date"
              {...register('birthday', {
                required: '请选择生日',
              })}
              error={errors.birthday?.message}
            />

            <Button type="submit" variant="primary" className="w-full mt-6" isLoading={isLoading}>
              注册
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              已有账号？
              <Link href="/login" className="text-accent-cyan hover:text-accent-cyan/80 ml-2">
                立即登录
              </Link>
            </p>
          </div>
        </div>

        {/* 装饰元素 */}
        <div className="mt-8 text-center text-gray-500 text-xs">
          <p>🌙 中国风暗黑美学 · AI智能生成</p>
        </div>
      </div>
    </div>
  );
}
