'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQ_ITEMS } from '@/config/faq';
import styles from './FAQ.module.css';

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);

    };

    return (
        <div className={styles.container}>
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
