/**
 * Provider factory — currently Cerebras-only with key rotation.
 * Extensible for future providers.
 */

export { generateCerebrasResponse } from './cerebras';
export type { LLMMessage, LLMResponse } from './types';
