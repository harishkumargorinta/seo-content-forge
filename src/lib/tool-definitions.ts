
import type React from 'react';
import {
  Workflow, GanttChartSquare, Quote, BookText, BookOpen, PackageCheck,
  BookUser, Blocks, GraduationCap, Palette, LibraryBig, PanelTopOpen,
  Settings2, PenSquare, LayoutList, FileCode2, Wrench, History, Globe, Home, ListChecks
} from 'lucide-react';

export interface ToolDefinition {
  slug: string;
  title: string;
  description: string;
  icon: React.ElementType; // Lucide icon component
  pageTitle: string;
  link: string;
  isComingSoon?: boolean;
  isExisting?: boolean; // To differentiate from new tools for UI logic if needed
  category?: 'Content Creation' | 'SEO & Marketing' | 'Business & Branding' | 'Productivity';
}

export const allTools: ToolDefinition[] = [
  // Existing Tools (can be refactored to use this structure too)
  {
    slug: 'seo-optimizer',
    title: 'SEO Optimizer',
    description: 'Refine titles, meta descriptions, and keywords with AI analysis. Boost your organic reach.',
    icon: Settings2,
    pageTitle: 'SEO Optimizer',
    link: '/seo-optimizer',
    isExisting: true,
    category: 'SEO & Marketing',
  },
  {
    slug: 'content-writer',
    title: 'Content Writer',
    description: 'Generate high-quality articles and blog posts with AI. Create unique, SEO-friendly content.',
    icon: PenSquare,
    pageTitle: 'Content Writer',
    link: '/content-writer',
    isExisting: true,
    category: 'Content Creation',
  },
   {
    slug: 'content-importer',
    title: 'Content Importer',
    description: 'Fetch content from any URL and let AI rewrite it into fresh, unique, and optimized material.',
    icon: FileCode2,
    pageTitle: 'Content Importer',
    link: '/content-importer',
    isExisting: true,
    category: 'Content Creation',
  },
  {
    slug: 'comparison-builder',
    title: 'Comparison Builder',
    description: 'Create engaging side-by-side comparisons. Attract high-intent traffic and provide value.',
    icon: LayoutList,
    pageTitle: 'Comparison Builder',
    link: '/comparison-builder',
    isExisting: true,
    category: 'Content Creation',
  },
  {
    slug: 'seo-blog-package',
    title: 'SEO Blog Package',
    description: 'Generate a complete blog post: title, meta, outline, content, and SEO analysis.',
    icon: PackageCheck,
    pageTitle: 'SEO Blog Package Generator',
    link: '/seo-blog-package',
    isExisting: true,
    isComingSoon: false,
    category: 'Content Creation', // Changed from SEO & Marketing to align with content generation focus
  },
  // New Tools (Coming Soon)
  {
    slug: 'blog-workflow',
    title: 'Blog Workflow',
    description: 'Streamline your blogging process from idea to publication with guided steps.',
    icon: Workflow,
    pageTitle: 'Blog Workflow Tool',
    link: '/blog-workflow',
    isComingSoon: true,
    category: 'Content Creation',
  },
  {
    slug: 'blog-tools',
    title: 'Blog Tools',
    description: 'A suite of utilities for bloggers: headline analyzers, readability checkers, and more.',
    icon: GanttChartSquare,
    pageTitle: 'Blog Tools',
    link: '/blog-tools',
    isComingSoon: true,
    category: 'Content Creation',
  },
  {
    slug: 'copywriting-frameworks',
    title: 'Copywriting Frameworks',
    description: 'Generate persuasive copy using proven frameworks like AIDA, PAS, and FAB.',
    icon: Quote,
    pageTitle: 'Copywriting Frameworks',
    link: '/copywriting-frameworks',
    isComingSoon: true,
    category: 'Content Creation',
  },
  {
    slug: 'book-chapter-writer',
    title: 'Book Chapter Writer',
    description: 'AI assistance for drafting chapters for your non-fiction book, focusing on structure.',
    icon: BookText,
    pageTitle: 'Book Chapter Writer',
    link: '/book-chapter-writer',
    isComingSoon: true,
    category: 'Content Creation',
  },
  {
    slug: 'book-writing',
    title: 'Book Writing Suite',
    description: 'Comprehensive tools for your book writing journey, from outlining to character development.',
    icon: BookOpen,
    pageTitle: 'Book Writing Tools',
    link: '/book-writing',
    isComingSoon: true,
    category: 'Content Creation',
  },
  {
    slug: 'employee-handbook',
    title: 'Employee Handbook Generator',
    description: 'Create a professional employee handbook with standard policies and customizable sections.',
    icon: BookUser,
    pageTitle: 'Employee Handbook Generator',
    link: '/employee-handbook',
    isComingSoon: true,
    category: 'Business & Branding',
  },
  {
    slug: 'product-management-tools',
    title: 'Product Management Toolkit',
    description: 'Tools for product managers: user story generators, feature prioritization, and roadmap ideas.',
    icon: Blocks,
    pageTitle: 'Product Management Tools',
    link: '/product-management-tools',
    isComingSoon: true,
    category: 'Productivity',
  },
  {
    slug: 'course-creator',
    title: 'Course Creator Assistant',
    description: 'Design and outline engaging online courses, generate module content, and create quiz questions.',
    icon: GraduationCap,
    pageTitle: 'Course Creator',
    link: '/course-creator',
    isComingSoon: true,
    category: 'Content Creation',
  },
  {
    slug: 'branding-package',
    title: 'Branding Package Generator',
    description: 'Develop your brand identity with AI-generated mission statements, taglines, and more.',
    icon: Palette,
    pageTitle: 'Branding Package Generator',
    link: '/branding-package',
    isComingSoon: true,
    category: 'Business & Branding',
  },
  {
    slug: 'complete-brand-content',
    title: 'Complete Brand Content',
    description: 'Generate a full suite of brand content: website copy, social media posts, email templates.',
    icon: LibraryBig,
    pageTitle: 'Complete Brand Content Suite',
    link: '/complete-brand-content',
    isComingSoon: true,
    category: 'Business & Branding',
  },
  {
    slug: 'homepage-copy-writer',
    title: 'Perfect Homepage Copy',
    description: 'Craft compelling and conversion-focused copy for your website\'s homepage.',
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
