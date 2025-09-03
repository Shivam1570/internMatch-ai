export type Internship = {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  sector: string;
  skills: string[];
};

export type RecommendedInternship = Internship & {
  matchScore: number;
};
