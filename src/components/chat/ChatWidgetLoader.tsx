'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const ChatWidget = dynamic(
  () =>
    import('@/components/chat/ChatWidget').then((m) => ({
      default: m.ChatWidget,
    })),
  { ssr: false }
);

export function ChatWidgetLoader() {
  const pathname = usePathname();
  const [is404, setIs404] = useState(false);
  
  useEffect(() => {
    // Check for our custom marker that the 404 component sets
    const check = () => {
      setIs404(document.body.getAttribute('data-page-type') === '404');
    };
    check();
    // Re-check on navigation
    const observer = new MutationObserver(check);
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-page-type'] });
    return () => observer.disconnect();
  }, [pathname]);
  
  // Hide on 404 page and component showcase pages
  if (is404 || pathname?.startsWith('/components/')) return null;
  
  return <ChatWidget />;
}
