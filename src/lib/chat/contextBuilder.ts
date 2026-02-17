/**
 * Builds the complete message array for LLM calls.
 * Handles token budgeting across system prompt, knowledge base, and conversation history.
 */

import { PORTFOLIO_KNOWLEDGE_BASE } from '@/data/chatKnowledgeBase';
import { buildSystemPrompt } from './guardrails';
import {
  compressKnowledgeBase,
  estimateTokenCount,
  trimConversationHistory,
} from './tokenOptimizer';

const MAX_CONTEXT_TOKENS = 8000;
const MAX_KB_TOKENS = 4000;

export function buildChatContext(
  userMessage: string,
  history: { role: string; content: string }[]
): { role: string; content: string }[] {
  // 1. Compress knowledge base to fit budget
  const kb = compressKnowledgeBase(PORTFOLIO_KNOWLEDGE_BASE, MAX_KB_TOKENS);

  // 2. Build system prompt with compressed knowledge
  const systemPrompt = buildSystemPrompt(kb);
  const sysTokens = estimateTokenCount(systemPrompt);

  // 3. Budget for user message + buffer
  const userTokens = estimateTokenCount(userMessage) + 4;
  const histBudget = MAX_CONTEXT_TOKENS - sysTokens - userTokens - 100;

  // 4. Trim conversation history to fit remaining budget
  const trimmed = trimConversationHistory(history, histBudget);

  return [
    { role: 'system', content: systemPrompt },
    ...trimmed,
    { role: 'user', content: userMessage },
  ];
}
