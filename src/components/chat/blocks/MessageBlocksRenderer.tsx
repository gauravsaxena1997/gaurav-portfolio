/**
 * Message Blocks Renderer
 * Renders structured message blocks with proper React keys and memoization
 */

import { memo, useMemo } from 'react';
import type { MessageBlock, ActionHandler } from '@/types/messageBlocks';
import { HeadingBlock } from './HeadingBlock';
import { TextBlock } from './TextBlock';
import { DividerBlock } from './DividerBlock';
import { ListBlock } from './ListBlock';
import { BadgesBlock } from './BadgesBlock';
import { CardBlock } from './CardBlock';
import { CarouselBlock } from './CarouselBlock';
import { CTARowBlock } from './CTARowBlock';
import { QuoteBlock } from './QuoteBlock';
import { CodeBlock } from './CodeBlock';
import styles from '../chat.module.css';

interface MessageBlocksRendererProps {
  blocks: MessageBlock[];
  onAction: ActionHandler;
}

function MessageBlocksRendererComponent({ blocks, onAction }: MessageBlocksRendererProps) {
  const normalized = useMemo(() => {
    return blocks.filter((block, index, arr) => {
      if (block.type !== 'divider') return true;
      // Drop dividers that are first/last or consecutive
      if (arr.length === 1) return false;
      if (index === 0 || index === arr.length - 1) return false;
      const prev = arr[index - 1];
      const next = arr[index + 1];
      return prev.type !== 'divider' && next?.type !== 'divider';
    });
  }, [blocks]);

  return (
    <div className={styles.blockStack}>
      {normalized.map((block, index) => {
        const key = block.id || `${block.type}_${index}`;

        switch (block.type) {
          case 'heading':
            return <HeadingBlock key={key} block={block} />;
          case 'text':
            return <TextBlock key={key} block={block} />;
          case 'divider':
            return <DividerBlock key={key} />;
          case 'list':
            return <ListBlock key={key} block={block} />;
          case 'badges':
            return <BadgesBlock key={key} block={block} />;
          case 'card':
            return <CardBlock key={key} block={block} onAction={onAction} />;
          case 'carousel':
            return <CarouselBlock key={key} block={block} onAction={onAction} />;
          case 'ctaRow':
            return <CTARowBlock key={key} block={block} onAction={onAction} />;
          case 'quote':
            return <QuoteBlock key={key} block={block} />;
          case 'code':
            return <CodeBlock key={key} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

export const MessageBlocksRenderer = memo(MessageBlocksRendererComponent);
