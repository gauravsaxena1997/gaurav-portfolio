import { memo } from 'react';
import type { ListBlock as ListBlockType } from '@/types/messageBlocks';

interface ListBlockProps {
  block: ListBlockType;
}

function ListBlockComponent({ block }: ListBlockProps) {
  const Tag = block.style === 'number' ? 'ol' : 'ul';
  const listClass = block.style === 'number' 
    ? 'list-decimal list-inside space-y-1'
    : 'list-disc list-inside space-y-1';

  return (
    <Tag className={listClass}>
      {block.items.map((item, idx) => (
        <li key={idx} className="leading-relaxed">
          {item}
        </li>
      ))}
    </Tag>
  );
}

export const ListBlock = memo(ListBlockComponent);
