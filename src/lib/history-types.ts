
import type { OptimizeContentSeoInput, OptimizeContentSeoOutput } from '@/ai/flows/seo-optimize-content';
import type { GenerateContentInput, GenerateContentOutput } from '@/ai/flows/content-writer-flow';
import type { RewriteImportedContentInput, RewriteImportedContentOutput } from '@/ai/flows/rewrite-imported-content-flow';
import type { SeoBlogPackageInput, SeoBlogPackageOutput } from '@/ai/flows/seo-blog-package-flow';
import type { GenerateYouTubeTitlesInput, GenerateYouTubeTitlesOutput } from '@/ai/flows/youtube-title-generator-flow';
import type { GenerateYouTubeDescriptionAndTagsInput, GenerateYouTubeDescriptionAndTagsOutput } from '@/ai/flows/youtube-description-tags-flow';
import type { GenerateFacebookTitlesInput, GenerateFacebookTitlesOutput } from '@/ai/flows/facebook-title-generator-flow';
import type { GenerateFacebookDescriptionTagsInput, GenerateFacebookDescriptionTagsOutput } from '@/ai/flows/facebook-description-tags-flow';
import type { GenerateBookChapterInput, GenerateBookChapterOutput } from '@/ai/flows/book-chapter-writer-flow';
import type { GenerateComicBookInput, GenerateComicBookOutput } from '@/ai/flows/comic-book-writer-flow';


export type GeneratedContentType = 
  | 'SEO_OPTIMIZATION' 
  | 'CONTENT_WRITING' 
  | 'CONTENT_IMPORT_REWRITE'
  | 'SEO_BLOG_PACKAGE'
  | 'YOUTUBE_TITLE_GENERATION'
  | 'YOUTUBE_DESCRIPTION_TAGS'
  | 'FACEBOOK_TITLE_GENERATION'
  | 'FACEBOOK_DESCRIPTION_TAGS'
  | 'BOOK_CHAPTER_WRITER'
  | 'COMIC_BOOK_WRITER';

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
  output: GenerateContentOutput; 
}

export interface ContentImporterHistoryItem extends BaseHistoryItem {
  type: 'CONTENT_IMPORT_REWRITE';
  input: RewriteImportedContentInput;
  output: RewriteImportedContentOutput; 
}

export interface SeoBlogPackageHistoryItem extends BaseHistoryItem {
  type: 'SEO_BLOG_PACKAGE';
  input: SeoBlogPackageInput;
  output: SeoBlogPackageOutput;
}

export interface YouTubeTitleGeneratorHistoryItem extends BaseHistoryItem { 
  type: 'YOUTUBE_TITLE_GENERATION';
  input: GenerateYouTubeTitlesInput;
  output: GenerateYouTubeTitlesOutput;
}

export interface YouTubeDescriptionTagsHistoryItem extends BaseHistoryItem {
  type: 'YOUTUBE_DESCRIPTION_TAGS';
  input: GenerateYouTubeDescriptionAndTagsInput;
  output: GenerateYouTubeDescriptionAndTagsOutput;
}

export interface FacebookTitleGeneratorHistoryItem extends BaseHistoryItem {
  type: 'FACEBOOK_TITLE_GENERATION';
  input: GenerateFacebookTitlesInput;
  output: GenerateFacebookTitlesOutput;
}

export interface FacebookDescriptionTagsHistoryItem extends BaseHistoryItem {
  type: 'FACEBOOK_DESCRIPTION_TAGS';
  input: GenerateFacebookDescriptionTagsInput;
  output: GenerateFacebookDescriptionTagsOutput;
}

export interface BookChapterWriterHistoryItem extends BaseHistoryItem {
  type: 'BOOK_CHAPTER_WRITER';
  input: GenerateBookChapterInput;
  output: GenerateBookChapterOutput;
}

export interface ComicBookWriterHistoryItem extends BaseHistoryItem {
  type: 'COMIC_BOOK_WRITER';
  input: GenerateComicBookInput;
  output: GenerateComicBookOutput;
}


export type GeneratedHistoryItem = 
  | SeoHistoryItem 
  | ContentWriterHistoryItem 
  | ContentImporterHistoryItem
  | SeoBlogPackageHistoryItem
  | YouTubeTitleGeneratorHistoryItem
  | YouTubeDescriptionTagsHistoryItem
  | FacebookTitleGeneratorHistoryItem
  | FacebookDescriptionTagsHistoryItem
  | BookChapterWriterHistoryItem
  | ComicBookWriterHistoryItem;

// Utility type for adding history items, omitting the id and timestamp as they'll be generated
export type NewSeoHistoryData = Omit<SeoHistoryItem, 'id' | 'timestamp'>;
export type NewContentWriterHistoryData = Omit<ContentWriterHistoryItem, 'id' | 'timestamp'>;
export type NewContentImporterHistoryData = Omit<ContentImporterHistoryItem, 'id' | 'timestamp'>;
export type NewSeoBlogPackageHistoryData = Omit<SeoBlogPackageHistoryItem, 'id' | 'timestamp'>;
export type NewYouTubeTitleGeneratorHistoryData = Omit<YouTubeTitleGeneratorHistoryItem, 'id' | 'timestamp'>; 
export type NewYouTubeDescriptionTagsHistoryData = Omit<YouTubeDescriptionTagsHistoryItem, 'id' | 'timestamp'>;
export type NewFacebookTitleGeneratorHistoryData = Omit<FacebookTitleGeneratorHistoryItem, 'id' | 'timestamp'>;
export type NewFacebookDescriptionTagsHistoryData = Omit<FacebookDescriptionTagsHistoryItem, 'id' | 'timestamp'>;
export type NewBookChapterWriterHistoryData = Omit<BookChapterWriterHistoryItem, 'id' | 'timestamp'>;
export type NewComicBookWriterHistoryData = Omit<ComicBookWriterHistoryItem, 'id' | 'timestamp'>;


export type NewGeneratedHistoryItemData = 
  | NewSeoHistoryData
  | NewContentWriterHistoryData
  | NewContentImporterHistoryData
  | NewSeoBlogPackageHistoryData
  | NewYouTubeTitleGeneratorHistoryData
  | NewYouTubeDescriptionTagsHistoryData
  | NewFacebookTitleGeneratorHistoryData
  | NewFacebookDescriptionTagsHistoryData
  | NewBookChapterWriterHistoryData
  | NewComicBookWriterHistoryData;
