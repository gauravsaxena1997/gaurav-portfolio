import { memo } from 'react';
import Image from 'next/image';
import type { CardBlock as CardBlockType, ActionHandler } from '@/types/messageBlocks';
import { ActionButton } from './ActionButton';

interface CardBlockProps {
  block: CardBlockType;
  onAction: ActionHandler;
}

function CardBlockComponent({ block, onAction }: CardBlockProps) {
  return (
    <div className="border border-current/20 rounded-lg overflow-hidden">
      {block.media && (
        <div className="relative w-full h-32">
          {block.media.type === 'image' ? (
            <Image
              src={block.media.url}
              alt={block.media.alt || block.title}
              fill
              className="object-cover"
            />
          ) : (
            <video
              src={block.media.url}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
          )}
        </div>
      )}
      <div className="p-3 space-y-2">
        <h3 className="font-semibold text-base">{block.title}</h3>
        {block.subtitle && (
          <p className="text-sm opacity-80">{block.subtitle}</p>
        )}
        {block.body && (
          <p className="text-sm leading-relaxed">{block.body}</p>
        )}
        {block.footer?.actions && block.footer.actions.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {block.footer.actions.map((action, idx) => (
              <ActionButton
                key={idx}
                action={action}
                onAction={onAction}
                size="sm"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export const CardBlock = memo(CardBlockComponent);
