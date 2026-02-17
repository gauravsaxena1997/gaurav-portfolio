export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  status?: 'sending' | 'sent' | 'error';
}

export interface ChatRequest {
  message: string;
  conversationHistory: Pick<ChatMessage, 'role' | 'content'>[];
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ChatConfig {
  maxTokens: number;
  temperature: number;
  maxConversationTurns: number;
  maxInputLength: number;
  rateLimitPerMinute: number;
}

export type ChatStatus = 'idle' | 'loading' | 'streaming' | 'error';
