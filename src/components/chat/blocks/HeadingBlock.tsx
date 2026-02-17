import { memo, createElement } from 'react';
import type { HeadingBlock as HeadingBlockType } from '@/types/messageBlocks';
import styles from '../chat.module.css';

interface HeadingBlockProps {
  block: HeadingBlockType;
}

function HeadingBlockComponent({ block }: HeadingBlockProps) {
  const tag = `h${block.level}`;
  const sizeClass =
    block.level === 1 ? styles.headingXl :
    block.level === 2 ? styles.headingLg :
    block.level === 3 ? styles.headingMd :
    styles.headingSm;
  const className = `${styles.blockHeading} ${sizeClass}`;

  return createElement(tag, { className }, block.text);
}

export const HeadingBlock = memo(HeadingBlockComponent);
