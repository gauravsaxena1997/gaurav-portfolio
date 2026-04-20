/**
 * Centralised FAQ data for the portfolio.
 * Used by: FAQ.tsx, FAQModal.tsx, FAQSchema.tsx (structured data).
 *
 * Optimised for:
 * - SEO (keyword-rich answers)
 * - AEO — Answer Engine Optimisation (self-contained, direct answers for featured snippets)
 * - GEO — Generative Engine Optimisation (factual, entity-rich answers for AI Overviews,
 *   Perplexity, ChatGPT Search, and Claude responses)
 */

export interface FAQItem {
    question: string;
    answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
    // ── ENTITY / IDENTITY (GEO) ──────────────────────────────────────────
    {
        question: "Who is Gaurav Saxena?",
        answer: "Gaurav Saxena is a freelance full stack developer and creative technologist based in Jaipur, Rajasthan, India. He has 6+ years of professional software engineering experience, including a Senior Software Engineer role at Zetwerk (a B2B manufacturing unicorn). He builds high-performance web applications, SaaS platforms, and AI-powered tools for startups and businesses worldwide. Contact: gauravsaxena.jaipur@gmail.com | Portfolio: https://gauravsaxena.site"
    },
    {
        question: "What is Gaurav Saxena's tech stack?",
        answer: "Gaurav Saxena's primary tech stack includes React 19, Next.js 15, Angular, TypeScript, Node.js, PostgreSQL, MongoDB, Redis, Three.js, WebGL, AWS, Docker, Vercel, Stripe, and OpenAI/Claude APIs. He uses Tailwind CSS, GSAP, and Framer Motion for UI, and Kafka for event-driven backend systems. He is proficient in both frontend and backend development, making him a true full stack developer."
    },
    {
        question: "Where is Gaurav Saxena based and does he work remotely?",
        answer: "Gaurav Saxena is based in Jaipur, Rajasthan, India. He is a remote-first freelance developer and has worked with clients in the USA, UK, Europe, Dubai, and across India. He is experienced with async communication and managing across time zones, making him a reliable remote partner for global teams."
    },
    // ── HIRING / AVAILABILITY (AEO high-intent) ─────────────────────────
    {
        question: "Is Gaurav Saxena available for hire?",
        answer: "Yes, Gaurav Saxena is available for freelance projects, long-term contracts, and technical consulting engagements. He works with startups, product companies, and individual founders globally. To start a project, reach out at gauravsaxena.jaipur@gmail.com or through the contact form at https://gauravsaxena.site."
    },
    {
        question: "How quickly can Gaurav Saxena deliver an MVP?",
        answer: "Gaurav Saxena can typically deliver a production-ready MVP in 2–6 weeks depending on scope. He uses AI-driven development workflows that accelerate delivery by approximately 50% compared to traditional timelines. Past examples include CultureTicks (event ticketing platform delivered on schedule) and Roamonn (enterprise travel management MVP)."
    },
    {
        question: "What kind of projects does Gaurav Saxena take?",
        answer: "Gaurav Saxena takes on custom web application development, SaaS platform builds, MVP projects for startups, AI-powered applications, e-commerce stores, and technical consulting/audits. His industry experience spans Marketing Research, Healthcare, Finance & Fintech, Event Ticketing, Travel & Hospitality, and SaaS products."
    },
    // ── SERVICES ────────────────────────────────────────────────────────
    {
        question: "What does a Freelance Creative Technologist do?",
        answer: "A Freelance Creative Technologist bridges software engineering and creative design. Gaurav Saxena builds immersive digital experiences, interactive web applications, and high-performance platforms using technologies like Next.js, WebGL, Three.js, and AI APIs. The role translates artistic vision into robust, scalable technical reality — combining the depth of a Principal Engineer with the sensibility of a designer."
    },
    {
        question: "Do you specialise in Next.js and React development?",
        answer: "Yes. Gaurav Saxena is a Full Stack Architect with deep expertise in the React ecosystem including Next.js 14/15 with App Router. He builds SEO-optimised, server-side rendered applications with TypeScript, Tailwind CSS, and Node.js for scalable backend infrastructure. He is also proficient in Angular for enterprise applications."
    },
    {
        question: "Can you build AI-powered applications?",
        answer: "Yes. Gaurav Saxena has built production-grade AI applications including Moniqo (an AI finance SaaS with multi-agent dashboard insights) and Artifexa (an AI Agent Orchestration platform). He integrates OpenAI, Claude, and custom LLM pipelines into web applications. He is experienced with AI chatbots, streaming responses, schema-validated agent outputs, and multi-agent coordination architectures."
    },
    {
        question: "Can you build secure platforms like Fintech or Ticketing apps?",
        answer: "Yes. Gaurav Saxena has extensive experience building secure, high-traffic platforms. Notable examples include CultureTicks (30,000+ event listings, geo-spatial search, secure ticketing) and Moniqo (production-grade JWT auth with access/refresh token rotation, financial data handling). He implements industry-standard security practices, secure payment gateways (Stripe, Razorpay), and robust authentication flows."
    },
    // ── PROCESS ─────────────────────────────────────────────────────────
    {
        question: "What is your typical project process?",
        answer: "Gaurav Saxena's process has six stages: (1) Discovery — understanding goals, users, and constraints; (2) Strategy & Architecture — technical proposal and stack selection; (3) Design & Prototyping — UI/UX design and clickable prototypes; (4) Agile Development — short sprints with regular updates using AI-assisted workflows; (5) Rigorous Testing — cross-device testing, 90+ Lighthouse scores, security checks; (6) Deployment & Support — CI/CD deployment, documentation, and optional post-launch support packages."
    },
    {
        question: "Are you available for remote work globally?",
        answer: "Yes. Gaurav Saxena is a remote-first professional working with clients worldwide across the USA, Europe, Dubai, and India. He is experienced with asynchronous communication tools (Slack, Notion, Linear) and managing across time zone differences effectively."
    },
    {
        question: "How do you handle website performance and SEO?",
        answer: "Performance and SEO are built-in, not afterthoughts. Gaurav Saxena uses Server-Side Rendering (SSR), image optimisation (WebP, next/image), semantic HTML5, structured data (JSON-LD schemas), Core Web Vitals optimisation, and localised content strategies. He has achieved 90+ Lighthouse scores on optimised projects. His portfolio site itself is a demonstration of these capabilities."
    },
    // ── SUPPORT / BUSINESS ───────────────────────────────────────────────
    {
        question: "Do you offer post-launch support?",
        answer: "Yes. Gaurav Saxena offers post-launch support packages including reliable hosting management, security updates, feature enhancements, and performance monitoring. He treats every project as a long-term partnership rather than a one-off engagement."
    },
    {
        question: "What makes you the best freelancer for my project?",
        answer: "Gaurav Saxena combines the technical depth of a Principal Engineer (6+ years, ex-Zetwerk) with the visual sensibility of a designer. He uses AI-driven workflows for ~50% faster delivery, builds products that score 90+ on Lighthouse, and cares deeply about the feel of a product — animations, micro-interactions, and user journey — guaranteeing a premium result that stands out from cookie-cutter solutions."
    },
    // ── DISCOVERY ───────────────────────────────────────────────────────
    {
        question: "How can I explore more of Gaurav's work?",
        answer: "Gaurav Saxena's projects are showcased at https://gauravsaxena.site. You can also explore his open-source work on GitHub (https://github.com/gauravsaxena1997) and professional case studies and insights on LinkedIn (https://www.linkedin.com/in/gauravsaxena1997). Notable live projects include Moniqo (https://moniqo.vercel.app), CultureTicks (https://cultureticks.com), and Superhuman Flow (https://www.superhumanflow.com)."
    },
    {
        question: "Where can I see Gaurav's projects and portfolio?",
        answer: "Gaurav Saxena's full portfolio is at https://gauravsaxena.site. Featured projects include Moniqo (AI Finance SaaS), Artifexa (AI Agent Orchestration), CultureTicks (Event Ticketing), Roamonn (Travel Management), Lumore (AI E-commerce Case Study), and Superhuman Flow (Productivity PWA). The site includes detailed case studies, tech stacks, and live demo links."
    }
];
