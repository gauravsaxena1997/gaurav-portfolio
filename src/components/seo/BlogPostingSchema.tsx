import { IBlogPost } from '@/data/blog';

interface BlogPostingSchemaProps {
    post: IBlogPost;
}

export function BlogPostingSchema({ post }: BlogPostingSchemaProps) {
    const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt,
        "image": post.thumbnail ? `https://gauravsaxena.site${post.thumbnail}` : undefined,
        "author": {
            "@type": "Person",
            "name": post.author,
            "url": "https://gauravsaxena.site"
        },
        "publisher": {
            "@type": "Person",
            "name": "Gaurav Saxena",
            "logo": {
                "@type": "ImageObject",
                "url": "https://gauravsaxena.site/icon.png"
            }
        },
        "datePublished": post.publishedAt,
        "dateModified": post.publishedAt, // Using published date as modified for now
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://gauravsaxena.site/blog/${post.slug}`
        },
        "keywords": post.tags.join(', ')
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
    );
}
