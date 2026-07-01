// Chatbot Types

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  content: string;
  metadata?: ChatMessageMetadata;
  createdAt: Date;
}

export interface ChatMessageMetadata {
  intent?: string;
  entities?: Record<string, any>;
  action?: string;
  confidence?: number;
  transactionId?: string;
  error?: string;
}

export interface Conversation {
  id: string;
  userId: string;
  title: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  messages?: ChatMessage[];
}

export interface SendMessageRequest {
  conversationId?: string;
  message: string;
}

export interface SendMessageResponse {
  conversationId: string;
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
}

export interface Intent {
  type: 'ADD_TRANSACTION' | 'VIEW_TRANSACTIONS' | 'VIEW_BUDGETS' | 'VIEW_BALANCE' | 'GET_ADVICE' | 'GENERAL_QUESTION' | 'UNKNOWN';
  confidence: number;
  entities: {
    amount?: number;
    category?: string;
    description?: string;
    date?: string;
    type?: 'EXPENSE' | 'INCOME';
    accountId?: string;
    period?: 'day' | 'week' | 'month' | 'year';
  };
}
