import { memo } from 'react';

function DividerBlockComponent() {
  return <hr className="border-t border-current opacity-20 my-2" />;
}

export const DividerBlock = memo(DividerBlockComponent);
