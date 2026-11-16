export interface ServiceItem {
  id: string;
  number: string;
  title: string;
  category: string;
  description: string;
  deliverables: string[];
  impactMetric: string;
}

export interface CaseStudyItem {
  id: string;
  client: string;
  industry: string;
  year?: string;
  image: string;
  headline: string;
  stages?: {
    idea?: string;
    identity?: string;
    digital?: string;
    marketing?: string;
    growth?: string;
  };
  selectedSteps?: ('idea' | 'identity' | 'digital' | 'marketing' | 'growth')[];
  metrics: {
    metric: string;
    label: string;
  }[];
}

export interface Enquiry {
  id: string;
  name: string;
  email: string;
  company: string;
  stage: string;
  timeline: string;
  budget: string;
  concept: string;
  createdAt: string;
  status: 'new' | 'reviewing' | 'contacted' | 'closed';
}

export interface CareerOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  compensation: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
  status: 'active' | 'closed';
  postedAt: string;
}

export interface CareerApplication {
  id: string;
  openingId: string;
  openingTitle: string;
  department: string;
  name: string;
  email: string;
  phone: string;
  portfolioUrl: string;
  experience: string;
  coverNote: string;
  createdAt: string;
  status: 'new' | 'reviewing' | 'shortlisted' | 'closed';
}

export interface OwnerProfile {
  name: string;
  role: string;
  headline?: string;
  image: string;
  bio: string;
  quote: string;
}

export interface OwnerBlogPost {
  id: string;
  title: string;
  category: string;
  readTime: string;
  publishedAt: string;
  excerpt: string;
  content: string;
  ownerName?: string;
  ownerRole?: string;
  ownerImage?: string;
  coverImage?: string;
  status: 'published' | 'draft';
}

export interface SiteContent {
  header: {
    originLabsLabel: string;
    originLabsUrl: string;
    startProjectLabel: string;
  };
  hero: {
    headlineLine1: string;
    headlineLine2: string;
    subheadline: string;
    ctaPrimary: string;
    ctaSecondary: string;
    bannerBadge: string;
  };
  idea: {
    headline: string;
    quote: string;
    tamMarket: string;
  };
  naming: {
    headline: string;
    quote: string;
  };
  identity: {
    headline: string;
    quote: string;
  };
  guideline: {
    headline: string;
    quote: string;
  };
  digital: {
    headline: string;
    quote: string;
  };
  marketing: {
    headline: string;
    quote: string;
  };
  footprint: {
    headline: string;
    quote: string;
  };
  transformation: {
    headline: string;
    quote: string;
  };
  about: {
    headline: string;
    quote: string;
    tenets: {
      num: string;
      title: string;
      desc: string;
    }[];
  };
  services: ServiceItem[];
  projects: CaseStudyItem[];
  careers?: CareerOpening[];
  careerApplications?: CareerApplication[];
  ownerProfile?: OwnerProfile;
  ownerBlogs?: OwnerBlogPost[];
  performance: {
    headline: string;
    quote: string;
    counterSteps: {
      label: string;
      value: string;
      unit: string;
    }[];
  };
  finalCta: {
    headlineLine1: string;
    headlineLine2: string;
    startHere: string;
    subtext: string;
    buttonText: string;
  };
}

export type OriginStageId = 
  | 'hero'
  | 'idea' 
  | 'name' 
  | 'identity' 
  | 'guideline' 
  | 'digital' 
  | 'marketing' 
  | 'performance' 
  | 'footprint' 
  | 'services' 
  | 'work' 
  | 'about' 
  | 'contact';
