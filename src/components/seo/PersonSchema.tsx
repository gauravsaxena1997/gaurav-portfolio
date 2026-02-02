export function PersonSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Gaurav Saxena",
        "url": "https://gauravsaxena.site",
        "image": "https://gauravsaxena.site/apple-icon.png",
        "jobTitle": "Creative Technologist",
        "description": "Creative Technologist & Full Stack Architect forging immersive digital ecosystems with Next.js, Three.js, and AI-driven architecture.",
        "email": "gauravsaxena.jaipur@gmail.com",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Jaipur",
            "addressRegion": "Rajasthan",
            "addressCountry": "India"
        },
        "sameAs": [
            "https://www.linkedin.com/in/gauravsaxena1997",
            "https://github.com/gauravsaxena1997",
            "https://twitter.com/gauravsaxena"
        ],
        "knowsAbout": [
            "Next.js 15",
            "React",
            "Three.js",
            "WebGL",
            "System Architecture",
            "Creative Development",
            "Full Stack Development",
            "AI Engineering"
        ],
        "alumniOf": {
            "@type": "EducationalOrganization",
            "name": "Jaipur Engineering College and Research Centre"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
