import NotFound404Physics from '@/components/shared/NotFound404Physics';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '404 — Page Not Found',
    description: 'The page you are looking for does not exist or has been moved.',
};

export default function NotFound() {
    return <NotFound404Physics />;
}
