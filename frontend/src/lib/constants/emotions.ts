import { EmotionType } from '@/types/quote';

export interface EmotionConfig {
  icon: string;
  color: string;
  keywords: string[];
  label: string;
}

export const EMOTIONS: Record<EmotionType, EmotionConfig> = {
  happy: {
    icon: '😊',
    color: '#d4af37',
    keywords: ['开心', '快乐', '高兴', '愉快', '欢喜'],
    label: '开心',
  },
  calm: {
    icon: '😌',
    color: '#00ced1',
    keywords: ['平静', '安宁', '淡然', '宁静', '祥和'],
    label: '平静',
  },
  tired: {
    icon: '😔',
    color: '#808080',
    keywords: ['疲惫', '累', '辛苦', '困倦', '乏力'],
    label: '疲惫',
  },
  nervous: {
    icon: '😰',
    color: '#4169e1',
    keywords: ['焦虑', '担心', '紧张', '不安', '忧虑'],
    label: '焦虑',
  },
  angry: {
    icon: '😤',
    color: '#dc143c',
    keywords: ['愤怒', '生气', '不爽', '恼火', '气愤'],
    label: '愤怒',
  },
  sad: {
    icon: '😢',
    color: '#9370db',
    keywords: ['伤心', '难过', '失落', '悲伤', '沮丧'],
    label: '伤心',
  },
  excited: {
    icon: '🤩',
    color: '#ff8c00',
    keywords: ['期待', '兴奋', '激动', '雀跃', '憧憬'],
    label: '期待',
  },
  default: {
    icon: '🧘',
    color: '#ffffff',
    keywords: [],
    label: '默认',
  },
};

export const detectEmotion = (mood?: string): EmotionType => {
  if (!mood) return 'default';

  for (const [emotion, config] of Object.entries(EMOTIONS)) {
    if (config.keywords.some((keyword) => mood.includes(keyword))) {
      return emotion as EmotionType;
    }
  }

  return 'default';
};
