import { memo, useRef } from 'react';
import Image from 'next/image';
import type { CarouselBlock as CarouselBlockType, ActionHandler } from '@/types/messageBlocks';

interface CarouselBlockProps {
  block: CarouselBlockType;
  onAction: ActionHandler;
}

function CarouselBlockComponent({ block, onAction }: CarouselBlockProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-thin"
        style={{ scrollbarWidth: 'thin' }}
      >
        {block.items.map((item, idx) => (
          <div
            key={idx}
            className="flex-shrink-0 w-48 snap-start cursor-pointer"
            onClick={() => item.action && onAction(item.action)}
          >
            <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
              {item.media.type === 'image' ? (
                <Image
                  src={item.media.thumbnail || item.media.url}
                  alt={item.media.alt || item.title || 'Carousel item'}
                  fill
                  className="object-cover"
                />
              ) : (
                <video
                  src={item.media.url}
                  className="w-full h-full object-cover"
                  muted
                  playsInline
                />
              )}
            </div>
            {item.title && (
              <p className="text-sm mt-1 truncate">{item.title}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export const CarouselBlock = memo(CarouselBlockComponent);
