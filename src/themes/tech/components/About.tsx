'use client';

import { ABOUT_SNIPPET } from '@/data';
import { useTheme } from '@/hooks';
import { useSectionAnimation } from '../hooks';
import styles from './About.module.css';

function MarkdownRenderer({ content }: { content: string }) {
  const lines = content.split('\n');

  return (
    <div className={styles.markdownContent}>
      {lines.map((line, idx) => {
        // H1 headers
        if (line.startsWith('# ')) {
          return (
            <div key={idx} className={styles.h1}>
              <span className={styles.hash}># </span>
              {line.slice(2)}
            </div>
          );
        }
        // H2 headers
        if (line.startsWith('## ')) {
          return (
            <div key={idx} className={styles.h2}>
              <span className={styles.hash}>## </span>
              {line.slice(3)}
            </div>
          );
        }
        // H3 headers
        if (line.startsWith('### ')) {
          return (
            <div key={idx} className={styles.h3}>
              <span className={styles.hash}>### </span>
              {line.slice(4)}
            </div>
          );
        }
        // Horizontal rule
        if (line === '---') {
          return <hr key={idx} className={styles.hr} />;
        }
        // Blockquote
        if (line.startsWith('> ')) {
          return (
            <div key={idx} className={styles.blockquote}>
              <span className={styles.quoteSymbol}>&gt; </span>
              {line.slice(2)}
            </div>
          );
        }
        // List items
        if (line.startsWith('- ')) {
          return (
            <div key={idx} className={styles.listItem}>
              <span className={styles.bullet}>- </span>
              {line.slice(2)}
            </div>
          );
        }
        // Code block markers
        if (line === '```') {
          return <div key={idx} className={styles.codeMarker}>```</div>;
        }
        // Bold text (simple handling)
        if (line.includes('**')) {
          const parts = line.split(/(\*\*[^*]+\*\*)/g);
          return (
            <div key={idx} className={styles.paragraph}>
              {parts.map((part, pIdx) => {
                if (part.startsWith('**') && part.endsWith('**')) {
                  return (
                    <span key={pIdx} className={styles.bold}>
                      {part.slice(2, -2)}
                    </span>
                  );
                }
                return <span key={pIdx}>{part}</span>;
              })}
            </div>
          );
        }
        // Italic text
        if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
          return (
            <div key={idx} className={styles.italic}>
              {line.slice(1, -1)}
            </div>
          );
        }
        // Empty lines
        if (line === '') {
          return <div key={idx} className={styles.emptyLine}></div>;
        }
        // Regular paragraph
        return (
          <div key={idx} className={styles.paragraph}>
            {line}
          </div>
        );
      })}
    </div>
  );
}

export function About() {
  const { isDarkTheme } = useTheme();
  const sectionTitleRef = useSectionAnimation('about');

  return (
    <section id="about" className={styles.aboutSection}>
      <div className={styles.container}>
        <h2 className={`${styles.sectionTitle} code-font`}>
          <span ref={sectionTitleRef} className="section-title"></span>
        </h2>
        <div className={styles.terminalWrapper}>
          <div className={`terminal ${!isDarkTheme ? 'light-terminal' : ''}`}>
            <div className="terminal-header">
              <div className="terminal-buttons">
                <span></span>
                <span></span>
                <span></span>
              </div>
              <div className="terminal-title">about.md</div>
            </div>
            <div className="terminal-body">
              <MarkdownRenderer content={ABOUT_SNIPPET} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
