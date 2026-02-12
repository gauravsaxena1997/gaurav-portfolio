'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { createPortal } from 'react-dom';
import { FAQ_ITEMS } from '@/config/faq';
import styles from './FAQModal.module.css';

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
