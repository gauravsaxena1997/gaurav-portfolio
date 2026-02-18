/**
 * Action Handlers for Chat Widget
 * Portfolio-specific implementations of universal action primitives
 */

import type { Action } from '@/types/messageBlocks';

interface ActionHandlerOptions {
  onBeforeScrollTo?: () => void;
}

export function createActionHandler(
  onSendFollowup?: (prompt: string) => void,
  options?: ActionHandlerOptions
) {
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
          // Fire the before-scroll hook (closes chat on mobile)
          options?.onBeforeScrollTo?.();
          const targetId = action.targetId;

          // Wait for the chat close animation + body position:fixed to clear
          // before attempting scrollIntoView (otherwise scroll is a no-op)
          setTimeout(() => {
            // Ensure body scroll is fully unlocked (matches new overflow-based lock)
            document.documentElement.style.overflow = '';
            document.body.style.overflow = '';

            const el = document.getElementById(targetId);
            if (el) {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 350); // 350ms covers close animation on mobile + desktop
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
