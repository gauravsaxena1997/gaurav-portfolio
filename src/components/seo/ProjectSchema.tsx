import { ICaseStudy } from '@/data/caseStudies';

interface ProjectSchemaProps {
    project: ICaseStudy;
}

export function ProjectSchema({ project }: ProjectSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        "name": project.title,
        "description": project.shortDescription,
        "applicationCategory": "WebApplication",
        "operatingSystem": "Any",
        "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
        },
        "author": {
            "@type": "Person",
            "name": "Gaurav Saxena",
            "url": "https://gauravsaxena.site"
        },
        "screenshot": project.thumbnail ? `https://gauravsaxena.site${project.thumbnail}` : undefined,
        "featureList": project.features,
        "softwareRequirements": project.techStack.join(', '),
        "url": project.liveUrl
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
