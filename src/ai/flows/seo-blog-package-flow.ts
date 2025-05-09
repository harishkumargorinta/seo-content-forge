
'use server';
/**
 * @fileOverview AI agent for generating a complete SEO-optimized blog package.
 *
 * - generateSeoBlogPackage - A function that handles the blog package generation process.
 * - SeoBlogPackageInput - The input type for the function.
 * - SeoBlogPackageOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { GenerateContentInput } from './content-writer-flow'; // Re-use if identical

// Input schema can re-use or adapt from GenerateContentInputSchema
const SeoBlogPackageInputSchema = z.object({
  topic: z.string().min(1, "Topic is required.").describe('The main topic for the blog package.'),
  contentType: z.enum(['article', 'blog post']).default('blog post').describe('The type of content to generate (e.g., article, blog post).'),
  focusKeywords: z.string().optional().describe('Comma-separated focus keywords for SEO optimization.'),
  targetAudience: z.string().optional().describe('The intended audience for the content.'),
  desiredTone: z.string().optional().describe('The desired tone for the content (e.g., formal, casual, humorous).'),
  approximateWordCount: z.number().optional().describe('The approximate desired word count for the content.'),
});
export type SeoBlogPackageInput = z.infer<typeof SeoBlogPackageInputSchema>;

const SeoBlogPackageOutputSchema = z.object({
  title: z.string().describe('The SEO-optimized title for the content.'),
  metaDescription: z.string().describe('The SEO-optimized meta description for the content.'),
  suggestedKeywords: z.string().describe('A list of relevant keywords, comma-separated.'),
  slug: z.string().describe('A URL-friendly slug for the content.'),
  outline: z.string().describe('A structured outline for the content in Markdown list format (e.g., using headings or nested bullet points).'),
  contentBody: z.string().describe('The main content body in Markdown format, following the generated outline.'),
  seoScore: z.string().describe('An SEO score (e.g., "85/100" or "Good") assessing the overall SEO quality of the generated outputs.'),
});
export type SeoBlogPackageOutput = z.infer<typeof SeoBlogPackageOutputSchema>;

export async function generateSeoBlogPackage(input: SeoBlogPackageInput): Promise<SeoBlogPackageOutput> {
  return seoBlogPackageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'seoBlogPackagePrompt',
  input: {schema: SeoBlogPackageInputSchema},
  output: {schema: SeoBlogPackageOutputSchema},
  prompt: `You are an expert content strategist and SEO specialist. Your task is to generate a complete, SEO-optimized {{contentType}} package on the topic: "{{topic}}".
Ensure all generated outputs are highly SEO-optimized to rank well in search engines and provide comprehensive value.

{{#if targetAudience}}
The content should be tailored for the following target audience: {{targetAudience}}.
{{/if}}
{{#if desiredTone}}
The desired tone of the content is: {{desiredTone}}.
{{/if}}
{{#if focusKeywords}}
Please ensure the content is optimized for the following focus keywords: {{focusKeywords}}. Integrate these keywords naturally throughout the title, meta description, outline, headings, and body.
{{/if}}
{{#if approximateWordCount}}
The desired length for the content is approximately {{approximateWordCount}} words. Strive for this length, but prioritize quality, SEO, and completeness.
{{/if}}

Generate the following components for the blog package:
1.  **SEO-Optimized Title**: Impactful, keyword-rich, and ideally under 70 characters.
2.  **SEO-Optimized Meta Description**: Compelling, keyword-inclusive, and ideally under 160 characters.
3.  **Suggested Keywords**: A list of 5-10 relevant keywords (comma-separated) that complement focus keywords and cover related search terms.
4.  **URL-Friendly Slug**: E.g., "how-to-create-seo-blog-package".
5.  **Structured Outline**: A detailed outline for the {{contentType}} in Markdown list format. Use headings (e.g., '## Main Section', '### Sub-section') or nested bullet points (e.g., '* Main point', '  * Sub-point 1', '  * Sub-point 2'). This outline should guide the contentBody.
6.  **Main Content Body**: The full {{contentType}} in Markdown format, written based on the generated outline. Ensure it's unique, engaging, well-researched (if applicable), provides significant value, and is structured with clear headings, paragraphs, and lists as appropriate.
7.  **Overall SEO Score**: An assessment (e.g., "90/100" or "Excellent - 92/100") of the entire package's SEO quality, considering title, meta description, keywords, outline structure, content body (keyword integration, readability, uniqueness), and ranking potential.

Output the result as a single JSON object. The JSON object MUST have the following keys: "title" (string), "metaDescription" (string), "suggestedKeywords" (string), "slug" (string), "outline" (string), "contentBody" (string), and "seoScore" (string).
The "outline" and "contentBody" values must be single strings containing the complete Markdown formatted content.`,
});

const seoBlogPackageFlow = ai.defineFlow(
  {
    name: 'seoBlogPackageFlow',
    inputSchema: SeoBlogPackageInputSchema,
    outputSchema: SeoBlogPackageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
