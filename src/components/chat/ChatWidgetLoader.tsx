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
  const [heroInView, setHeroInView] = useState(true);

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

  // Hide FAB while hero section intersects viewport; show once scrolled past.
  useEffect(() => {
    const hero = document.getElementById('hero-section');
    if (!hero) {
      setHeroInView(false);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting && entry.intersectionRatio > 0.25),
      { threshold: [0, 0.25, 0.5, 1] }
    );
    io.observe(hero);
    return () => io.disconnect();
  }, [pathname]);

  // Hide on 404 page and component showcase pages
  if (is404 || pathname?.startsWith('/components/')) return null;
  if (heroInView) return null;

  return <ChatWidget />;
}
