
import type React from 'react';
import {
  Workflow, GanttChartSquare, Quote, BookText, BookOpen, PackageCheck,
  BookUser, Blocks, GraduationCap, Palette, LibraryBig, PanelTopOpen,
  Settings2, PenSquare, LayoutList, FileCode2, Wrench, History, Globe, Home, ListChecks,
  Film, Youtube, Tags, Facebook, MessageSquarePlus, Hash, Brain, Zap, Users, Sparkles // Added Sparkles for benefits, ensured others are present
} from 'lucide-react';

export type ToolCategory = 'Content Creation' | 'SEO & Marketing' | 'Social Media' | 'Business & Branding' | 'Productivity';

export interface ToolDefinition {
  slug: string;
  title: string;
  description: string;
  icon: React.ElementType; // Lucide icon component
  pageTitle: string;
  link: string;
  isComingSoon?: boolean;
  isExisting?: boolean;
  category: ToolCategory;
}

export const allTools: ToolDefinition[] = [
  // Existing Tools
  {
    slug: 'seo-optimizer',
    title: 'SEO Optimizer',
    description: 'Refine content with AI analysis for titles, meta descriptions, and keywords to boost organic reach.',
    icon: Settings2,
    pageTitle: 'SEO Optimizer',
    link: '/seo-optimizer',
    isExisting: true,
    category: 'SEO & Marketing',
  },
  {
    slug: 'content-writer',
    title: 'Content Writer',
    description: 'Generate high-quality articles and blog posts. Create unique, SEO-friendly content effortlessly.',
    icon: PenSquare,
    pageTitle: 'Content Writer',
    link: '/content-writer',
    isExisting: true,
    category: 'Content Creation',
  },
   {
    slug: 'content-importer',
    title: 'Article Rewriter',
    description: 'Fetch content from any URL and let AI rewrite it into fresh, unique, and optimized material.',
    icon: FileCode2,
    pageTitle: 'Content Importer & Rewriter',
    link: '/content-importer',
    isExisting: true,
    category: 'Content Creation',
  },
  {
    slug: 'comparison-builder',
    title: 'Comparison Table Builder',
    description: 'Create engaging side-by-side comparison tables to attract high-intent traffic and provide value.',
    icon: LayoutList,
    pageTitle: 'Comparison Builder',
    link: '/comparison-builder',
    isExisting: true,
    category: 'Content Creation',
  },
  {
    slug: 'seo-blog-package',
    title: 'SEO Blog Package',
    description: 'Generate a complete blog post: title, meta description, outline, full content, and SEO analysis.',
    icon: PackageCheck,
    pageTitle: 'SEO Blog Package Generator',
    link: '/seo-blog-package',
    isExisting: true,
    isComingSoon: false,
    category: 'Content Creation',
  },
  {
    slug: 'youtube-title-generator',
    title: 'YouTube Title Generator',
    description: 'Generate catchy, SEO-friendly titles for your YouTube videos. Attract more viewers instantly.',
    icon: Youtube,
    pageTitle: 'YouTube Title Generator',
    link: '/youtube-title-generator',
    isExisting: true,
    isComingSoon: false,
    category: 'Social Media',
  },
  {
    slug: 'youtube-description-tags',
    title: 'YouTube Description & Tags',
    description: 'Create SEO-optimized descriptions and relevant tags for YouTube videos from script or title.',
    icon: Tags,
    pageTitle: 'YouTube Description & Tags Generator',
    link: '/youtube-description-tags',
    isExisting: true,
    isComingSoon: false,
    category: 'Social Media',
  },
  {
    slug: 'facebook-title-generator',
    title: 'Facebook Post Titles',
    description: 'Craft engaging and click-worthy titles/headlines for your Facebook posts with AI assistance.',
    icon: Facebook,
    pageTitle: 'Facebook Title Generator',
    link: '/facebook-title-generator',
    isExisting: true,
    isComingSoon: false,
    category: 'Social Media',
  },
  {
    slug: 'facebook-description-tags',
    title: 'Facebook Desc. & Hashtags',
    description: 'Generate compelling descriptions and relevant hashtags for your Facebook posts to boost engagement.',
    icon: MessageSquarePlus,
    pageTitle: 'Facebook Description & Hashtags Generator',
    link: '/facebook-description-tags',
    isExisting: true,
    isComingSoon: false,
    category: 'Social Media',
  },
  // New Tools (Coming Soon)
  {
    slug: 'blog-workflow',
    title: 'Blog Workflow Assistant',
    description: 'Streamline your blogging process from idea to publication with guided AI-powered steps and checklists.',
    icon: Workflow,
    pageTitle: 'Blog Workflow Tool',
    link: '/blog-workflow',
    isComingSoon: true,
    category: 'Productivity',
  },
  {
    slug: 'blog-tools',
    title: 'Advanced Blog Tools',
    description: 'A suite of utilities for bloggers: headline analyzers, readability checkers, content repurposing, and more.',
    icon: GanttChartSquare,
    pageTitle: 'Blog Tools',
    link: '/blog-tools',
    isComingSoon: true,
    category: 'Content Creation',
  },
  {
    slug: 'copywriting-frameworks',
    title: 'Copywriting Frameworks (AIDA, PAS)',
    description: 'Generate persuasive marketing copy using proven frameworks like AIDA, PAS, and FAB.',
    icon: Quote,
    pageTitle: 'Copywriting Frameworks',
    link: '/copywriting-frameworks',
    isComingSoon: true,
    category: 'SEO & Marketing',
  },
  {
    slug: 'book-chapter-writer',
    title: 'Book Chapter Writer (Non-Fiction)',
    description: 'AI assistance for drafting well-structured chapters for your non-fiction book projects.',
    icon: BookText,
    pageTitle: 'Book Chapter Writer',
    link: '/book-chapter-writer',
    isComingSoon: true,
    category: 'Content Creation',
  },
  {
    slug: 'book-writing',
    title: 'Comprehensive Book Writing Suite',
    description: 'Tools for your entire book writing journey, from outlining and plot development to character arcs.',
    icon: BookOpen,
    pageTitle: 'Book Writing Tools',
    link: '/book-writing',
    isComingSoon: true,
    category: 'Content Creation',
  },
  {
    slug: 'employee-handbook',
    title: 'Employee Handbook Generator',
    description: 'Create a professional employee handbook with standard policies and easily customizable sections.',
    icon: BookUser,
    pageTitle: 'Employee Handbook Generator',
    link: '/employee-handbook',
    isComingSoon: true,
    category: 'Business & Branding',
  },
  {
    slug: 'product-management-tools',
    title: 'Product Management Toolkit',
    description: 'AI tools for product managers: user story generation, feature prioritization, and roadmap ideas.',
    icon: Blocks,
    pageTitle: 'Product Management Tools',
    link: '/product-management-tools',
    isComingSoon: true,
    category: 'Productivity',
  },
  {
    slug: 'course-creator',
    title: 'Online Course Creator Assistant',
    description: 'Design and outline engaging online courses, generate module content, and create quiz questions.',
    icon: GraduationCap,
    pageTitle: 'Course Creator',
    link: '/course-creator',
    isComingSoon: true,
    category: 'Content Creation',
  },
  {
    slug: 'branding-package',
    title: 'AI Branding Package Generator',
    description: 'Develop your brand identity with AI: mission statements, taglines, value propositions, and more.',
    icon: Palette,
    pageTitle: 'Branding Package Generator',
    link: '/branding-package',
    isComingSoon: true,
    category: 'Business & Branding',
  },
  {
    slug: 'complete-brand-content',
    title: 'Complete Brand Content Suite',
    description: 'Generate a full suite of on-brand content: website copy, social media posts, email templates.',
    icon: LibraryBig,
    pageTitle: 'Complete Brand Content Suite',
    link: '/complete-brand-content',
    isComingSoon: true,
    category: 'Business & Branding',
  },
  {
    slug: 'homepage-copy-writer',
    title: 'Perfect Homepage Copywriter',
    description: 'Craft compelling, engaging, and conversion-focused copy specifically for your website homepage.',
    icon: PanelTopOpen,
    pageTitle: 'Homepage Copy Writer',
    link: '/homepage-copy-writer',
    isComingSoon: true,
    category: 'Content Creation',
  },
];

export const getToolBySlug = (slug: string): ToolDefinition | undefined => {
  return allTools.find(tool => tool.slug === slug);
};

export const toolCategories: ToolCategory[] = ['Content Creation', 'SEO & Marketing', 'Social Media', 'Business & Branding', 'Productivity'];

// Icons for benefits section on landing page
export const BenefitIcons = {
  Brain,
  Zap,
  Users,
  Sparkles
};
