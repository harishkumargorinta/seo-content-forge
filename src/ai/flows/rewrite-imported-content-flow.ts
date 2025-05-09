
'use server';
/**
 * @fileOverview An AI agent for fetching content from a URL and rewriting it.
 * This flow utilizes the fetchWebContentTool to retrieve content from the web.
 *
 * - rewriteImportedContent - A function that handles fetching and rewriting content.
 * - RewriteImportedContentInput - The input type for the function.
 * - RewriteImportedContentOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import {fetchWebContentTool} from '@/ai/tools/fetch-web-content-tool';

const RewriteImportedContentInputSchema = z.object({
  articleUrl: z.string().url().describe("The URL of the article to fetch and rewrite."),
  customInstructions: z.string().optional().describe("Optional custom instructions for the rewriting process, e.g., desired tone, specific keywords to include/exclude, target audience."),
});
export type RewriteImportedContentInput = z.infer<typeof RewriteImportedContentInputSchema>;

const RewriteImportedContentOutputSchema = z.object({
  originalUrl: z.string().url(),
  rewrittenTitle: z.string().describe('A new, SEO-optimized title for the rewritten content.'),
  rewrittenMetaDescription: z.string().describe('A new, SEO-optimized meta description for the rewritten content.'),
  rewrittenContentBody: z.string().describe('The rewritten content in Markdown format, unique and plagiarism-free.'),
  detectedError: z.string().optional().describe("Error message if fetching or rewriting failed.")
});
export type RewriteImportedContentOutput = z.infer<typeof RewriteImportedContentOutputSchema>;

export async function rewriteImportedContent(input: RewriteImportedContentInput): Promise<RewriteImportedContentOutput> {
  return rewriteImportedContentFlow(input);
}

const rewritePrompt = ai.definePrompt({
  name: 'rewriteImportedContentPrompt',
  input: { schema: z.object({ 
    fetchedContent: z.string(), 
    articleUrl: z.string().url(),
    customInstructions: z.string().optional(),
  }) },
  output: { schema: RewriteImportedContentOutputSchema.omit({ detectedError: true, originalUrl: true }) },
  prompt: `You are an expert content rewriter and SEO specialist.
Your task is to rewrite the following content fetched from an external URL to make it unique, engaging, and SEO-optimized.
The goal is to create original content that avoids plagiarism while retaining the core information and value of the original text.

Original Content (fetched from {{articleUrl}}):
\`\`\`
{{{fetchedContent}}}
\`\`\`

Instructions for rewriting:
1.  **Uniqueness:** The rewritten content MUST be substantially different from the original to pass plagiarism checks. Do not just replace words with synonyms; rephrase sentences and restructure paragraphs.
2.  **Accuracy:** Preserve the factual information and key messages of the original content.
3.  **SEO Optimization:**
    *   Generate a new, compelling, SEO-optimized title (under 70 characters if possible, prioritizing impact).
    *   Generate a new, concise, SEO-optimized meta description (under 160 characters, compelling and keyword-rich).
4.  **Format:** The main rewritten content body MUST be in Markdown format. Use appropriate headings (e.g., '## Section', '### Subsection'), paragraphs, bullet points (using '*' or '-'), and lists.
5.  **Quality:** Ensure the rewritten content is high-quality, readable, and provides value. It should be suitable for ranking well in search engines. Avoid generic statements.
{{#if customInstructions}}
6.  **Custom Instructions:** Adhere to the following custom instructions: {{customInstructions}}
{{/if}}

Output the result as a single JSON object. The JSON object MUST have the following keys: "rewrittenTitle" (string), "rewrittenMetaDescription" (string), and "rewrittenContentBody" (string).
The "rewrittenContentBody" value must be a single string containing the complete Markdown formatted rewritten article.`,
});

const rewriteImportedContentFlow = ai.defineFlow(
  {
    name: 'rewriteImportedContentFlow',
    inputSchema: RewriteImportedContentInputSchema,
    outputSchema: RewriteImportedContentOutputSchema,
  },
  async (input) => {
    // Step 1: Fetch content using the tool
    const fetchResult = await fetchWebContentTool({ url: input.articleUrl });

    if (fetchResult.error || !fetchResult.content) {
      return {
        originalUrl: input.articleUrl,
        rewrittenTitle: '',
        rewrittenMetaDescription: '',
        rewrittenContentBody: '',
        detectedError: fetchResult.error || 'Failed to fetch content or content was empty.',
      };
    }

    // Step 2: Pass fetched content to the rewrite prompt
    const {output} = await rewritePrompt({
      fetchedContent: fetchResult.content,
      articleUrl: input.articleUrl,
      customInstructions: input.customInstructions,
    });

    if (!output) {
        return {
            originalUrl: input.articleUrl,
            rewrittenTitle: '',
            rewrittenMetaDescription: '',
            rewrittenContentBody: '',
            detectedError: 'AI failed to generate rewritten content. The prompt might have timed out or returned an unexpected result.',
        };
    }
    
    return {
        ...output,
        originalUrl: input.articleUrl,
    };
  }
);

