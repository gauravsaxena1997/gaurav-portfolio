export interface ITechSkill {
  name: string;
  icon: string;
}

export interface ISkillCategory {
  category: string;
  label: string;
  skills: ITechSkill[];
}

// Categorized skills with sidebar labels
export const SKILL_CATEGORIES: ISkillCategory[] = [
  {
    category: 'web',
    label: 'Web',
    skills: [
      { name: 'React', icon: 'react' },
      { name: 'Angular', icon: 'angularjs' },
      { name: 'Next.js', icon: 'nextjs' },
      { name: 'TypeScript', icon: 'typescript' },
      { name: 'JavaScript', icon: 'javascript' },
      { name: 'Tailwind', icon: 'tailwindcss' },
      { name: 'Node.js', icon: 'nodejs' },
      { name: 'Express', icon: 'express' },
      { name: 'PostgreSQL', icon: 'postgresql' },
      { name: 'MongoDB', icon: 'mongodb' },
      { name: 'Redis', icon: 'redis' },
    ],
  },
  {
    category: 'devops',
    label: 'DevOps',
    skills: [
      { name: 'Docker', icon: 'docker' },
      { name: 'AWS', icon: 'amazonwebservices' },
      { name: 'Git', icon: 'git' },
      { name: 'GitHub Actions', icon: 'github' },
      { name: 'Vercel', icon: 'vercel' },
      { name: 'Linux', icon: 'linux' },
    ],
  },
  {
    category: 'uiux',
    label: 'UI/UX',
    skills: [
      { name: 'Figma', icon: 'figma' },
      { name: 'CSS3', icon: 'css3' },
      { name: 'Sass', icon: 'sass' },
      { name: 'HTML5', icon: 'html5' },
    ],
  },
  {
    category: 'integrations',
    label: 'Integrations',
    skills: [
      { name: 'Supabase', icon: 'supabase' },
      { name: 'Firebase', icon: 'firebase' },
      { name: 'Stripe', icon: 'stripe' },
      { name: 'GraphQL', icon: 'graphql' },
      { name: 'REST APIs', icon: 'postman' },
    ],
  },
];

// Flat list for backwards compatibility
export const TECH_SKILLS: ITechSkill[] = SKILL_CATEGORIES.flatMap(
  (cat) => cat.skills
);
