export interface IProfile {
  name: string;
  title: string;
  tagline: string;
  experience: string;
  location: string;
  email: string;
  linkedin: string;
  github?: string;
  instagram?: string;
  passion: string;
  currentFocus: string;
}

export interface IEducation {
  title: string;
  institution: string;
  branch?: string;
  passOutYear: string;
}

export const PROFILE: IProfile = {
  name: 'Gaurav Saxena',
  title: 'Freelance Full-Stack Developer',
  tagline: 'I Build Web Apps That Drive Results',
  experience: '5+ years',
  location: 'Jaipur, Rajasthan',
  email: 'gauravsaxena.jaipur@gmail.com',
  linkedin: 'https://www.linkedin.com/in/gauravsaxena1997',
  github: 'https://github.com/gauravsaxena1997',
  instagram: 'https://www.instagram.com/de_art_dimension/',
  passion: 'Building scalable web applications',
  currentFocus:
    'Helping startups and businesses build scalable web applications',
};

export const EDUCATION: IEducation[] = [
  {
    title: 'B. Tech',
    institution: 'JECRC Foundation, Jaipur',
    branch: 'CSE',
    passOutYear: '2019',
  },
  {
    title: 'Senior Secondary',
    institution: 'Shri Maheshwari Senior Secondary School',
    passOutYear: '2015',
  },
];
