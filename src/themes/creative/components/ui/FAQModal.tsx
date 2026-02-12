'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';
import styles from './FAQModal.module.css';

// Expanded FAQ list for SEO domination
const FAQ_ITEMS = [
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
    }
];

interface FAQModalProps {
    isOpen: boolean;
    onClose: () => void;
    onContactClick?: () => void;
}

export function FAQModal({ isOpen, onClose, onContactClick }: FAQModalProps) {
    const [openIndex, setOpenIndex] = useState<number | null>(0); // Open first by default
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    if (!mounted || !isOpen) return null;

    // JSON-LD for SEO (embedded in modal, read by crawlers)
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

    return createPortal(
        <div className={styles.overlay} onClick={onClose}>
            <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="faq-title"
            >
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
                />

                <div className={styles.header}>
                    <h2 id="faq-title" className={styles.title}>Frequently Asked Questions</h2>
                    <button className={styles.closeButton} onClick={onClose} aria-label="Close FAQ">
                        <X size={24} />
                    </button>
                </div>

                <div className={styles.scrollArea}>
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
                                    <ChevronDown className={styles.icon} size={20} />
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

                    <div className={styles.footer}>
                        <p>
                            Still have questions?
                            <button
                                className={styles.ctaButton}
                                onClick={onContactClick}
                            >
                                Send me a message directly
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
