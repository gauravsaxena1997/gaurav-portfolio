import { memo } from 'react';
import type { QuoteBlock as QuoteBlockType } from '@/types/messageBlocks';

interface QuoteBlockProps {
  block: QuoteBlockType;
}

function QuoteBlockComponent({ block }: QuoteBlockProps) {
  return (
    <blockquote className="border-l-4 border-current/30 pl-4 italic">
      <p className="leading-relaxed">{block.text}</p>
      {block.author && (
        <footer className="text-sm mt-1 opacity-70">— {block.author}</footer>
      )}
    </blockquote>
  );
}

export const QuoteBlock = memo(QuoteBlockComponent);
