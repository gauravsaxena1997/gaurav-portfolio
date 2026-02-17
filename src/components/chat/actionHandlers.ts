/**
 * Action Handlers for Chat Widget
 * Portfolio-specific implementations of universal action primitives
 */

import type { Action } from '@/types/messageBlocks';

export function createActionHandler(onSendFollowup?: (prompt: string) => void) {
  return async (action: Action) => {
    switch (action.type) {
      case 'open_url':
        if (action.openInNew) {
          window.open(action.url, '_blank', 'noopener,noreferrer');
        } else {
          window.location.href = action.url;
        }
        break;

      case 'scroll_to':
        {
          const el = document.getElementById(action.targetId);
          if (el) {
            // Temporarily unlock body scroll for navigation
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = '';
            
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            
            // Restore scroll lock after navigation
            setTimeout(() => {
              document.body.style.overflow = originalOverflow;
            }, 1000);
          }
        }
        break;

      case 'open_modal':
        // Portfolio-specific: open project viewer or other modals
        if (action.modalId.startsWith('project_')) {
          const projectId = action.modalId.replace('project_', '');
          // Trigger project viewer (would need to be wired through context/props)
          console.log('Open project modal:', projectId, action.payload);
        }
        break;

      case 'send_followup':
        if (onSendFollowup) {
          onSendFollowup(action.prompt);
        }
        break;

      case 'copy_to_clipboard':
        try {
          await navigator.clipboard.writeText(action.text);
          // Could show a toast notification here
        } catch (err) {
          console.error('Failed to copy to clipboard:', err);
        }
        break;

      default:
        console.warn('Unknown action type:', (action as Action).type);
    }
  };
}
