
import type { OptimizeContentSeoInput, OptimizeContentSeoOutput } from '@/ai/flows/seo-optimize-content';
import type { GenerateContentInput, GenerateContentOutput } from '@/ai/flows/content-writer-flow';
import type { RewriteImportedContentInput, RewriteImportedContentOutput } from '@/ai/flows/rewrite-imported-content-flow';

export type GeneratedContentType = 'SEO_OPTIMIZATION' | 'CONTENT_WRITING' | 'CONTENT_IMPORT_REWRITE';

export interface BaseHistoryItem {
  id: string; // Unique ID for the history item
  type: GeneratedContentType;
  timestamp: string; // ISO Date string
  primaryIdentifier: string; // e.g., Topic, URL, or a generated title
}

export interface SeoHistoryItem extends BaseHistoryItem {
  type: 'SEO_OPTIMIZATION';
  input: OptimizeContentSeoInput;
  output: OptimizeContentSeoOutput;
}

export interface ContentWriterHistoryItem extends BaseHistoryItem {
  type: 'CONTENT_WRITING';
  input: GenerateContentInput;
  output: GenerateContentOutput; // Already includes title, metaDescription, suggestedKeywords, slug, contentBody, seoScore
}

export interface ContentImporterHistoryItem extends BaseHistoryItem {
  type: 'CONTENT_IMPORT_REWRITE';
  input: RewriteImportedContentInput;
  output: RewriteImportedContentOutput; // Already includes rewrittenTitle, rewrittenMetaDescription, suggestedKeywords, rewrittenContentBody, seoScore
}

export type GeneratedHistoryItem = 
  | SeoHistoryItem 
  | ContentWriterHistoryItem 
  | ContentImporterHistoryItem;

// Utility type for adding history items, omitting the id and timestamp as they'll be generated
export type NewSeoHistoryData = Omit<SeoHistoryItem, 'id' | 'timestamp'>;
export type NewContentWriterHistoryData = Omit<ContentWriterHistoryItem, 'id' | 'timestamp'>;
export type NewContentImporterHistoryData = Omit<ContentImporterHistoryItem, 'id' | 'timestamp'>;

export type NewGeneratedHistoryItemData = 
  | NewSeoHistoryData
  | NewContentWriterHistoryData
  | NewContentImporterHistoryData;

    