'use client';

import { usePathname } from 'next/navigation';

export function BreadcrumbSchema() {
    const pathname = usePathname();

    // Don't render on homepage
    if (pathname === '/') return null;

    // Split pathname into segments
    const segments = pathname.split('/').filter(Boolean);

    const breadcrumbItems = segments.map((segment, index) => {
        const url = `https://gauravsaxena.site/${segments.slice(0, index + 1).join('/')}`;

        // Format name: capitalize and replace hyphens with spaces
        const name = segment
            .split('-')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

        return {
            "@type": "ListItem",
            "position": index + 2, // 1 is usually Home
            "name": name,
            "item": url
        };
    });

    // Add Home as first item
    const allItems = [
        {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://gauravsaxena.site"
        },
        ...breadcrumbItems
    ];

    const schema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": allItems
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
