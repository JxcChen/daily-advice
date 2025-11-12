export type EmotionType =
  | 'happy'
  | 'calm'
  | 'tired'
  | 'anxious'
  | 'angry'
  | 'sad'
  | 'expectant'
  | 'default';

export interface Quote {
  content: string;
  emotion: EmotionType;
  emotion_icon: string;
  emotion_color: string;
  weather: {
    condition: string;
    temperature: number;
    city: string;
  };
  is_birthday: boolean;
  created_at: string;
}

export interface QuoteGenerateRequest {
  event?: string;
  mood?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface QuoteHistory {
  id: number;
  content: string;
  mood_input?: string;
  event_input?: string;
  weather: string;
  temperature: number;
  city: string;
  is_birthday: boolean;
  created_at: string;
}

export interface QuoteHistoryResponse {
  quotes: QuoteHistory[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
  };
}
