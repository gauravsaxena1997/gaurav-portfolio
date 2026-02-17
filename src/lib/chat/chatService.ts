/**
 * Chat Service — orchestrates the full pipeline:
 * Sanitize → Rate-limit → Guard → Build context → Call LLM (with key rotation) → Return
 */

import { buildChatContext } from './contextBuilder';
import { sanitizeInput, isPromptInjection, checkRateLimit } from './guardrails';
import { generateCerebrasResponse } from './providers';
import { CHAT_CONFIG, CHAT_ERRORS } from './constants';
import { logger } from '@/lib/logger';
import type { ChatResponse } from '@/types/chat';

class ChatService {
  async processMessage(
    message: string,
    history: { role: string; content: string }[],
    clientId: string
  ): Promise<ChatResponse> {
    try {
      // 1. Sanitize input
      const sanitized = sanitizeInput(message);
      if (!sanitized) {
        return { success: false, error: 'Message cannot be empty.' };
      }

      // 2. Rate limit check (includes per-second throttle)
      const rateCheck = checkRateLimit(clientId, CHAT_CONFIG.rateLimitPerMinute);
      if (!rateCheck.allowed) {
        const msg = rateCheck.reason === 'too_fast'
          ? 'Slow down! Please wait a moment before sending another message.'
          : CHAT_ERRORS.RATE_LIMITED;
        return { success: false, error: msg };
      }

      // 3. Prompt injection guard
      if (isPromptInjection(sanitized)) {
        return { success: false, error: CHAT_ERRORS.OFF_TOPIC };
      }

      // 4. Build context with token optimization
      const messages = buildChatContext(sanitized, history);

      // 5. Call Cerebras with automatic key rotation
      const result = await generateCerebrasResponse(
        messages,
        CHAT_CONFIG.maxTokens,
        CHAT_CONFIG.temperature
      );

      logger.info('Chat response generated', {
        inputLen: sanitized.length,
        outputLen: result.content.length,
        usage: result.usage,
      });

      return {
        success: true,
        message: result.content,
        usage: result.usage,
      };
    } catch (error) {
      const errMsg = error instanceof Error ? error.message : String(error);

      // Distinguish between all-keys-exhausted and other errors
      if (errMsg.includes('All Cerebras API keys exhausted')) {
        logger.error('All API keys exhausted', { error: errMsg });
        return { success: false, error: CHAT_ERRORS.ALL_KEYS_EXHAUSTED };
      }

      logger.error('ChatService error', { error: errMsg });
      return { success: false, error: CHAT_ERRORS.API_ERROR };
    }
  }
}

export const chatService = new ChatService();
