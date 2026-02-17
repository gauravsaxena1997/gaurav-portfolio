import { memo, useCallback } from 'react';
import { ExternalLink, ArrowRight, Copy } from 'lucide-react';
import type { Action, ActionHandler } from '@/types/messageBlocks';
import styles from '../chat.module.css';

interface ActionButtonProps {
  action: Action;
  onAction: ActionHandler;
  size?: 'sm' | 'md';
}

function ActionButtonComponent({ action, onAction, size = 'md' }: ActionButtonProps) {
  const handleClick = useCallback(() => {
    onAction(action);
  }, [action, onAction]);

  // Remove any trailing arrow glyphs from the label to avoid double arrows when we also show an icon
  const cleanedLabel = action.label.replace(/\s*(→|➡️|➜|➝|➞|->)+\s*$/u, '');

  const sizeClass = size === 'sm' 
    ? 'px-3 py-1.5 text-xs' 
    : 'px-4 py-2 text-sm';

  const getIcon = () => {
    switch (action.type) {
      case 'open_url':
        return <ExternalLink size={14} />;
      case 'scroll_to':
        return <ArrowRight size={14} />;
      case 'copy_to_clipboard':
        return <Copy size={14} />;
      default:
        return null;
    }
  };

  return (
    <button
      onClick={handleClick}
      className={styles.blockCTAButton}
    >
      {cleanedLabel}
      {getIcon()}
    </button>
  );
}

export const ActionButton = memo(ActionButtonComponent);
