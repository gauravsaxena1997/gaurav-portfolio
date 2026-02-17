import { memo } from 'react';
import type { CTARowBlock as CTARowBlockType, ActionHandler } from '@/types/messageBlocks';
import { ActionButton } from './ActionButton';

interface CTARowBlockProps {
  block: CTARowBlockType;
  onAction: ActionHandler;
}

function CTARowBlockComponent({ block, onAction }: CTARowBlockProps) {
  const alignClass = 
    block.alignment === 'center' ? 'justify-center' :
    block.alignment === 'right' ? 'justify-end' :
    'justify-start';

  return (
    <div className={`flex flex-wrap gap-2 ${alignClass}`}>
      {block.actions.map((action, idx) => (
        <ActionButton
          key={idx}
          action={action}
          onAction={onAction}
        />
      ))}
    </div>
  );
}

export const CTARowBlock = memo(CTARowBlockComponent);
