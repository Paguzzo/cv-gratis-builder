export type FeedbackType = 'sugestao' | 'bug' | 'dificuldade' | 'elogio';
export type FeedbackStatus = 'novo' | 'lido' | 'resolvido';

export interface Feedback {
  id: string;
  name: string;
  email: string;
  type: FeedbackType;
  message: string;
  page: string;
  userAgent?: string;
  timestamp: string;
  status: FeedbackStatus;
  adminResponse?: string;
  respondedAt?: string;
  respondedBy?: string;
}

export interface FeedbackFormData {
  name: string;
  email: string;
  type: FeedbackType;
  message: string;
}

export interface FeedbackStats {
  total: number;
  novos: number;
  lidos: number;
  resolvidos: number;
  porTipo: Record<FeedbackType, number>;
}
