import { TESTIMONIALS } from '@/config/testimonials';

export function TestimonialSchema() {
    const schema = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": "Gaurav Saxena", // Matching the main PersonSchema name
        "url": "https://gauravsaxena.site",
        "review": TESTIMONIALS.map(testimonial => ({
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": testimonial.name
            },
            "reviewBody": testimonial.quote,
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": "5", // Assuming 5 stars for all curated testimonials
                "bestRating": "5",
                "worstRating": "1"
            },
            "publisher": {
                "@type": "Person",
                "name": "Gaurav Saxena"
            }
        }))
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
