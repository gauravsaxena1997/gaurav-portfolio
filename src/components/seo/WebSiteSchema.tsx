export function WebSiteSchema() {
    const BASE = "https://gauravsaxena.site";

    const schema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${BASE}/#website`,
        "name": "Gaurav Saxena | Freelance Full Stack Developer & Creative Technologist",
        "alternateName": "Gaurav Saxena Portfolio",
        "url": BASE,
        "description": "Official portfolio of Gaurav Saxena — freelance full stack developer and creative technologist from Jaipur, India. 6+ years experience building web applications, SaaS platforms, and AI-powered tools for global clients.",
        "inLanguage": "en-US",
        "author": {
            "@id": `${BASE}/#person`
        },
        "creator": {
            "@id": `${BASE}/#person`
        },
        "publisher": {
            "@id": `${BASE}/#person`
        },
        "copyrightHolder": {
            "@id": `${BASE}/#person`
        },
        "copyrightYear": "2025",
        "about": {
            "@id": `${BASE}/#person`
        },
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${BASE}/projects?q={search_term_string}`
            },
            "query-input": "required name=search_term_string"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
