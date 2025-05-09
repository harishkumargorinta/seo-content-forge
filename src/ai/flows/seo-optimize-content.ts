// 'use server';
/**
 * @fileOverview An SEO content optimization AI agent.
 *
 * - optimizeContentSeo - A function that handles the content optimization process.
 * - OptimizeContentSeoInput - The input type for the optimizeContentSeo function.
 * - OptimizeContentSeoOutput - The return type for the optimizeContentSeo function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeContentSeoInputSchema = z.object({
  content: z.string().describe('The human-written content to be optimized.'),
  focusKeyword: z.string().optional().describe('The focus keyword for the content.'),
});
export type OptimizeContentSeoInput = z.infer<typeof OptimizeContentSeoInputSchema>;

const OptimizeContentSeoOutputSchema = z.object({
  title: z.string().describe('The optimized title for the content.'),
  metaDescription: z.string().describe('The optimized meta description for the content.'),
  keywords: z.string().describe('The suggested keywords for the content, separated by commas.'),
});
export type OptimizeContentSeoOutput = z.infer<typeof OptimizeContentSeoOutputSchema>;

export async function optimizeContentSeo(input: OptimizeContentSeoInput): Promise<OptimizeContentSeoOutput> {
  return optimizeContentSeoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeContentSeoPrompt',
  input: {schema: OptimizeContentSeoInputSchema},
  output: {schema: OptimizeContentSeoOutputSchema},
  prompt: `You are an SEO expert tasked with optimizing content for search engines.

  Given the following content and focus keyword (if provided), generate an optimized title, meta description, and a list of keywords.

  Content: {{{content}}}
  Focus Keyword: {{focusKeyword}}

  Title: (Concise and engaging, under 60 characters)
  Meta Description: (Informative and compelling, under 160 characters)
  Keywords: (Comma-separated, relevant to the content)
  \nOutput the result in JSON format.`,
});

const optimizeContentSeoFlow = ai.defineFlow(
  {
    name: 'optimizeContentSeoFlow',
    inputSchema: OptimizeContentSeoInputSchema,
    outputSchema: OptimizeContentSeoOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
