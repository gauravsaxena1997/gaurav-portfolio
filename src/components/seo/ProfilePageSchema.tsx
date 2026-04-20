/**
 * ProfilePage schema — schema.org/ProfilePage
 * Explicitly tells search engines and AI models that this is a person's profile page.
 * Strongly recommended for GEO (Generative Engine Optimisation) and
 * AI Overview surfacing in Google, Perplexity, ChatGPT Search, and Bing.
 */
export function ProfilePageSchema() {
    const BASE = "https://gauravsaxena.site";

    const schema = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "@id": `${BASE}/#profilepage`,
        "name": "Gaurav Saxena — Freelance Full Stack Developer Portfolio",
        "url": BASE,
        "description": "Official portfolio of Gaurav Saxena, a freelance full stack developer and creative technologist based in Jaipur, India. 6+ years experience. Available for freelance projects worldwide.",
        "inLanguage": "en-US",
        "dateModified": new Date().toISOString().split('T')[0],
        "dateCreated": "2024-01-01",
        "author": {
            "@id": `${BASE}/#person`
        },
        "mainEntity": {
            "@id": `${BASE}/#person`
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                {
                    "@type": "ListItem",
                    "position": 1,
                    "name": "Home",
                    "item": BASE
                }
            ]
        },
        "primaryImageOfPage": {
            "@type": "ImageObject",
            "url": `${BASE}/profile.webp`,
            "width": 340,
            "height": 340,
            "caption": "Gaurav Saxena — Freelance Full Stack Developer"
        }
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
