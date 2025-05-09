'use server';
/**
 * @fileOverview A content generation AI agent for articles and blog posts.
 *
 * - generateContent - A function that handles the content generation process.
 * - GenerateContentInput - The input type for the generateContent function.
 * - GenerateContentOutput - The return type for the generateContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateContentInputSchema = z.object({
  topic: z.string().min(1, "Topic is required.").describe('The main topic for the content to be generated.'),
  contentType: z.enum(['article', 'blog post']).default('article').describe('The type of content to generate (e.g., article, blog post).'),
  focusKeywords: z.string().optional().describe('Comma-separated focus keywords for SEO optimization.'),
  targetAudience: z.string().optional().describe('The intended audience for the content.'),
  desiredTone: z.string().optional().describe('The desired tone for the content (e.g., formal, casual, humorous).'),
  approximateWordCount: z.number().optional().describe('The approximate desired word count for the content.'),
});
export type GenerateContentInput = z.infer<typeof GenerateContentInputSchema>;

const GenerateContentOutputSchema = z.object({
  title: z.string().describe('The SEO-optimized title for the content.'),
  metaDescription: z.string().describe('The SEO-optimized meta description for the content.'),
  suggestedKeywords: z.string().describe('A list of relevant keywords, comma-separated.'),
  slug: z.string().describe('A URL-friendly slug for the content.'),
  contentBody: z.string().describe('The main content body in Markdown format.'),
});
export type GenerateContentOutput = z.infer<typeof GenerateContentOutputSchema>;

export async function generateContent(input: GenerateContentInput): Promise<GenerateContentOutput> {
  return contentWriterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'contentWriterPrompt',
  input: {schema: GenerateContentInputSchema},
  output: {schema: GenerateContentOutputSchema},
  prompt: `You are an expert content writer and SEO specialist. Your task is to generate a compelling and informative {{contentType}} on the topic: "{{topic}}".

{{#if targetAudience}}
The content should be tailored for the following target audience: {{targetAudience}}.
{{/if}}
{{#if desiredTone}}
The desired tone of the content is: {{desiredTone}}.
{{/if}}
{{#if focusKeywords}}
Please ensure the content is optimized for the following focus keywords: {{focusKeywords}}. Integrate these keywords naturally throughout the text.
{{/if}}
{{#if approximateWordCount}}
The desired length for the content is approximately {{approximateWordCount}} words. Strive for this length, but prioritize quality and completeness.
{{/if}}

Generate the following:
1.  An SEO-optimized title. Aim for under 70 characters, but prioritize impact and keyword relevance.
2.  An SEO-optimized meta description. Aim for under 160 characters, make it compelling and include keywords.
3.  A list of 5-10 relevant keywords, comma-separated. These should complement the focus keywords if provided.
4.  A URL-friendly slug for the content (e.g., "benefits-of-plant-based-diet").
5.  The main content body in Markdown format. Structure the content with clear headings (e.g., '## Main Section', '### Subsection'), paragraphs, bullet points (using '*' or '-'), and numbered lists where appropriate. Ensure the content is unique, engaging, well-researched (if applicable to the topic), and provides significant value to the reader. Avoid plagiarism and generic statements. Aim for a high-quality piece that would rank well in search engine results.

Output the result as a single JSON object. The JSON object MUST have the following keys: "title" (string), "metaDescription" (string), "suggestedKeywords" (string), "slug" (string), and "contentBody" (string).
The "contentBody" value must be a single string containing the complete Markdown formatted article or blog post.`,
});

const contentWriterFlow = ai.defineFlow(
  {
    name: 'contentWriterFlow',
    inputSchema: GenerateContentInputSchema,
    outputSchema: GenerateContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
