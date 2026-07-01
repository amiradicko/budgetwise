export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export type DateRange = {
  startDate: string | Date;
  endDate: string | Date;
};

export enum Currency {
  EUR = 'EUR',
  USD = 'USD',
  GBP = 'GBP',
  XOF = 'XOF', // Franc CFA
  XAF = 'XAF', // Franc CFA Central
}

export enum Language {
  FR = 'fr',
  EN = 'en',
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
  AUTO = 'auto',
}
