export const SUMMARY_SNIPPET = `class FreelanceDeveloper {
  private expertise = {
      frontend: ['React', 'Angular', 'Next.js', 'TypeScript'],
      backend: ['Node.js', 'Express', 'PostgreSQL', 'MongoDB'],
      integrations: ['Stripe', 'Razorpay', 'Supabase', 'Firebase'],
      deployment: ['Vercel', 'AWS', 'Docker']
  };

  public deliverResults(): void {
      console.log('// 5+ years building web applications');
      console.log('// AI-enhanced workflow: 30-40% faster delivery');
      console.log('// Ready to bring your ideas to life!');
  }
}`;

export const ABOUT_SNIPPET = `# About Me

## Gaurav Saxena
**Freelance Full-Stack Developer** | 5+ years experience

---

I'm a freelance full-stack developer with 5+ years of
experience building web applications that drive results.

Previously at **Zetwerk** and **Ongraph**, I built scalable
systems serving thousands of users.

### What I Bring
- Deep expertise in React, Angular, Node.js
- Experience with complex business workflows
- Focus on clean, maintainable code
- Clear communication throughout the project

### My Workflow
> AI handles the routine. I handle the thinking.

\`\`\`
Result: Projects ship 30-40% faster.
        Quality stays high.
\`\`\`

### Beyond Development
> I don't stop at deployment.

- Performance Audits & Optimization
- SEO Analysis & Implementation
- Post-launch Monitoring & Support
- Security Audits & Best Practices

---

*Let's build something great together.*
`;

export const SUBMIT_BTN_TEXT = {
  DEFAULT: 'execute(sendMessage);',
  IN_PROGRESS: 'HTTP 102: pinging server...',
  SUCCESS: 'HTTP 200: Mission accomplished!',
  FAILED: 'HTTP 500: Transmission failed!',
} as const;

export const TYPED_STRINGS = {
  hero: ['Hello World!', 'Gaurav Saxena'],
} as const;
