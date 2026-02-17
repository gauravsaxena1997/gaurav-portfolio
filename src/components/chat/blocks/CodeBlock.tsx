import { memo } from 'react';
import type { CodeBlock as CodeBlockType } from '@/types/messageBlocks';

interface CodeBlockProps {
  block: CodeBlockType;
}

function CodeBlockComponent({ block }: CodeBlockProps) {
  return (
    <div className="relative">
      {block.language && (
        <div className="text-xs opacity-60 mb-1">{block.language}</div>
      )}
      <pre className="bg-black/10 dark:bg-white/10 rounded p-3 overflow-x-auto text-sm">
        <code>{block.code}</code>
      </pre>
    </div>
  );
}

export const CodeBlock = memo(CodeBlockComponent);
