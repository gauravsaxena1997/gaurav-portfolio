import { z } from 'zod';
import { CHAT_CONFIG } from '@/lib/chat/constants';

export const chatRequestSchema = z.object({
  message: z.string()
    .min(1, { message: 'Message cannot be empty' })
    .max(CHAT_CONFIG.maxInputLength, {
      message: `Message cannot exceed ${CHAT_CONFIG.maxInputLength} characters`,
    })
    .trim(),
  conversationHistory: z.array(
    z.object({
      role: z.enum(['user', 'assistant']),
      content: z.string().max(5000),
    })
  ).max(CHAT_CONFIG.maxConversationTurns * 2),
});

export type ValidatedChatRequest = z.infer<typeof chatRequestSchema>;
