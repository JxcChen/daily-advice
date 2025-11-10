export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  errors?: Record<string, string>;
}

export interface ApiError {
  code: number;
  message: string;
  errors?: Record<string, string>;
}
