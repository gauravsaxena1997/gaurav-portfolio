import type { ChatConfig } from '@/types/chat';

export const CHAT_CONFIG: ChatConfig = {
  maxTokens: 1024,
  temperature: 0.3,
  maxConversationTurns: 30,
  maxInputLength: 500,
  rateLimitPerMinute: 20,
};

export const CEREBRAS_CONFIG = {
  baseUrl: 'https://api.cerebras.ai/v1',
  model: 'llama3.1-8b',
  /** HTTP status codes that trigger key rotation */
  rotatableStatusCodes: [429, 402, 503] as const,
  /** Max keys to try before giving up */
  maxKeyRotations: 3,
} as const;

export const CHAT_UI = {
  widgetSize: 56,
  windowWidth: 400,
  windowHeight: 560,
  mobileFullScreen: true,
  animationDuration: 300,
} as const;

export const SUGGESTED_QUESTIONS = [
  'What services do you offer?',
  'Tell me about your recent projects',
  'What is your tech stack?',
  'How can I hire you?',
  'What is your experience?',
] as const;

export const CHAT_ERRORS = {
  RATE_LIMITED: "You're sending messages too quickly. Please wait a moment.",
  TOO_LONG: 'Your message is too long. Please keep it under 500 characters.',
  NETWORK: 'Network error. Please check your connection and try again.',
  API_ERROR: "I'm having trouble responding right now. Please try again shortly.",
  OFF_TOPIC: "I can only answer questions about Gaurav's portfolio and services.",
  ALL_KEYS_EXHAUSTED: 'The assistant is temporarily unavailable. Please try again later.',
} as const;
