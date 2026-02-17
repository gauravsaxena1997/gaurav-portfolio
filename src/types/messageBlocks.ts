/**
 * Universal Message Block Schema
 * App-agnostic types for structured chat responses
 */

// ============================================================================
// Action Types (Universal Primitives)
// ============================================================================

export type ActionType = 'open_url' | 'scroll_to' | 'open_modal' | 'send_followup' | 'copy_to_clipboard';

export interface BaseAction {
  type: ActionType;
  label: string;
}

export interface OpenUrlAction extends BaseAction {
  type: 'open_url';
  url: string;
  openInNew?: boolean;
}

export interface ScrollToAction extends BaseAction {
  type: 'scroll_to';
  targetId: string;
}

export interface OpenModalAction extends BaseAction {
  type: 'open_modal';
  modalId: string;
  payload?: Record<string, unknown>;
}

export interface SendFollowupAction extends BaseAction {
  type: 'send_followup';
  prompt: string;
}

export interface CopyToClipboardAction extends BaseAction {
  type: 'copy_to_clipboard';
  text: string;
}

export type Action =
  | OpenUrlAction
  | ScrollToAction
  | OpenModalAction
  | SendFollowupAction
  | CopyToClipboardAction;

// ============================================================================
// Block Types
// ============================================================================

export type BlockType =
  | 'heading'
  | 'text'
  | 'divider'
  | 'list'
  | 'badges'
  | 'card'
  | 'carousel'
  | 'ctaRow'
  | 'quote'
  | 'code';

export interface BaseBlock {
  type: BlockType;
  id?: string;
}

// Heading Block
export interface HeadingBlock extends BaseBlock {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  text: string;
}

// Text Block
export interface TextBlock extends BaseBlock {
  type: 'text';
  text: string;
}

// Divider Block
export interface DividerBlock extends BaseBlock {
  type: 'divider';
}

// List Block
export interface ListBlock extends BaseBlock {
  type: 'list';
  style: 'bullet' | 'number';
  items: string[];
}

// Badges Block (for tech stack, tags, etc.)
export interface BadgesBlock extends BaseBlock {
  type: 'badges';
  items: string[];
  variant?: 'default' | 'accent' | 'muted';
}

// Media (for cards and carousel)
export interface Media {
  type: 'image' | 'video';
  url: string;
  alt?: string;
  thumbnail?: string;
}

// Card Block
export interface CardBlock extends BaseBlock {
  type: 'card';
  title: string;
  subtitle?: string;
  body?: string;
  media?: Media;
  footer?: {
    actions?: Action[];
  };
}

// Carousel Block
export interface CarouselItem {
  title?: string;
  media: Media;
  action?: Action;
}

export interface CarouselBlock extends BaseBlock {
  type: 'carousel';
  items: CarouselItem[];
}

// CTA Row Block
export interface CTARowBlock extends BaseBlock {
  type: 'ctaRow';
  actions: Action[];
  alignment?: 'left' | 'center' | 'right';
}

// Quote Block
export interface QuoteBlock extends BaseBlock {
  type: 'quote';
  text: string;
  author?: string;
}

// Code Block
export interface CodeBlock extends BaseBlock {
  type: 'code';
  code: string;
  language?: string;
}

// Union type for all blocks
export type MessageBlock =
  | HeadingBlock
  | TextBlock
  | DividerBlock
  | ListBlock
  | BadgesBlock
  | CardBlock
  | CarouselBlock
  | CTARowBlock
  | QuoteBlock
  | CodeBlock;

// ============================================================================
// Message Response Format
// ============================================================================

export interface MessageResponse {
  blocks: MessageBlock[];
}

// ============================================================================
// Action Handler Interface (implemented by host app)
// ============================================================================

export type ActionHandler = (action: Action) => void | Promise<void>;

// ============================================================================
// Parser Result
// ============================================================================

export interface ParseResult {
  success: boolean;
  blocks?: MessageBlock[];
  error?: string;
  fallbackText?: string;
}
