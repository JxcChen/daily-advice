export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001/api/v1';

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || '每日励志语录';

export const TOKEN_KEY = 'daily_advice_token';

export const USER_KEY = 'daily_advice_user';

export const API_TIMEOUT = 10000; // 10秒

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  QUOTE: '/quote',
  HISTORY: '/history',
  PROFILE: '/profile',
} as const;

export const GENDER_OPTIONS = [
  { value: 'male', label: '男' },
  { value: 'female', label: '女' },
  { value: 'other', label: '其他' },
] as const;

export const VALIDATION = {
  PHONE_REGEX: /^1[3-9]\d{9}$/,
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 20,
  PASSWORD_REGEX: /^(?=.*[A-Za-z])(?=.*\d).+$/,
  NAME_MIN_LENGTH: 2,
  NAME_MAX_LENGTH: 20,
  EVENT_MAX_LENGTH: 100,
  MOOD_MAX_LENGTH: 50,
} as const;

export const ERROR_MESSAGES = {
  PHONE_INVALID: '请输入正确的手机号',
  PASSWORD_INVALID: '密码必须8-20位，包含字母和数字',
  NAME_INVALID: '姓名长度为2-20字符',
  BIRTHDAY_INVALID: '请选择正确的生日日期',
  NETWORK_ERROR: '网络错误，请稍后重试',
  UNKNOWN_ERROR: '未知错误，请稍后重试',
} as const;
