/**
 * Centralized FAQ data for the portfolio
 * Used by both FAQ.tsx and FAQModal.tsx components
 */

export interface FAQItem {
    question: string;
    answer: string;
}

/**
 * Comprehensive FAQ list optimized for SEO and user clarity
 * Covers services, process, technical expertise, and business model
 */
export const FAQ_ITEMS: FAQItem[] = [
    {
        question: "What does a Freelance Creative Technologist do?",
        answer: "As a Freelance Creative Technologist, I bridge the gap between software engineering and creative design. I build immersive digital experiences, interactive installations, and high-performance web platforms using technologies like Next.js, WebGL, and Three.js. My role is to translate artistic vision into robust, scalable technical reality."
    },
    {
        question: "Do you specialize in Next.js and React development?",
        answer: "Yes, I am a Full Stack Architect with deep expertise in the React ecosystem (Next.js 14/15). I build SEO-optimized, server-side rendered applications that are blazing fast. My stack includes TypeScript, Tailwind CSS, and Node.js for scalable backend infrastructure."
    },
    {
        question: "What is your typical project process?",
        answer: "My process is designed for clarity and impact: Discovery (Understanding your goals) → Strategy & Architecture → Design & Prototyping → Agile Development → Rigorous Testing → Deployment. I believe in transparent communication and verified milestones."
    },
    {
        question: "Can you build secure platforms like Fintech or Ticketing apps?",
        answer: "Absolutely. I have extensive experience building secure, high-traffic platforms (e.g., CultureTicks, Roamonn). I implement industry-standard security practices, secure payment gateways (Stripe/Razorpay), and robust authentication flows to protect user data."
    },
    {
        question: "Are you available for remote work globally?",
        answer: "Yes, I am a remote-first professional working with clients worldwide (USA, Europe, Dubai, India). I am accustomed to asynchronous communication and managing time zone differences effectively."
    },
    {
        question: "How do you handle website performance and SEO?",
        answer: "Performance is a priority, not an afterthought. I use modern techniques like Server-Side Rendering (SSR), image optimization, localized content strategies, and semantic HTML to ensure your site ranks high on Google and loads instantly on mobile devices."
    },
    {
        question: "Do you offer post-launch support?",
        answer: "Yes, I offer various support packages including reliable hosting management, security updates, and feature enhancements. I treat every project as a long-term partnership."
    },
    {
        question: "What makes you the best freelancer for my project?",
        answer: "I combine the technical depth of a Principal Engineer with the visual sensibility of a Designer. Unlike standard developers, I care deeply about the 'feel' of the product—animations, micro-interactions, and user journey—guaranteeing a premium result."
    },
    {
        question: "How can I explore more of Gaurav's work?",
        answer: "You can explore Gaurav's work across a few places — GitHub for open-source projects and technical code, and LinkedIn where he regularly shares case studies, insights, and blog posts. If you're a developer, GitHub is a great place to see his code quality and project structure. If you're a business owner or recruiter, LinkedIn showcases his professional journey and real-world impact."
    },
    {
        question: "Where can I see Gaurav's projects and portfolio?",
        answer: "Gaurav's projects are showcased right here on this portfolio. You can also find his open-source work on GitHub and professional case studies on LinkedIn. His portfolio includes projects in e-commerce, fintech, healthcare, and AI-powered applications."
    }
];
