import { memo } from 'react';
import type { BadgesBlock as BadgesBlockType } from '@/types/messageBlocks';

interface BadgesBlockProps {
  block: BadgesBlockType;
}

function BadgesBlockComponent({ block }: BadgesBlockProps) {
  const variantClass = 
    block.variant === 'accent' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
    block.variant === 'muted' ? 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300' :
    'bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-200';

  return (
    <div className="flex flex-wrap gap-2">
      {block.items.map((item, idx) => (
        <span
          key={idx}
          className={`px-2 py-1 text-xs font-medium rounded ${variantClass}`}
        >
          {item}
        </span>
      ))}
    </div>
  );
}

export const BadgesBlock = memo(BadgesBlockComponent);
