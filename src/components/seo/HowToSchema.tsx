/**
 * HowTo schema — schema.org/HowTo
 * Represents the development process as a structured how-to.
 * Directly powers AEO (Answer Engine Optimisation) — surfaces in
 * Google AI Overviews, Perplexity answers, and ChatGPT responses
 * for queries like "how does a freelance developer work" or
 * "what is the process to hire a web developer".
 */
export function HowToSchema() {
    const BASE = "https://gauravsaxena.site";

    const schema = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "@id": `${BASE}/#how-to-hire`,
        "name": "How to Work with Gaurav Saxena — Freelance Full Stack Developer",
        "description": "A step-by-step overview of Gaurav Saxena's development process for freelance web application, SaaS, and AI projects. Designed for clarity, transparency, and verified milestones.",
        "totalTime": "PT4W",
        "supply": [
            {
                "@type": "HowToSupply",
                "name": "Project brief or idea description"
            },
            {
                "@type": "HowToSupply",
                "name": "Budget range and timeline expectations"
            }
        ],
        "tool": [
            {
                "@type": "HowToTool",
                "name": "React / Next.js"
            },
            {
                "@type": "HowToTool",
                "name": "Node.js / PostgreSQL"
            },
            {
                "@type": "HowToTool",
                "name": "AWS / Vercel"
            }
        ],
        "step": [
            {
                "@type": "HowToStep",
                "position": 1,
                "name": "Discovery",
                "text": "A focused call to understand your goals, users, constraints, and success metrics. Gaurav asks the right questions to ensure the solution fits your actual needs — not just the stated requirements.",
                "url": `${BASE}/#contact`
            },
            {
                "@type": "HowToStep",
                "position": 2,
                "name": "Strategy & Architecture",
                "text": "Gaurav defines the technical approach, stack selection, system architecture, and project scope. You receive a clear technical proposal before a single line of code is written.",
                "url": `${BASE}/#contact`
            },
            {
                "@type": "HowToStep",
                "position": 3,
                "name": "Design & Prototyping",
                "text": "UI/UX design and clickable prototypes are created for review. Feedback is incorporated before development starts to avoid costly rework.",
                "url": `${BASE}/#contact`
            },
            {
                "@type": "HowToStep",
                "position": 4,
                "name": "Agile Development",
                "text": "Development proceeds in short sprints with regular updates. Gaurav uses AI-driven workflows to deliver code approximately 50% faster without sacrificing quality or security.",
                "url": `${BASE}/#contact`
            },
            {
                "@type": "HowToStep",
                "position": 5,
                "name": "Rigorous Testing",
                "text": "Every feature is tested across devices, browsers, and edge cases. Performance audits target 90+ Lighthouse scores. Security vulnerabilities and accessibility issues are resolved before launch.",
                "url": `${BASE}/#contact`
            },
            {
                "@type": "HowToStep",
                "position": 6,
                "name": "Deployment & Support",
                "text": "Production deployment with CI/CD, monitoring, and documentation. Post-launch support packages available including feature enhancements, security updates, and hosting management.",
                "url": `${BASE}/#contact`
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
