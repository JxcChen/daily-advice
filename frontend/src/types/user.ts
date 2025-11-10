export interface User {
  id: number;
  phone: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  birthday: string;
  created_at?: string;
  last_login_at?: string;
}

export interface RegisterData {
  phone: string;
  password: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  birthday: string;
}

export interface LoginData {
  phone: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}
