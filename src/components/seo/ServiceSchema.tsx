export function ServiceSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "Gaurav Saxena - Creative Technologist",
        "url": "https://gauravsaxena.site",
        "logo": "https://gauravsaxena.site/icon.png",
        "image": "https://gauravsaxena.site/og-image.png",
        "description": "Premium creative development and full-stack engineering services for global clients.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Jaipur",
            "addressRegion": "Rajasthan",
            "addressCountry": "IN"
        },
        "priceRange": "$$$",
        "areaServed": [
            {
                "@type": "Country",
                "name": "United States"
            },
            {
                "@type": "Country",
                "name": "United Kingdom"
            },
            {
                "@type": "Country",
                "name": "India"
            },
            {
                "@type": "AdministrativeArea",
                "name": "Remote"
            }
        ],
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Creative Engineering Services",
            "itemListElement": [
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Custom Web Application Development",
                        "description": "Scalable, high-performance web apps using Next.js and React."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "3D Web Experiences",
                        "description": "Immersive 3D/WebGL experiences using Three.js and React Three Fiber."
                    }
                },
                {
                    "@type": "Offer",
                    "itemOffered": {
                        "@type": "Service",
                        "name": "Design System Architecture",
                        "description": "Building scalable, accessible design systems for enterprise products."
                    }
                }
            ]
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
