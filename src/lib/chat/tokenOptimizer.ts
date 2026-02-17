/**
 * Lightweight token estimation and context management.
 * Uses ~4 chars per token heuristic for fast estimation.
 */

export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

/**
 * Trims conversation history to fit within token budget.
 * Keeps the most recent messages (recency bias).
 */
export function trimConversationHistory(
  history: { role: string; content: string }[],
  maxTokens: number
): { role: string; content: string }[] {
  const result: { role: string; content: string }[] = [];
  let tokens = 0;

  for (let i = history.length - 1; i >= 0; i--) {
    const msgTokens = estimateTokenCount(history[i].content) + 4;
    if (tokens + msgTokens > maxTokens) break;
    tokens += msgTokens;
    result.unshift(history[i]);
  }

  return result;
}

/**
 * Compresses the knowledge base if it exceeds token limits.
 * Sections are ordered by priority — earlier sections are kept first.
 */
export function compressKnowledgeBase(
  fullContext: string,
  maxTokens: number
): string {
  if (estimateTokenCount(fullContext) <= maxTokens) return fullContext;

  const sections = fullContext.split('\n\n---\n\n');
  let compressed = '';
  let tokens = 0;

  for (const section of sections) {
    const sectionTokens = estimateTokenCount(section);
    if (tokens + sectionTokens > maxTokens) break;
    compressed += (compressed ? '\n\n---\n\n' : '') + section;
    tokens += sectionTokens;
  }

  return compressed;
}
