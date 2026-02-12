'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './FAQ.module.css';

const FAQ_ITEMS = [
    {
        question: "What services do you offer?",
        answer: "I specialize in Full-Stack Web Development (React, Next.js, Node.js), High-Performance Interactive UIs (Creative Technology), and Scalable System Architecture. I help startups and businesses build products that are both technically robust and visually stunning."
    },
    {
        question: "What is your typical process?",
        answer: "My process is collaborative and transparent: Discovery & Strategy → Design & Prototyping → Agile Development → Testing & QA → Deployment & Handover. I focus on clear communication and delivering value at every stage."
    },
    {
        question: "Do you work with agencies or startups?",
        answer: "Yes, I work with both. I partner with digital agencies as a technical consultant/lead developer and help seed-stage startups build their MVPs and scale their engineering teams."
    },
    {
        question: "What is your pricing model?",
        answer: "I offer both project-based (fixed price) and retainer-based (monthly) engagement models depending on the project scope and long-term needs. Contact me to discuss a custom quote."
    }
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    // Structured Data for SEO
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQ_ITEMS.map(item => ({
            "@type": "Question",
            "name": item.question,
            "acceptedAnswer": {
                "@type": "Answer",
                "text": item.answer
            }
        }))
    };

    return (
        <div className={styles.container}>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />

            <h3 className={styles.heading}>Common Questions</h3>

            <div className={styles.list}>
                {FAQ_ITEMS.map((item, index) => (
                    <div
                        key={index}
                        className={`${styles.item} ${openIndex === index ? styles.open : ''}`}
                    >
                        <button
                            className={styles.questionButton}
                            onClick={() => toggleFAQ(index)}
                            aria-expanded={openIndex === index}
                        >
                            <span className={styles.questionText}>{item.question}</span>
                            <ChevronDown className={styles.icon} size={16} />
                        </button>
                        <div
                            className={styles.answerWrapper}
                            aria-hidden={openIndex !== index}
                        >
                            <p className={styles.answerText}>{item.answer}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
