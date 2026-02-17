import { memo } from 'react';
import type { TextBlock as TextBlockType } from '@/types/messageBlocks';
import styles from '../chat.module.css';

interface TextBlockProps {
  block: TextBlockType;
}

function TextBlockComponent({ block }: TextBlockProps) {
  return <p className={styles.blockText}>{block.text}</p>;
}

export const TextBlock = memo(TextBlockComponent);
