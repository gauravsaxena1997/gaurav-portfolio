export function PersonSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "@id": "https://gauravsaxena.site/#person",
        "name": "Gaurav Saxena",
        "givenName": "Gaurav",
        "familyName": "Saxena",
        "url": "https://gauravsaxena.site",
        "image": {
            "@type": "ImageObject",
            "url": "https://gauravsaxena.site/profile.webp",
            "width": 340,
            "height": 340,
            "caption": "Gaurav Saxena — Freelance Full Stack Developer"
        },
        "jobTitle": "Freelance Full Stack Developer & Creative Technologist",
        "description": "Gaurav Saxena is a freelance full stack developer and creative technologist based in Jaipur, India, with 6+ years of professional software engineering experience. He builds high-performance web applications, SaaS platforms, and AI-powered tools for global clients. Previously Senior Software Engineer at Zetwerk (B2B manufacturing unicorn).",
        "email": "gauravsaxena.jaipur@gmail.com",
        "nationality": {
            "@type": "Country",
            "name": "India"
        },
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Jaipur",
            "addressRegion": "Rajasthan",
            "addressCountry": "IN",
            "postalCode": "302001"
        },
        "mainEntityOfPage": {
            "@type": "ProfilePage",
            "@id": "https://gauravsaxena.site/#profilepage"
        },
        "worksFor": {
            "@type": "Organization",
            "name": "Self-Employed / Freelance",
            "url": "https://gauravsaxena.site"
        },
        "hasOccupation": {
            "@type": "Occupation",
            "name": "Full Stack Developer",
            "occupationLocation": {
                "@type": "Country",
                "name": "India"
            },
            "description": "Freelance full stack web developer specialising in React, Next.js, Node.js, and AI-powered applications",
            "skills": "React, Next.js, TypeScript, Node.js, PostgreSQL, MongoDB, Three.js, AWS, Docker, AI/LLM Integration"
        },
        "alumniOf": [
            {
                "@type": "CollegeOrUniversity",
                "name": "JECRC Foundation",
                "url": "https://www.jecrc.ac.in",
                "address": {
                    "@type": "PostalAddress",
                    "addressLocality": "Jaipur",
                    "addressCountry": "IN"
                }
            }
        ],
        "knowsAbout": [
            "React",
            "Next.js",
            "Angular",
            "TypeScript",
            "JavaScript",
            "Node.js",
            "Three.js",
            "WebGL",
            "React Three Fiber",
            "PostgreSQL",
            "MongoDB",
            "Redis",
            "Kafka",
            "AWS",
            "Docker",
            "Vercel",
            "OpenAI API",
            "AI Agent Orchestration",
            "LLM Integration",
            "Full Stack Development",
            "System Architecture",
            "SaaS Development",
            "MVP Development",
            "E-commerce Development",
            "Performance Optimization",
            "SEO",
            "UI/UX Design",
            "Stripe Integration",
            "GraphQL",
            "CI/CD"
        ],
        "knowsLanguage": [
            {
                "@type": "Language",
                "name": "English",
                "alternateName": "en"
            },
            {
                "@type": "Language",
                "name": "Hindi",
                "alternateName": "hi"
            }
        ],
        "sameAs": [
            "https://www.linkedin.com/in/gauravsaxena1997",
            "https://github.com/gauravsaxena1997",
            "https://x.com/GauravSaxenaHQ",
            "https://www.instagram.com/thenoobfreelancer",
            "https://www.reddit.com/user/GauravSaxenaHQ/"
        ],
        "workExample": [
            {
                "@type": "WebSite",
                "name": "Moniqo — AI Finance SaaS",
                "url": "https://moniqo.vercel.app/",
                "description": "AI-powered personal finance SaaS with multi-agent dashboard insights and financial chatbot"
            },
            {
                "@type": "WebSite",
                "name": "CultureTicks — Event Ticketing Platform",
                "url": "https://cultureticks.com",
                "description": "Scalable event discovery and ticketing platform with 30,000+ active listings"
            },
            {
                "@type": "WebSite",
                "name": "Roamonn — Travel Management System",
                "url": "https://roamonn.vercel.app/",
                "description": "Enterprise travel management platform with multi-tenant architecture and RBAC"
            },
            {
                "@type": "WebSite",
                "name": "Superhuman Flow — Productivity PWA",
                "url": "https://www.superhumanflow.com",
                "description": "Offline-first productivity suite with Pomodoro, ambient sounds, and focus analytics"
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
