export function ServiceSchema() {
    const BASE = "https://gauravsaxena.site";
    const PROVIDER = { "@id": `${BASE}/#person` };

    const services = [
        {
            "@type": "Service",
            "@id": `${BASE}/#service-web-development`,
            "name": "Custom Web Application Development",
            "description": "Scalable, high-performance web applications built with React and Next.js 15. Includes single-page applications, progressive web apps, server-side rendering, and REST/GraphQL API development.",
            "provider": PROVIDER,
            "serviceType": "Web Development",
            "areaServed": { "@type": "AdministrativeArea", "name": "Worldwide (Remote)" },
            "offers": {
                "@type": "Offer",
                "availability": "https://schema.org/InStock",
                "priceCurrency": "USD"
            }
        },
        {
            "@type": "Service",
            "@id": `${BASE}/#service-mvp`,
            "name": "MVP Development for Startups",
            "description": "Rapid minimum viable product development for startups and entrepreneurs. Investor-ready demos delivered in weeks. Includes proof-of-concept builds, quick iteration cycles, and launch strategy.",
            "provider": PROVIDER,
            "serviceType": "MVP Development",
            "areaServed": { "@type": "AdministrativeArea", "name": "Worldwide (Remote)" }
        },
        {
            "@type": "Service",
            "@id": `${BASE}/#service-saas`,
            "name": "SaaS Platform Development",
            "description": "Full-stack SaaS application architecture and development. Multi-tenant systems, billing and subscription management (Stripe), user management, analytics dashboards, and admin portals.",
            "provider": PROVIDER,
            "serviceType": "SaaS Development",
            "areaServed": { "@type": "AdministrativeArea", "name": "Worldwide (Remote)" }
        },
        {
            "@type": "Service",
            "@id": `${BASE}/#service-ai`,
            "name": "AI-Powered Application Development",
            "description": "Integration of LLMs (OpenAI, Claude) and AI agent orchestration into web applications. Includes intelligent chatbots, AI dashboards, automated workflows, and multi-agent coordination systems.",
            "provider": PROVIDER,
            "serviceType": "AI Development",
            "areaServed": { "@type": "AdministrativeArea", "name": "Worldwide (Remote)" }
        },
        {
            "@type": "Service",
            "@id": `${BASE}/#service-ecommerce`,
            "name": "E-commerce Development",
            "description": "Custom e-commerce stores with seamless payment integration (Stripe, Razorpay, Shopify). Includes product catalogs, inventory management, cart and checkout flows, and order management systems.",
            "provider": PROVIDER,
            "serviceType": "E-commerce Development",
            "areaServed": { "@type": "AdministrativeArea", "name": "Worldwide (Remote)" }
        },
        {
            "@type": "Service",
            "@id": `${BASE}/#service-consulting`,
            "name": "Technical Consulting & Architecture Review",
            "description": "Expert-level code audits, architecture reviews, tech stack decisions, and performance optimization consulting. Ideal for teams wanting a second opinion or a roadmap before building.",
            "provider": PROVIDER,
            "serviceType": "Technical Consulting",
            "areaServed": { "@type": "AdministrativeArea", "name": "Worldwide (Remote)" }
        },
        {
            "@type": "Service",
            "@id": `${BASE}/#service-3d`,
            "name": "3D Web Experiences & WebGL Development",
            "description": "Immersive 3D and WebGL web experiences using Three.js and React Three Fiber. Interactive product visualisations, animated hero sections, particle systems, and GPU-accelerated web graphics.",
            "provider": PROVIDER,
            "serviceType": "Creative Development",
            "areaServed": { "@type": "AdministrativeArea", "name": "Worldwide (Remote)" }
        }
    ];

    // ProfessionalService wrapper with full catalog
    const professionalServiceSchema = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": `${BASE}/#professional-service`,
        "name": "Gaurav Saxena — Freelance Full Stack Developer",
        "url": BASE,
        "logo": `${BASE}/icon.png`,
        "image": `${BASE}/profile.webp`,
        "description": "Premium full stack development and AI engineering services for startups and businesses worldwide. 6+ years experience. Remote-first, global clients.",
        "founder": PROVIDER,
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Jaipur",
            "addressRegion": "Rajasthan",
            "addressCountry": "IN"
        },
        "areaServed": [
            { "@type": "Country", "name": "United States" },
            { "@type": "Country", "name": "United Kingdom" },
            { "@type": "Country", "name": "India" },
            { "@type": "Country", "name": "Canada" },
            { "@type": "Country", "name": "Australia" },
            { "@type": "AdministrativeArea", "name": "Europe" },
            { "@type": "AdministrativeArea", "name": "Middle East" }
        ],
        "priceRange": "$$$",
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Full Stack Development & AI Engineering Services",
            "itemListElement": services.map((svc, i) => ({
                "@type": "ListItem",
                "position": i + 1,
                "item": svc
            }))
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(professionalServiceSchema) }}
        />
    );
}
