/**
 * Message Block Parser
 * Parses AI responses into structured MessageBlock format with fallback
 */

import type { MessageBlock, ParseResult } from '@/types/messageBlocks';
import { logger } from '@/lib/logger';

/**
 * Parse AI response into structured blocks
 * Expects JSON format, falls back to plain text if parsing fails
 */
export function parseMessageBlocks(content: string): ParseResult {
  // Try to extract JSON from response
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
  const jsonContent = jsonMatch ? jsonMatch[1] : content;

  try {
    const parsed = JSON.parse(jsonContent);

    // Validate structure
    if (!parsed.blocks || !Array.isArray(parsed.blocks)) {
      throw new Error('Invalid structure: missing blocks array');
    }

    // Validate each block has required fields
    const validBlocks = parsed.blocks.filter((block: unknown) => {
      if (typeof block !== 'object' || block === null) return false;
      const b = block as Record<string, unknown>;
      return typeof b.type === 'string';
    });

    if (validBlocks.length === 0) {
      throw new Error('No valid blocks found');
    }

    return {
      success: true,
      blocks: validBlocks as MessageBlock[],
    };
  } catch (error) {
    // Fallback: treat entire content as text block
    logger.warn('Failed to parse message blocks, using fallback', {
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Parse error',
      fallbackText: content,
      blocks: [
        {
          type: 'text',
          text: content,
        },
      ],
    };
  }
}

/**
 * Generate unique block IDs for rendering keys
 */
export function generateBlockId(block: MessageBlock, index: number): string {
  return `${block.type}_${index}_${Date.now()}`;
}

/**
 * Validate action structure
 */
export function isValidAction(action: unknown): boolean {
  if (typeof action !== 'object' || action === null) return false;
  const a = action as Record<string, unknown>;
  return typeof a.type === 'string' && typeof a.label === 'string';
}
