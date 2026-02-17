/**
 * Cerebras AI Provider with automatic API key rotation.
 *
 * Uses the OpenAI-compatible endpoint at https://api.cerebras.ai/v1.
 * On quota exhaustion (HTTP 429, 402, 503), silently rotates to the next
 * API key and retries the same request. The user never sees the rotation.
 *
 * Cerebras error codes reference:
 *   429 — Rate limit / quota exhausted
 *   402 — Payment required (quota exceeded on paid tier)
 *   503 — Service unavailable (temporary overload)
 * Docs: https://inference-docs.cerebras.ai/support/error
 *       https://inference-docs.cerebras.ai/support/rate-limits
 */

import { CEREBRAS_CONFIG } from '../constants';
import { logger } from '@/lib/logger';
import type { LLMMessage, LLMResponse } from './types';

/**
 * Loads all configured Cerebras API keys from environment variables.
 * Keys are named CEREBRAS_API_KEY_1, CEREBRAS_API_KEY_2, CEREBRAS_API_KEY_3.
 */
function getApiKeys(): string[] {
  const keys: string[] = [];
  for (let i = 1; i <= 10; i++) {
    const key = process.env[`CEREBRAS_API_KEY_${i}`];
    if (key) keys.push(key);
  }
  return keys;
}

/** Tracks which key index to start with (round-robin across requests) */
let currentKeyIndex = 0;

/**
 * Determines if an HTTP status code should trigger key rotation.
 */
function isRotatableError(status: number): boolean {
  return (CEREBRAS_CONFIG.rotatableStatusCodes as readonly number[]).includes(status);
}

/**
 * Makes a single chat completion request to Cerebras API.
 */
async function callCerebras(
  messages: LLMMessage[],
  apiKey: string,
  maxTokens: number,
  temperature: number
): Promise<Response> {
  return fetch(`${CEREBRAS_CONFIG.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: CEREBRAS_CONFIG.model,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
      max_completion_tokens: maxTokens,
      temperature,
      stream: false,
    }),
  });
}

/**
 * Generates a response from Cerebras with automatic key rotation.
 *
 * Strategy:
 * 1. Start with the current key index (round-robin).
 * 2. If the request fails with a rotatable error (429/402/503),
 *    silently switch to the next key and retry.
 * 3. Cycle through all available keys before giving up.
 * 4. On success, advance the round-robin index so the next request
 *    starts with a different key (distributes load).
 */
export async function generateCerebrasResponse(
  messages: LLMMessage[],
  maxTokens: number,
  temperature: number
): Promise<LLMResponse> {
  const keys = getApiKeys();

  if (keys.length === 0) {
    throw new Error('No Cerebras API keys configured. Set CEREBRAS_API_KEY_1 in environment.');
  }

  const maxAttempts = Math.min(keys.length, CEREBRAS_CONFIG.maxKeyRotations);
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const keyIndex = (currentKeyIndex + attempt) % keys.length;
    const apiKey = keys[keyIndex];

    try {
      const response = await callCerebras(messages, apiKey, maxTokens, temperature);

      // If rotatable error, try next key
      if (isRotatableError(response.status)) {
        const errorBody = await response.text().catch(() => 'Unknown error');
        logger.warn(`Cerebras key ${keyIndex + 1} hit limit (HTTP ${response.status}), rotating...`, {
          keyIndex: keyIndex + 1,
          status: response.status,
          body: errorBody.slice(0, 200),
        });
        lastError = new Error(`Cerebras HTTP ${response.status}: ${errorBody.slice(0, 200)}`);
        continue;
      }

      // Non-rotatable error — throw immediately
      if (!response.ok) {
        const errorBody = await response.text().catch(() => 'Unknown error');
        throw new Error(`Cerebras API error (HTTP ${response.status}): ${errorBody.slice(0, 300)}`);
      }

      // Success — parse response
      const data = await response.json();

      // Advance round-robin for next request
      currentKeyIndex = (keyIndex + 1) % keys.length;

      const choice = data.choices?.[0];
      if (!choice?.message?.content) {
        throw new Error('Cerebras returned empty response');
      }

      return {
        content: choice.message.content,
        usage: data.usage
          ? {
              promptTokens: data.usage.prompt_tokens ?? 0,
              completionTokens: data.usage.completion_tokens ?? 0,
              totalTokens: data.usage.total_tokens ?? 0,
            }
          : undefined,
      };
    } catch (error) {
      // Network errors — try next key
      if (error instanceof TypeError && error.message.includes('fetch')) {
        logger.warn(`Cerebras key ${keyIndex + 1} network error, rotating...`, { error });
        lastError = error;
        continue;
      }

      // If it's our own thrown error (non-rotatable), re-throw
      if (error instanceof Error && error.message.startsWith('Cerebras API error')) {
        throw error;
      }

      // Unexpected error — try next key
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.warn(`Cerebras key ${keyIndex + 1} unexpected error, rotating...`, { error: lastError.message });
    }
  }

  // All keys exhausted
  logger.error('All Cerebras API keys exhausted', {
    keysAttempted: maxAttempts,
    lastError: lastError?.message,
  });
  throw new Error('All Cerebras API keys exhausted. Please try again later.');
}
